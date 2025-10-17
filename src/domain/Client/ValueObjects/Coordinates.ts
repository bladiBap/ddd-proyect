import { ValueObject } from "../../shared/abstractions/ValueObject";

export class Coordinates extends ValueObject {
    private latitude: number;
    private longitude: number;

    constructor(latitude: number, longitude: number) {
        super();

        if (latitude < -90 || latitude > 90) {
            throw new Error("Latitude must be between -90 and 90 degrees.");
        }
        if (longitude < -180 || longitude > 180) {
            throw new Error("Longitude must be between -180 and 180 degrees.");
        }

        this.latitude = latitude;
        this.longitude = longitude;
    }

    public getLatitude(): number {
        return this.latitude;
    }

    public getLongitude(): number {
        return this.longitude;
    }
}