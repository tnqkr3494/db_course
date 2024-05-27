import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { ConnectionPool } from "mssql";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 주소
    credentials: true, // 자격 증명을 사용하도록 설정
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_PASSWORD!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // HTTPS를 사용하지 않으면 false로 설정
      httpOnly: true,
    },
  })
);

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: "localhost",
  port: 1433,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

const pool = new ConnectionPool(dbConfig);

pool
  .connect()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err: any) => {
    console.error("Database connection failed:", err);
  });

app.get("/api/movie", async (req: Request, res: Response) => {
  const { sort } = req.query;

  let orderByClause;
  switch (sort) {
    case "rating":
      orderByClause = "rating";
      break;
    case "year":
      orderByClause = "year";
      break;
    case "name":
      orderByClause = "movie_name";
      break;
    default:
      orderByClause = "movie_name";
  }

  try {
    const result = await pool
      .request()
      .query(
        `SELECT * FROM movie ORDER BY ${orderByClause} ${
          orderByClause === "rating" ? "desc" : ""
        }`
      );
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database.");
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const request = pool.request();
    const result = await request
      .input("username", username)
      .query("SELECT * FROM users WHERE name = @username");

    if (result.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = result.recordset[0];
    const isPasswordValid = Boolean(user.password === password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // 세션에 사용자 정보 저장
    req.session.user = { username: user.name, userId: user.id };

    console.log(req.session.user);

    res.status(200).json({ message: "good" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 영화 정보
app.get("/api/movie/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.request().input("id", id).query(`
      SELECT *
      FROM movie m
      JOIN movie_actor_connect mac ON m.id = mac.m_id
      JOIN director_movie_connect dmc ON m.id = dmc.m_id
      JOIN actor a ON mac.a_id = a.id
      JOIN Director d ON dmc.d_id = d.id
      WHERE m.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database.");
  }
});

app.get("/api/genre", async (req, res) => {
  const { genre } = req.query;

  if (!genre) {
    return res.status(400).json({ error: "Genre is required" });
  }

  try {
    const result = await pool
      .request()
      .input("genre", genre)
      .query("SELECT * FROM movieGenres(@genre)");

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database.");
  }
});

app.post("/api/like/:id", async (req: Request, res: Response) => {
  const { userId, id } = req.body;
  try {
    await pool.request().input("userId", userId).input("movieId", id).query(`
      INSERT INTO favorite VALUES (@movieId, @userId)
    `);
    res.status(200).json({ message: "like" });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/dislike/:id", async (req: Request, res: Response) => {
  const { userId, id } = req.body;
  try {
    await pool.request().input("userId", userId).input("movieId", id).query(`
      DELETE FROM favorite
      WHERE @movieId=m_id AND @userId=u_id
    `);
    res.status(200).json({ message: "dislike" });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
});

// 영화관 api

app.get("/api/cinema/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.request().input("id", id).query(`
      select c.id as cinema_id, c.cinema_name, c.location, m.id as movie_id, m.movie_name, m.rating, m.year, m.language, m.summary, s.part_time, s.price
      from cinema c
      join show s on s.c_id = c.id
      join movie m on s.m_id = m.id
      WHERE c.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Cinema not found" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// 이 영화가 언제 어디서 볼 수 있는지
app.get("/api/search/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.request().input("id", id).query(`
      SELECT * FROM whenWhere(@id)
    `);

    res.json(result.recordset);
  } catch (error) {
    return res.status(404).json({ error: "Movie Not Found" });
  }
});

// user profile

// 세션에 저장된 사용자 정보 가져오기
app.get("/api/user", (req: Request, res: Response) => {
  console.log(req.session.user);
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// find favorite movie list
app.get("/api/user/favorite", async (req: Request, res: Response) => {
  if (req.session.user) {
    const result = await pool.request().input("id", req.session.user.userId)
      .query(`
      select * from fav(@id)
    `);
    res.json(result.recordset);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// find favorite movie list
app.get("/api/user/tickets", async (req: Request, res: Response) => {
  if (req.session.user) {
    const result = await pool.request().input("id", req.session.user.userId)
      .query(`
      select * from userTicket(@id)
    `);
    res.json(result.recordset);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// ticket buy
app.post("/api/buy/tickets/:id", async (req, res) => {
  const showId = req.params.id;
  const { userId } = req.body;
  try {
    const result = await pool.request().input("showId", showId).query(`
        declare @capacity int;
        declare @remain int;
        select @capacity = (
          select count(*)
          from ticket t
          join show s on t.s_id = s.id 
          where s.c_id = @showId
        );

        if(@capacity > 100)
          select 'Ticket is already sold out' as message;
        else begin
          set @remain = 100 - @capacity;
          select 'Ticket remain ' + convert(varchar, @remain) as message;
        end
      `);

    const message = result.recordset[0].message;
    if (message.includes("sold out")) {
      res.status(400).json({ message });
    } else {
      await pool.request().input("showId", showId).input("userId", userId)
        .query(`
          insert into ticket(s_id, u_id)
          values (@showId, @userId)
        `);
      res.status(200).json({ message: "Ticket purchased successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
