import { Request, Response } from "express";
import { Mediator } from "@application/Mediator/Mediator";
import { GetOrderByDayQuery } from "@application/Order/GetOrderByDay/GerOrderByDayQuery";
import { GenerateOrderCommand } from "@application/Order/GenerateOrder/GenerateOrderCommand";

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

    async generateOrderReport(req: Request, res: Response) {
        const mediator = new Mediator();
        console.log("Received request to generate order report");
        try {
            const result = await mediator.send(new GenerateOrderCommand());

            if (result.isFailure) {
                return res.status(400).json({ ...result });
            }
            return res.status(201).json({ message: "Order generated successfully" });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
