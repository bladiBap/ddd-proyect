import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { AllocationLine } from "./AllocationLine";

@Entity()
export class DailyAllocation {
    @PrimaryGeneratedColumn() 
    id!: number;

    @Column({ type: "date" }) 
    date!: Date;

    @OneToMany(() => AllocationLine, l => l.allocation, { cascade: true, eager: true }) 
    lines!: AllocationLine[];

    @CreateDateColumn({ type: "timestamptz" }) 
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" }) 
    updatedAt!: Date;
}
