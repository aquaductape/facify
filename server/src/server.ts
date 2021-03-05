import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./routes/scanImage";

const app = express();
const port = 8000;

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

app.use("/scan-image", route);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
