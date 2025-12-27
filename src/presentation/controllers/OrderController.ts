import { Request, Response } from 'express';
import { Mediator } from '@application/Mediator/Mediator';
import { GetOrderByDay } from '@application/Order/Queries/GetOrderByDay/GerOrderByDayQuery';
import { GenerateOrderCommand } from '@application/Order/Commands/GenerateOrder/GenerateOrderCommand';
import { CompleteOrderItemCommand } from '@application/Order/Commands/CompleteOrderItem/CompleteOrderItemCommand';

export class OrderController {

    async getOrderOfTheDay(req: Request, res: Response) {
        
        const mediator = new Mediator();
        const todayDate = new Date();
        try {
            const order = await mediator.send(new GetOrderByDay(todayDate));

            if (!order) {
                return res.status(404).json(order);
            }

            return res.status(200).json(order);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async generateOrderReport(req: Request, res: Response) {
        const mediator = new Mediator();
        try {
            const result = await mediator.send(new GenerateOrderCommand());

            if (result.isFailure) {
                return res.status(400).json({ ...result });
            }
            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
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

        try {
            const result = await mediator.send(new CompleteOrderItemCommand(parseInt(orderItemId), quantity ? parseInt(quantity) : undefined));
            if (result.isFailure) {
                return res.status(400).json({ ...result });
            }
            return res.status(200).json({ message: 'Order item updated' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
