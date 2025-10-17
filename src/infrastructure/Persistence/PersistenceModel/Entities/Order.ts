import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { StatusOrder } from "@domain/Order/StatusOrderEnum";

import { OrderItem } from "./OrderItem";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    dateOrdered!: Date;

    @Column()
    dateCreatedOn!: Date;

    @Column({
        type: "enum",
        enum: StatusOrder,
        default: StatusOrder.PENDING
    })
    status!: StatusOrder;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    orderItems!: OrderItem[];
}