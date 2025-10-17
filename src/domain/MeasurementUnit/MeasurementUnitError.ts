export class MeasurementUnitError {

    public static nameIsRequired(): Error {
        return new Error(`The name of the measurement unit is required.`);
    }

    public static simbolIsRequired(): Error {
        return new Error(`The simbol of the measurement unit is required.`);
    }
}