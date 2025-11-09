import { Request, Response } from "express";

export class HelloWorldController {

    async getHelloWorld(req: Request, res: Response) {
        return res.status(200).json({ message: "Hello, World!" });
    }
}