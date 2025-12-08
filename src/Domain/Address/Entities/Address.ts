import { AggregateRoot } from "@core/Abstractions/AgregateRoot";
import { Coordinates } from "../ValuesObjects/Coordinates";
import { AddressError } from "../Error/AddressError";
import { DomainException } from "@core/Results/DomainExeption";

export class Address extends AggregateRoot {
    
    private calendarId: number;
    private date : Date;
    private street: string;
    private reference: string;
    private location: Coordinates;

    constructor(id: number, calendarId: number, date: Date, street: string, reference: string, location: Coordinates) {
        super(id);
        if (id <= 0) {
            throw new DomainException(AddressError.notLessThanOrEqualToZero('id', id));
        }

        if (calendarId <= 0) {
            throw new DomainException(AddressError.notLessThanOrEqualToZero('calendarId', calendarId));
        }

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