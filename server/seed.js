const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./database.db");

async function seed() {
  const email = "JLabs@example.com"; //email and password
  const password = "JLabs@123";

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (row) {
      console.log("User already exists.");
      return;
    }

    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Default user credentials created.");
        }
      },
    );
  });
}

seed();
