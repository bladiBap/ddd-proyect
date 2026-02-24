// allocation/AllocationLine.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DailyAllocation } from './DailyAllocation';
import { Client } from './Client';
import { Recipe } from './Recipe';

@Entity()
export class AllocationLine {
    
    @PrimaryGeneratedColumn()
    id!: number;
    
    @ManyToOne(() => DailyAllocation, a => a.lines) 
    @JoinColumn({ name: 'allocationId' }) 
    allocation!: DailyAllocation;

    @Column({
        name: 'allocationId',
    })
    allocationId!: number;

    
    @ManyToOne(() => Client) 
    @JoinColumn({ name: 'clientId' }) 
    client!: Client;

    @Column({
        name: 'clientId',
    })
    clientId!: number;
    
    @ManyToOne(() => Recipe) 
    @JoinColumn({ name: 'recipeId' }) 
    recipe!: Recipe;

    @Column({
        name: 'recipeId',
    })
    recipeId!: number;
    
    @Column({ type: 'int' }) 
    quantityNeeded!: number;

    @Column({ type: 'int', default: 0 }) 
    quantityPackaged!: number;
}