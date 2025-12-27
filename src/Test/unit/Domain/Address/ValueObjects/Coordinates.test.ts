import { Coordinates } from '@domain/Address/ValuesObjects/Coordinates';
import { DomainException } from '@core/Results/DomainExeption';

describe('Coordinates Value Object', () => {
    describe('Creation', () => {
        it('should create a Coordinates object with valid latitude and longitude', () => {
            //arrange
            const coordinates = [
                {
                    latitude: 45.0,
                    longitude: 90.0
                },
                {
                    latitude: -45.0,
                    longitude: -90.0
                }
            ];

            //act & assert
            coordinates.forEach(coord => {
                const coordinateObj = new Coordinates(coord.latitude, coord.longitude);
                expect(coordinateObj.getLatitude()).toBe(coord.latitude);
                expect(coordinateObj.getLongitude()).toBe(coord.longitude);
            });
        });

        it('should throw an DomainException for invalid latitude', () => {
            //arrange
            const invalidCoordinates = [
                { latitude: -100.0, longitude: 50.0 },
                { latitude: 100.0, longitude: 50.0 }
            ];
            //act & assert
            invalidCoordinates.forEach(coord => {
                expect(() => new Coordinates(coord.latitude, coord.longitude)).toThrow(DomainException);
            });
        });
    });
});






