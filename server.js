import express from "express";
import routes from "./routes.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from 'path';
import fs from 'fs'; 
import SwaggerUiOptions from 'swagger-ui-express';


const app = express();

app.use(cors());

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

const swaggerFilePath = path.resolve(dirname(fileURLToPath(import.meta.url)), 'swagger-output.json');
const swaggerFileContent = fs.readFileSync(swaggerFilePath, 'utf8');
const swaggerFile = JSON.parse(swaggerFileContent);

app.use('/swagger', SwaggerUiOptions.serve, SwaggerUiOptions.setup(swaggerFile));
app.use(express.json({ limit: "Infinity" }));

const currentDir = dirname(fileURLToPath(import.meta.url));

const mediaPath = path.join(currentDir, "media");

app.get("/media/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(mediaPath, filename);
  res.sendFile(filePath);
});

app.use(routes);

const PORT = process.env.PORT || 3000;

const start = () => {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
};

start();

export default mediaPath;