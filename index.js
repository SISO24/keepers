import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import pg from "pg";
import dotenv from "dotenv";
import session from "express-session";

const app = express();
const port = 3000;
const saltrounds = 10;
dotenv.config();

// Database connection
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/content", isAuthenticated, async (req, res) => {
  try {
    const user_id = req.session.user.id;
    const username = req.session.user.email;

    const result = await db.query(
      `
      SELECT thoughts.id, thoughts.note
      FROM thoughts
      INNER JOIN details ON thoughts.user_id = details.id
      WHERE details.id = $1
    `,
      [user_id]
    );

    const thoughts = result.rows;
    res.render("content.ejs", {
      username: username,
      Listthoughts: thoughts,
      user_id: user_id,
    });
  } catch (err) {
    console.error("Error fetching content:", err);
    return res.status(500).send("Error fetching content");
  }
});

app.post("/", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query(
      "SELECT * FROM details WHERE email = $1",
      [email]
    );
    if (checkResult.rows.length > 0) {
      return res.send("User already exists");
    } else {
      bcrypt.hash(password, saltrounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).send("Internal server error");
        }
        await db.query(
          "INSERT INTO details (email, password) VALUES ($1, $2)",
          [email, hash]
        );
        console.log("User registered successfully");
        return res.redirect("/login");
      });
    }
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).send("Internal server error");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginpassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM details WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const user = result.rows[0];
    bcrypt.compare(loginpassword, user.password, async (err, isMatch) => {
      if (err) {
        console.error("Error during password comparison:", err);
        return res.status(500).send("Internal server error");
      }

      if (isMatch) {
        req.session.user = { id: user.id, email: user.email };
        return res.redirect("/content");
      } else {
        return res.status(401).send("Invalid email or password");
      }
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send("Internal server error");
  }
});

app.post("/add", isAuthenticated, async (req, res) => {
  const user_id = req.session.user.id;
  const item = req.body.newItem;

  try {
    await db.query("INSERT INTO thoughts (note, user_id) VALUES ($1, $2)", [
      item,
      user_id,
    ]);
    console.log("Thought added successfully");
    return res.redirect("/content");
  } catch (err) {
    console.error("Error adding thought:", err);
    return res.status(500).send("Error adding thought");
  }
});

app.post("/edit", isAuthenticated, async (req, res) => {
  const updatedItemTitle = req.body.updatedItemTitle;
  const id = req.body.noteId;

  try {
    await db.query("UPDATE thoughts SET note = $1 WHERE id = $2", [
      updatedItemTitle,
      id,
    ]);
    console.log("Thought updated successfully");
    return res.redirect("/content");
  } catch (err) {
    console.error("Error updating thought:", err);
    return res.status(500).send("Error updating thought");
  }
});

app.post("/delete", isAuthenticated, async (req, res) => {
  const id = req.body.deleteItemId;

  try {
    await db.query("DELETE FROM thoughts WHERE id = $1", [id]);
    console.log("Thought deleted successfully");
    return res.redirect("/content");
  } catch (err) {
    console.error("Error deleting thought:", err);
    return res.status(500).send("Error deleting thought");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
