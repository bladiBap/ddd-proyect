import { AggregateRoot } from "@domain/core/abstractions/AgregateRoot";
import { DomainException } from "@domain/core/results/DomainExeption";
import { Coordinates } from "./valuesObjects/Coordinates";

export class Address extends AggregateRoot {
    
    private calendarId: number;
    private date : Date;
    private street: string;
    private reference: string;
    private location: Coordinates;

    constructor(id: number, calendarId: number, date: Date, street: string, reference: string, location: Coordinates) {
        super(id);
        this.calendarId = calendarId;
        this.date = date;
        this.street = street;
        this.reference = reference;
        this.location = location;
    }


    public getCalendarId(): number {
        return this.calendarId;
    }

    public getDate(): Date {
        return this.date;
    }

    public getStreet(): string {
        return this.street;
    }

    public getReference(): string {
        return this.reference;
    }

    public getLocation(): Coordinates {
        return this.location;
    }
}