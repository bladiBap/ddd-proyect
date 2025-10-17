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

    @Column()
    date!: string;

    @Column()
    address!: string;

    @Column()
    reference!: string;

    @Column()
    latitude!: number;

    @Column()
    longitude!: number;

    @ManyToOne(() => Calendar, (calendar) => calendar.addresses)
    @JoinColumn({ name: "calendarId" })
    calendar!: Calendar;

    @OneToOne(() => Package, (packag) => packag.address)
    package!: Package;
}