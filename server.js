import express from "express";
import routes from "./routes.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from 'path';

const app = express();

app.use(cors());

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "Infinity" }));

const currentDir = dirname(fileURLToPath(import.meta.url));

const mediaPath = path.join(currentDir, "media");

app.get("/media/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(mediaPath, filename);
  res.sendFile(filePath);
});

app.use(routes);

app.listen("3000", "0.0.0.0", () =>
  console.log("Servidor rodando na porta 3000")
);

export default mediaPath;