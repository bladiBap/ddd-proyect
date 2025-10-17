import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { StatusOrder } from "@domain/Order/StatusOrderEnum";

import { Order } from "./Order";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @Column({
        type: "enum",
        enum: StatusOrder,
        default: StatusOrder.PENDING
    })
    status!: StatusOrder;

    @Column()
    recipeId!: number;

    @ManyToOne(() => Order, order => order.orderItems)
    @JoinColumn({ name: "orderId" })
    order!: Order;

}