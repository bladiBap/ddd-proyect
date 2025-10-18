import { Request, Response } from "express";
import { Mediator } from "@application/Mediator/Mediator";
import { GetClientsForDeliveredInformationQuery } from "@application/Client/GetClientsForDeliveryInformation/GetClientsForDeliveredInformationQuery";

export class ClientController {

    async getClientsForDeliveredInformation(req: Request, res: Response) {
        const mediator = new Mediator();
        try {
            const clients = await mediator.send(new GetClientsForDeliveredInformationQuery());
            return res.status(200).json(clients);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
