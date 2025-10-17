export class OrderDTO {
    constructor(
        public readonly id: string,
        public readonly dateOrdered: Date,
        public readonly dateCreatedOn: Date,
        public readonly status: number
    ){}
}