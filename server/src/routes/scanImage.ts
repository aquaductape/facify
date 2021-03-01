import express from "express";
import { getDemographics } from "../models/demographics";

const route = express.Router();

route.post("/", async (req, res, next) => {
  try {
    // console.log(req.body);
    const result = await getDemographics(req.body.imageBase64);
    res.send(result);
    // res.send({ cat: "by" });
  } catch (err) {
    res.send(err);
  }
});

export default route;
