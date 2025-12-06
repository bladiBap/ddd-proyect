import { Request, Response } from "express";
import { Mediator } from "@application/Mediator/Mediator";
import { GetClientsForDelivered } from "@application/Client/GetClientsForDelivery/GetClientsForDelivered";

export class ClientController {

    async getClientsForDeliveredInformation(req: Request, res: Response) {
        const mediator = new Mediator();
        try {
            const clients = await mediator.send(new GetClientsForDelivered());
            return res.status(200).json(clients);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
