import { 
    Entity, PrimaryGeneratedColumn, Column, 
    ManyToOne, OneToMany, JoinColumn 
} from "typeorm";

import { MealPlan } from "./MealPlan";
import { Package } from "./Package";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => MealPlan, (mealPlan) => mealPlan.client, { cascade: true, eager: true })
    mealPlans!: MealPlan[];

    @OneToMany(() => Package, (packag) => packag.client, { cascade: true, eager: true })
    packages!: Package[];
}