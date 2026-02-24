export class CoordinateError {

    public static invalidLatitude(latitude: number): Error {
        return new Error(`Invalid latitude value: ${latitude}. Latitude must be between -90 and 90 degrees.`);
    }

    public static invalidLongitude(longitude: number): Error {
        return new Error(`Invalid longitude value: ${longitude}. Longitude must be between -180 and 180 degrees.`);
    }
}