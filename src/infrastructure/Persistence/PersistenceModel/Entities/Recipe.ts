import { 
    Entity, PrimaryGeneratedColumn, Column, 
    OneToMany, ManyToMany 
} from "typeorm";

import { RecipeIngredient } from "./RecipeIngredient";
import { DayliDiet } from "./DayliDiet";
import { PackageItem } from "./PackageItem";
import { OrderItem } from "./OrderItem";
import { AllocationLine } from "./AllocationLine";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    instructions!: string;

    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, { cascade: true, eager: true })
    ingredients!: RecipeIngredient[];

    @OneToMany(() => PackageItem, (packageItem) => packageItem.recipe)
    packageItems!: PackageItem[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.recipe)
    orderItems!: OrderItem[];
    
    @OneToMany(() => AllocationLine, (allocationLine) => allocationLine.recipe)
    allocationLines!: AllocationLine[];

    @ManyToMany(() => DayliDiet, (dayliDiet) => dayliDiet.recipes)
    dayliDiets!: DayliDiet[];

}