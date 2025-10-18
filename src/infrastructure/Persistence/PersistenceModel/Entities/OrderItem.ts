import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { StatusOrder } from "@domain/aggregates/order/StatusOrderEnum";

import { Order } from "./Order";
import { Recipe } from "./Recipe";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @Column({
        type: "enum",
        enum: StatusOrder,
        default: StatusOrder.CREATED
    })
    status!: StatusOrder;

    @ManyToOne(() => Recipe, recipe => recipe.orderItems)
    @JoinColumn({ name: "recipeId" })
    recipe!: Recipe;

    @Column({ name: "recipeId" })
    recipeId!: number;

    @ManyToOne(() => Order, order => order.orderItems)
    @JoinColumn({ name: "orderId" })
    order!: Order;

    @Column({ name: "orderId" })
    orderId!: number;
}