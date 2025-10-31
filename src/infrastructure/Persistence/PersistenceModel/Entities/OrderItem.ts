import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { StatusOrder } from "@domain/aggregates/order/StatusOrderEnum";

import { Order } from "./Order";
import { Recipe } from "./Recipe";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: StatusOrder,
        default: StatusOrder.CREATED
    })
    status!: StatusOrder;

    @Column({
        type: "int"
    })
    quantityPlanned!: number;

    @Column({
        type: "int",
        default: 0
    })
    quantityPrepared!: number;

    @Column({
        type: "int",
        default: 0
    })
    quantityDelivered!: number;

    @ManyToOne(() => Recipe, recipe => recipe.orderItems)
    @JoinColumn({ name: "recipeId" })
    recipe!: Recipe;

    @ManyToOne(() => Order, order => order.orderItems)
    @JoinColumn({ name: "orderId" })
    order!: Order;

    @Column()
    recipeId!: number;

    @Column()
    orderId!: number;
}