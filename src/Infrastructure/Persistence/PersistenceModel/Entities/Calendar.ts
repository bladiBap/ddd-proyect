import { 
    Entity, PrimaryGeneratedColumn, OneToMany, OneToOne
} from 'typeorm';
import { MealPlan } from './MealPlan';
import { Address } from './Address';

@Entity()
export class Calendar{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => MealPlan, (mealPlan) => mealPlan.calendar)
    mealPlan!: MealPlan;

    @OneToMany(() => Address, (address) => address.calendar)
    addresses!: Address[];
}