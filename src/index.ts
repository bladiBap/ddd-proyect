import express from "express";
import "reflect-metadata";
import "@infrastructure/container";

import { AppDataSource } from "@infrastructure/Persistence/PersistenceModel/data-source";
import { OrderController } from "@presentation/controllers/OrderController";
import { ClientController } from "@presentation/controllers/ClientController";

const app = express();
const orderController = new OrderController();
const clientController = new ClientController();

app.use(express.json());

app.get("/order-today/details", (req, res) => orderController.getOrderOfTheDay(req, res));
app.post("/order-today/generate", (req, res) => orderController.generateOrderReport(req, res));
app.post("/order-item/:orderItemId/complete", (req, res) => orderController.markOrderItemComplete(req, res));
app.get("/clients/delivery-info", (req, res) => clientController.getClientsForDeliveredInformation(req, res));

AppDataSource.initialize().then(() => {
    console.log("Database connected successfully!");
    app.listen(3000, () => console.log("Server running on port 3000"));
}).catch((error) => {
    console.error("Error during Data Source initialization:", error);
});

