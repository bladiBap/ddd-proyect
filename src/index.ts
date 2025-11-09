import "reflect-metadata";
import express from "express";

import { AppDataSource } from "@infrastructure/Persistence/PersistenceModel/data-source";
import { container } from "@infrastructure/container";
import { DataSource } from "typeorm";

import { OrderController } from "@presentation/controllers/OrderController";
import { ClientController } from "@presentation/controllers/ClientController";
import { PackageController } from "@presentation/controllers/PackageController";
import { HelloWorldController } from "@presentation/controllers/HelloWorldController";

async function bootstrap() {
    const ds = await AppDataSource.initialize();
    console.log("DB conectada");

    container.registerInstance<DataSource>("DataSource", ds);

    const app = express();
    app.use(express.json());

    const orderController = new OrderController();
    const clientController = new ClientController();
    const packageController = new PackageController();
    const helloWorldController = new HelloWorldController();

    app.get("/hello-world", (req, res) => helloWorldController.getHelloWorld(req, res));

    app.get("/order-today/details", (req, res) => orderController.getOrderOfTheDay(req, res));
    app.post("/order-today/generate", (req, res) => orderController.generateOrderReport(req, res));
    app.patch("/order-item/:orderItemId/complete", (req, res) => orderController.markOrderItemComplete(req, res));
    app.get("/clients/delivery-info", (req, res) => clientController.getClientsForDeliveredInformation(req, res));
    app.post("/package/build", (req, res) => packageController.buildPackage(req, res));

    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap().catch((err) => {
    console.error("Error al iniciar la app:", err);
});
