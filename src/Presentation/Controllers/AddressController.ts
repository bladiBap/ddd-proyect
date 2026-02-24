import { Request, Response } from 'express';
import { Mediator } from '@/Common/Mediator/Mediator';
import { CreateAddressCommand } from '@application/Address/Commands/CreateAddress/CreateAddressCommand';
import { UpdateAddressCommand } from '@application/Address/Commands/UpdateAddress/UpdateAddressCommand';
import { handlerResponse } from '@/Common/Utils/handlerResponse';
import { DeleteAddressCommand } from '@application/Address/Commands/DeleteAddress/DeleteAddressCommand';
import { GetAddressById } from '@application/Address/Query/GetAddressById';

export class AddressController {

    async create(req: Request, res: Response) {
        const mediator = new Mediator();
        const { calendarId, date, address, reference, latitude, longitude } = req.body;
        const result = await mediator.send(new CreateAddressCommand(new Date(date), address, reference, latitude, longitude, calendarId));
        return handlerResponse(result, res);
    }

    async update(req: Request, res: Response) {
        const mediator = new Mediator();
        const { id, calendarId, date, address, reference, latitude, longitude } = req.body;
        const result = await mediator.send(new UpdateAddressCommand(id, new Date(date), address, reference, latitude, longitude, calendarId));
        return handlerResponse(result, res);
    }

    async delete(req: Request, res: Response) {
        const mediator = new Mediator();
        const { id } = req.params;
        const result = await mediator.send(new DeleteAddressCommand(Number(id)));
        return handlerResponse(result, res);
    }

    async getById(req: Request, res: Response) {
        const mediator = new Mediator();
        const { id } = req.params;
        const result = await mediator.send(new GetAddressById(Number(id)));
        return handlerResponse(result, res);
    }
}
