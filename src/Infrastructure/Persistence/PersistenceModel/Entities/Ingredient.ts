import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { MeasurementUnit } from './MeasurementUnit';
import { RecipeIngredient } from './RecipeIngredient';

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => MeasurementUnit, (measurementUnit) => measurementUnit.ingredients, { eager: true })
    @JoinColumn({ name: 'measurementUnitId' })
    measurementUnit!: MeasurementUnit;

    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.ingredient)
    recipes!: RecipeIngredient[];
}