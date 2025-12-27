import { 
    Entity, PrimaryGeneratedColumn, Column, OneToMany 
} from 'typeorm';

import { MealPlan } from './MealPlan';
import { Package } from './Package';
import { AllocationLine } from './AllocationLine';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => MealPlan, (mealPlan) => mealPlan.client, { cascade: true })
    mealPlans!: MealPlan[];

    @OneToMany(() => Package, (packag) => packag.client, { cascade: true, eager: true })
    packages!: Package[];

    @OneToMany(() => AllocationLine, (allocationLine) => allocationLine.client)
    allocationLines!: AllocationLine[];
}