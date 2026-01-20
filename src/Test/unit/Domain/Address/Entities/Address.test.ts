import { DomainException } from '@common/Core/Results/DomainExeption';
import { Address } from '@domain/Address/Entities/Address';
import { Coordinates } from '@domain/Address/ValuesObjects/Coordinates';

describe('Address Entity', () => {
    const validCoordinates = new Coordinates(40.7128, -74.0060);

    describe('Creation', () => {
        it('should create an Address entity with valid properties', () => {
            //arrange
            const addressId = 1;
            const calendarId = 101;
            const date = new Date('2023-10-01T10:00:00Z');
            const street = '123 Main St';
            const reference = 'Near Central Park';
            const location = validCoordinates;

            //act
            const address = new Address(addressId, calendarId, date, street, reference, location);
            //assert
            expect(address.getCalendarId()).toBe(calendarId);
            expect(address.getDate()).toBe(date);
            expect(address.getStreet()).toBe(street);
            expect(address.getReference()).toBe(reference);
            expect(address.getLocation()).toBe(location);
        });
    });

    describe('Validation', () => {

        it('should throw an DomainException if calendarId is less than or equal to zero', () => {
            //arrange
            const addressId = 1;
            const invalidCalendarId = 0;
            const date = new Date('2023-10-01T10:00:00Z');
            const street = '123 Main St';
            const reference = 'Near Central Park';
            const location = validCoordinates;
            //act & assert
            expect(() => {
                new Address(addressId, invalidCalendarId, date, street, reference, location);
            }).toThrow(DomainException);
        });
    });
});