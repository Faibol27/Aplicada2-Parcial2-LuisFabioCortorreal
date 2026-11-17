import "dotenv/config";
import express from "express";

const app = express();
PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
