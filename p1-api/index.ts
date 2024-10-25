import express from "express";
import cors from "cors";
import { User } from "./src/models/User";
import { Place } from "./src/models/Place";

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
db.places.push(
  {
    id: "0",
    name: "Ichiraku Ramen",
    image:
      "https://res.cloudinary.com/dld13appb/image/upload/v1729857749/csm_1101-recipe-page-Authentic-Japanese-soy-sauce-ramen_desktop_7e407b8b49_ouhrbb.webp",
    location: "21 china Ave",
    rating: 4.9,
    reviewCount: 2200,
    type: "Ramen",
    tags: ["ramen", "chinese", "spicy"],
  },
  {
    id: "1",
    name: "PizzaNewYork",
    image:
      "https://res.cloudinary.com/dld13appb/image/upload/v1729857409/pizza_fqvhnd.jpg",
    location: "456 pizza Ave",
    rating: 4.6,
    reviewCount: 4600,
    type: "pizza",
    tags: ["pizza", "italian", "american"],
  },
  {
    id: "2",
    name: "Pizza Neopolitan",
    image:
      "https://res.cloudinary.com/dld13appb/image/upload/v1729857409/pizza_fqvhnd.jpg",
    location: "12 New York Ave",
    rating: 4.8,
    reviewCount: 1200,
    type: "pizza",
    tags: ["pizza", "italian"],
  }
);

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
