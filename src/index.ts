import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';

import { AppDataSource } from '@infrastructure/Persistence/PersistenceModel/DataSource';
import { container } from '@infrastructure/Container';
import { DataSource } from 'typeorm';

import { OrderController } from '@presentation/Controllers/OrderController';
import { ClientController } from '@presentation/Controllers/ClientController';
import { PackageController } from '@presentation/Controllers/PackageController';
import { HelloWorldController } from '@presentation/Controllers/HelloWorldController';
import { AddressController } from '@presentation/Controllers/AddressController';

async function bootstrap() {
    const ds = await AppDataSource.initialize();
    console.log('DB conectada');

    container.registerInstance<DataSource>('DataSource', ds);

    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));
    const orderController = new OrderController();
    const addressController = new AddressController();
    const clientController = new ClientController();
    const packageController = new PackageController();
    const helloWorldController = new HelloWorldController();

    app.get('/hello-world', (req, res) => helloWorldController.getHelloWorld(req, res));
    //order
    app.get('/order/:orderId', (req, res) => orderController.getById(req, res));
    app.get('/order-today/details', (req, res) => orderController.getOrderOfTheDay(req, res));
    app.post('/order-today/generate', (req, res) => orderController.generateOrderReport(req, res));
    //address
    app.post('/address', (req, res) => addressController.create(req, res));
    app.put('/address', (req, res) => addressController.update(req, res));
    app.delete('/address/:id', (req, res) => addressController.delete(req, res));
    app.get('/address/:id', (req, res) => addressController.getById(req, res));

    app.patch('/order-item/:orderItemId/complete', (req, res) => orderController.markOrderItemComplete(req, res));
    app.get('/clients/delivery-info', (req, res) => clientController.getClientsForDeliveredInformation(req, res));
    app.post('/package', (req, res) => packageController.create(req, res));

    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap().catch((err) => {
    console.error('Error al iniciar la app:', err);
});
