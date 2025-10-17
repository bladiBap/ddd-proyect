import { 
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, 
    OneToMany, JoinColumn, 
    OneToOne
} from 'typeorm';

import { DayliDiet } from './DayliDiet';
import { Client } from './Client';
import { Calendar } from './Calendar';

@Entity()
export class MealPlan {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    startDate!: Date;

    @Column()
    endDate!: Date;

    @Column()
    durationDays!: number;

    @OneToMany(() => DayliDiet, (dayliDiet) => dayliDiet.mealPlan, { cascade: true, eager: true })
    dayliDiets!: DayliDiet[];

    @OneToOne(() => Calendar,(calendar) => calendar.mealPlan,{ cascade: true, eager: true })
    @JoinColumn({ name: 'calendarId' })
    calendar!: Calendar;

    @ManyToOne(() => Client, (client) => client.mealPlans, { eager: true })
    @JoinColumn({ name: 'clientId' })
    client!: Client;
}