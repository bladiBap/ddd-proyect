export class CompleteOrderItemCommand {
    constructor(public readonly orderItemId: number, public readonly quantity?: number) {}
}