import { IRepository } from '@common/Core/Abstractions/IRepository';
import { Address } from '../Entities/Address';
import { RecipeByClientDTO } from '@application/Order/Dto/RecipeByClientDTO';

export interface IAddressRepository extends IRepository<Address> {
    deleteAsync(id: number): Promise<void>;
    updateAsync(address: Address): Promise<void>;
    getPerClientNeeds(date: Date): Promise<RecipeByClientDTO[]>;
    getClientsForDeliveredInformation(date: Date): Promise<any[]>;
    getAddressByDateAndClientId(clientId: number, date: Date): Promise<Address | null>;
}