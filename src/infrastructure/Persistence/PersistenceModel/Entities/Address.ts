import { 
    Entity, PrimaryGeneratedColumn, Column, 
    ManyToOne, OneToMany, JoinColumn, OneToOne
} from "typeorm";
import { Calendar } from "./Calendar";
import { Package } from "./Package";

@Entity()
export class Address{
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ type: "date" })
    date!: Date;

    @Column()
    address!: string;

    @Column()
    reference!: string;

    @Column({ type: "float" })
    latitude!: number;

    @Column({ type: "float" })
    longitude!: number;

    @ManyToOne(() => Calendar, (calendar) => calendar.addresses)
    @JoinColumn({ name: "calendarId" })
    calendar!: Calendar;

    @Column()
    calendarId!: number;

    @OneToOne(() => Package, (packag) => packag.address)
    package!: Package;
}