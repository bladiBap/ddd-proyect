import { Request, Response } from 'express';
import { Mediator } from '@/Common/Mediator/Mediator';
import { GetOrderByDay } from '@application/Order/Queries/GetOrderByDayQuery';
import { GenerateOrderCommand } from '@application/Order/Commands/GenerateOrder/GenerateOrderCommand';
import { IncreaseQuantityOrderItemCommand } from '@application/Order/Commands/IncreaseQuantityOrderItem/IncreaseQuantityOrderItemCommand';
import { handlerResponse } from '@/Common/Utils/handlerResponse';
import { GetOrderById } from '@application/Order/Queries/GetOrderByIdQuery';

export class OrderController {

    async getById (req: Request, res: Response) {
        const mediator = new Mediator();
        const { orderId } = req.params;
        if (!orderId || isNaN(parseInt(orderId))) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        const result = await mediator.send(new GetOrderById(parseInt(orderId)));
        return handlerResponse(result, res);
    }

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
