import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ingredient } from './Ingredient';
import { Recipe } from './Recipe';

@Entity()
export class RecipeIngredient {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
    @JoinColumn({ name: 'recipeId' })
    recipe!: Recipe;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipes)
    @JoinColumn({ name: 'ingredientId' })
    ingredient!: Ingredient;
}