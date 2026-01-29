import express from "express";
import cors from "cors";
import recipesRouter from "./routes/recipes";
import favoriteRouter from "./routes/favoriteRoutes";
import authRoutes from "./routes/authRoutes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ limit: "5mb", extended: true }));
  // Define routes here
  app.get("/backend/health", (req, res) => {
    res.status(200).send("OK");
  });

  // Auth routes
  app.use("/api/auth", authRoutes);

  // Recipes routes
  app.use("/api/recipes", recipesRouter);

  //Favorite routes

  app.use("/api/favorites", favoriteRouter);

  return app;
}
