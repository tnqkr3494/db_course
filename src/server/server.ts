const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { ConnectionPool } = require("mssql");

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

if (
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_SERVER ||
  !process.env.DB_DATABASE
) {
  throw new Error("Missing required database environment variables");
}

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: "localhost", // 또는 127.0.0.1
  port: 1433, // MSSQL 서버의 포트 번호
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true, // 이 부분을 추가합니다.
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

app.get("/api/movie", async (req: any, res: any) => {
  try {
    const result = await pool.request().query(`select *
    from movie`);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database.");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
