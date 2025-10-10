import { Router } from "express";

const router = Router();


export default () => {
// Define your routes here

  router.get("/health/", (req, res) => {
    res.send("api is healthy");
  });

  return router;
};

