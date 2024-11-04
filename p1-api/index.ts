import express from "express";
import cors from "cors";
import { User } from "./src/models/User";
import { Place } from "./src/models/Place";
import { data } from "./feedData";

const db = {
  users: [] as User[],
  places: [] as Place[],
};

const app = express();
const port = 3000;

db.users.push({
  id: "1",
  username: "admin",
  password: "admin",
  email: "admin@admin.com",
});

data.map((data) => {
  db.places.push({
    id: data.place_id,
    name: data.name,
    image: data.featured_image,
    location: data.address,
    rating: data.rating,
    reviewCount: data.reviews,
    type: data.main_category,
    tags: data.categories,
  });
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Hello World " +
      "<ul>" +
      db.users
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
app.get("/places", (req, res) => {
  try {
    if (db.places.length > 0) {
      res.status(200).json(db.places);
    } else {
      const fallbackPlaces = [
        {
          id: "1",
          name: "Fallback Pizza Place",
          image: "../../assets/images/fallback-pizza.png",
          location: "Unknown Ave",
          rating: 4.0,
          reviewCount: 1000,
          type: "pizza",
          tags: ["pizza", "fallback"],
        },
      ];
      res.status(200).json(fallbackPlaces);
    }
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).send({ message: "Failed to retrieve places" });
  }
});
app.post("/register", (req, res) => {
  const login: string = req.body.login;
  const password: string = req.body.password;
  const email: string = req.body.email;
  const userId: string = new Date().toISOString();

  const existingUser = db.users.find((user) => user.username === login);
  if (existingUser) {
    return res.status(409).send({ message: "Username is already taken" });
  }
  const newUser: User = {
    id: userId,
    username: login,
    password: password,
    email: email,
  };
  db.users.push(newUser);

  res.status(200).send({ user: newUser });
});

app.post("/login", (req, res) => {
  const login: string = req.body.login;
  const password: string = req.body.password;

  const user: User | undefined = db.users.find(
    (u) => u.username === login && u.password === password
  );

  if (user) {
    res.status(200).send({ user: user });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

app.post("/userlist", (req, res) => {
  res.status(200).send(db.users);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
