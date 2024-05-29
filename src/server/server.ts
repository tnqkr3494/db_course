import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { ConnectionPool } from "mssql";
import cors from "cors";
import bcrypt from "bcrypt";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware to handle CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend address
    credentials: true, // Enable credentials
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to handle sessions
app.use(
  session({
    secret: process.env.SESSION_PASSWORD!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
    },
  })
);

// Database configuration
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

// Connect to the database
pool
  .connect()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err: any) => {
    console.error("Database connection failed:", err);
  });

/**
 * Movie API
 */

// Get movies sorted by specific criteria
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

// Search for a movie by title
app.get("/api/title/:name", async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const result = await pool.request().input("movieTitle", name).query(`
      SELECT id as movie_id
      FROM movie
      WHERE movie_name = @movieTitle
    `);
    res.status(200).json(result.recordset[0].movie_id);
  } catch (e) {
    res.status(500).send("Error retrieving data from database.");
  }
});

// Get detailed information about a specific movie
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

// Get movies by genre
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

/**
 * Authentication and User Management
 */

// User login
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Save user info in session
    req.session.user = { username: user.name, userId: user.id };

    console.log(req.session.user);

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User signup
app.post("/api/signup", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool
      .request()
      .input("userName", userName)
      .input("password", hashedPassword).query(`
        INSERT INTO users (name, password) VALUES (@userName, @password)
      `);
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User logout
app.post("/api/logout", async (req: Request, res: Response) => {
  await req.session.destroy(function (error) {
    if (error) {
      console.error("Error during logout:", error);
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

// Get logged-in user's info
app.get("/api/user", (req: Request, res: Response) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Get user's favorite movies
app.get("/api/user/favorite", async (req: Request, res: Response) => {
  if (req.session.user) {
    const result = await pool.request().input("id", req.session.user.userId)
      .query(`
      SELECT * FROM fav(@id)
    `);
    res.json(result.recordset);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Get user's tickets
app.get("/api/user/tickets", async (req: Request, res: Response) => {
  if (req.session.user) {
    const result = await pool.request().input("id", req.session.user.userId)
      .query(`
      SELECT * FROM userTicket(@id)
    `);
    res.json(result.recordset);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

/**
 * Favorite Movies
 */

// Add a movie to user's favorites
app.post("/api/like/:id", async (req: Request, res: Response) => {
  const { userId, id } = req.body;
  try {
    await pool.request().input("userId", userId).input("movieId", id).query(`
      INSERT INTO favorite VALUES (@movieId, @userId)
    `);
    res.status(200).json({ message: "Movie added to favorites" });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove a movie from user's favorites
app.post("/api/dislike/:id", async (req: Request, res: Response) => {
  const { userId, id } = req.body;
  try {
    await pool.request().input("userId", userId).input("movieId", id).query(`
      DELETE FROM favorite
      WHERE @movieId = m_id AND @userId = u_id
    `);
    res.status(200).json({ message: "Movie removed from favorites" });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Cinema Information
 */

// Get information about a specific cinema
app.get("/api/cinema/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.request().input("id", id).query(`
      SELECT c.id AS cinema_id, c.cinema_name, c.location, m.id AS movie_id, m.movie_name, m.rating, m.year, m.language, m.summary, s.part_time, s.price
      FROM cinema c
      JOIN show s ON s.c_id = c.id
      JOIN movie m ON s.m_id = m.id
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

// Get showtimes and locations for a specific movie
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

/**
 * Ticket Purchasing
 */

// Buy tickets for a show
app.post("/api/buy/tickets/:id", async (req, res) => {
  const showId = req.params.id;
  const { userId, ticketCount } = req.body;

  try {
    const result = await pool
      .request()
      .input("showId", showId)
      .input("ticketCount", ticketCount).query(`
      DECLARE @capacity INT;
      DECLARE @soldTickets INT;
      DECLARE @remain INT;

      -- Maximum capacity for the show (assuming it's a fixed value, e.g., 100 seats)
      SET @capacity = 8;

      -- Calculate the number of sold tickets for the specific show
      SELECT @soldTickets = COUNT(*)
      FROM ticket t
      JOIN show s ON t.s_id = s.id 
      WHERE s.id = @showId;

      IF (@soldTickets + @ticketCount > @capacity)
        SELECT 'Fail... We have remaining seats count : ' + CONVERT(VARCHAR, @capacity - @soldTickets) AS message;
      ELSE BEGIN
        SET @remain = @capacity - (@soldTickets + @ticketCount);
        SELECT 'Ticket remain ' + CONVERT(VARCHAR, @remain) AS message;
      END
    `);

    const message = result.recordset[0].message;
    if (message.includes("Fail")) {
      res.status(400).json({ message });
    } else {
      for (let i = 0; i < ticketCount; i++) {
        await pool.request().input("showId", showId).input("userId", userId)
          .query(`
            INSERT INTO ticket(s_id, u_id)
            VALUES (@showId, @userId)
          `);
      }
      res.status(200).json({ message: "Ticket purchased successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
