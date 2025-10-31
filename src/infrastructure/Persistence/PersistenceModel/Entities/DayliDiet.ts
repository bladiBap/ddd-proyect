import { 
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, 
    ManyToMany, JoinTable, JoinColumn
} from "typeorm";

import { Recipe } from "./Recipe";
import { MealPlan } from "./MealPlan";

@Entity()
export class DayliDiet {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "date" })
    date!: Date;

    @Column()
    nDayPlan!: number;

    @ManyToOne(() => MealPlan, (mealPlan) => mealPlan.dayliDiets)
    @JoinColumn({ name: "mealPlanId" })
    mealPlan!: MealPlan;


    @ManyToMany(() => Recipe, (recipe) => recipe.dayliDiets, { cascade: true, eager: true })
    @JoinTable({
        name: "dayli_diet_recipes",
        joinColumn: { name: "dayliDietId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "recipeId", referencedColumnName: "id" }
    })
    recipes!: Recipe[];
}