import { ValueObject } from '@common/Core/Abstractions/ValueObject'
import { DomainException } from '@common/Core/Results/DomainExeption';
import { CoordinateError } from '../Error/CoordinateError';

export class Coordinates extends ValueObject {
    private latitude: number;
    private longitude: number;

    constructor(latitude: number, longitude: number) {
        super();

        if (latitude < -90 || latitude > 90) {
            throw new DomainException(CoordinateError.invalidLatitude(latitude));
        }
        if (longitude < -180 || longitude > 180) {
            throw new DomainException(CoordinateError.invalidLongitude(longitude));
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