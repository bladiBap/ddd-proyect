import { Address as AddressDomain } from '@domain/Address/Entities/Address';
import { Coordinates } from '@domain/Address/ValuesObjects/Coordinates';
import { Address as AddressEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/Address';

export class AddressMapper {

    static toPersistence(order: AddressDomain): AddressEntity {
        const addressEntity = new AddressEntity();
        addressEntity.id = order.getId();
        addressEntity.calendarId = order.getCalendarId();
        addressEntity.date = order.getDate();
        addressEntity.address = order.getStreet();
        addressEntity.reference = order.getReference();
        addressEntity.latitude = order.getLocation().getLatitude();
        addressEntity.longitude = order.getLocation().getLongitude();
        return addressEntity;
    }

    static toDomain(data: AddressEntity): AddressDomain {
        const coordinates = new Coordinates(data.latitude, data.longitude);
        return new AddressDomain(
            data.id,
            data.calendarId,
            data.date,
            data.address,
            data.reference,
            coordinates
        );
    }
}