import { Request, Response } from "express";
import { Mediator } from "@application/Mediator/Mediator";
import { GetOrderByDayQuery } from "@application/Order/GetOrderByDay/GerOrderByDayQuery";

export class OrderController {
    async getOrderDetails(req: Request, res: Response) {
        
        const mediator = new Mediator();
        const todayDate = new Date();
        try {
            const order = await mediator.send(new GetOrderByDayQuery(todayDate));

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            return res.status(200).json(order);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
