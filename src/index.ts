import express from "express";
import "reflect-metadata";
import "@infrastructure/container";

import { AppDataSource } from "@infrastructure/Persistence/DomainModel/data-source";
import { OrderController } from "@presentation/controllers/OrderController";

const app = express();
const controller = new OrderController();

app.get("/order-today/details", (req, res) => controller.getOrderDetails(req, res));

AppDataSource.initialize().then(() => {
    console.log("Database connected successfully!");
    app.listen(3000, () => console.log("Server running on port 3000"));
}).catch((error) => {
    console.error("Error during Data Source initialization:", error);
});

