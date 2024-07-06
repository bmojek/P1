import express from "express";
import cors from "cors";

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

const db: User[] = [];
const app = express();
const port = 3000;

db.push({
  id: "1",
  username: "admin",
  password: "admin",
  email: "admin@admin.com",
});
db.push({
  id: "2",
  username: "wonnski",
  password: "wonnski",
  email: "wonnski@wonnski.com",
});
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Hello World " +
      "<ul>" +
      db
        .map(
          (user) =>
            "<li>" +
            user.id +
            " " +
            user.username +
            " " +
            user.password +
            "</li>"
        )
        .join("") +
      "</ul>"
  );
});

app.post("/register", (req, res) => {
  const login: string = req.body.login;
  const password: string = req.body.password;
  const email: string = req.body.email;
  const userId: string = new Date().toISOString();

  const existingUser = db.find((user) => user.username === login);
  if (existingUser) {
    return res.status(409).send({ message: "Username is already taken" });
  }
  const newUser: User = {
    id: userId,
    username: login,
    password: password,
    email: email,
  };
  db.push(newUser);

  res.status(200).send({ user: newUser });
});
app.post("/login", (req, res) => {
  const login: string = req.body.login;
  const password: string = req.body.password;

  const user: User | undefined = db.find(
    (u) => u.username === login && u.password === password
  );

  if (user) {
    res.status(200).send({ user: user });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

app.post("/userlist", (req, res) => {
  res.status(200).send(db);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
