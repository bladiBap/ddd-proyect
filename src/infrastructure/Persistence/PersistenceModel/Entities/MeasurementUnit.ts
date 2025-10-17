import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { Ingredient } from "./Ingredient";

@Entity()
export class MeasurementUnit {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    simbol!: string;

    @OneToMany(() => Ingredient, ingredient => ingredient.measurementUnit)
    ingredients!: Ingredient[];
}