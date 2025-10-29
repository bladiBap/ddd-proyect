import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { Package } from './Package';
import { Recipe } from "./Recipe";

@Entity()
export class PackageItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @ManyToOne(() => Package, packag => packag.packageItems)
    @JoinColumn({ name: "packageId" })
    package!: Package;

    @ManyToOne(() => Recipe, recipe => recipe.packageItems)
    @JoinColumn({ name: "recipeId" })
    recipe!: Recipe;

    @Column()
    recipeId!: number;

    @Column()
    packageId!: number;
    
}