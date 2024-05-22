import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { ConnectionPool } from "mssql";
import cors from "cors";
const FileStore = require("session-file-store")(session);

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // 클라이언트 주소
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true"); // 세션을 쿠키에 저장할 수 있도록 설정
  next();
});

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

app.post("/api/login", async (req: Request, res: Response) => {
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

    res.redirect("/profile");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 세션에 저장된 사용자 정보 가져오기
app.get("/api/user", (req: Request, res: Response) => {
  console.log(req.session.user);
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
