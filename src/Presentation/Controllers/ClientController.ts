import { Request, Response } from 'express';
import { Mediator } from '@/Common/Mediator/Mediator';
import { GetClientsForDelivered } from '@application/Client/GetClientsForDelivery/GetClientsForDelivered';
import { handlerResponse } from '@/Common/Utils/handlerResponse';

export class ClientController {

    async getClientsForDeliveredInformation(req: Request, res: Response) {
        const mediator = new Mediator();
        const today = new Date();
        const result = await mediator.send(new GetClientsForDelivered(today));
        return handlerResponse(result, res);
    }
}
