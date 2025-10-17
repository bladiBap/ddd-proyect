import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Ruta simple
app.get("/", (req: Request, res: Response) => {
    res.send("🚀 Servidor Express con TypeScript funcionando!");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
