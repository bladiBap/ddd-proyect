import { Request, Response } from 'express';
import { Mediator } from '@application/Mediator/Mediator';
import { GetOrderByDay } from '@application/Order/Queries/GetOrderByDay/GerOrderByDayQuery';
import { GenerateOrderCommand } from '@application/Order/Commands/GenerateOrder/GenerateOrderCommand';
import { IncreaseQuantityOrderItemCommand } from '@application/Order/Commands/IncreaseQuantityOrderItem/IncreaseQuantityOrderItemCommand';
import { handlerResponse } from '@utils/handlerResponse';

export class OrderController {

    async getOrderOfTheDay(req: Request, res: Response) {
        const mediator = new Mediator();
        const todayDate = new Date();
        const result = await mediator.send(new GetOrderByDay(todayDate));
        return handlerResponse(result, res);
    }

    async generateOrderReport(req: Request, res: Response) {
        const mediator = new Mediator();
        const todayDate = new Date();
        const result = await mediator.send(new GenerateOrderCommand(todayDate));
        return handlerResponse(result, res);
    }

    async markOrderItemComplete(req: Request, res: Response) {
        const mediator = new Mediator();
        const { orderItemId } = req.params;
        const quantity = req?.body?.quantity;

        if (!orderItemId || isNaN(parseInt(orderItemId))) {
            return res.status(400).json({ message: 'Invalid order item ID' });
        }

        if (quantity !== undefined && (isNaN(parseInt(quantity)))) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const result = await mediator.send(new IncreaseQuantityOrderItemCommand(parseInt(orderItemId), quantity ? parseInt(quantity) : undefined));
        return handlerResponse(result, res);
    }
}
