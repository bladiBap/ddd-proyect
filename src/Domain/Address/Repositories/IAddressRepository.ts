import { IRepository } from '@core/Abstractions/IRepository';
import { Address } from '../Entities/Address';
import { RecipeByClientDTO } from '@application/Order/Dto/RecipeByClientDTO';

export interface IAddressRepository extends IRepository<Address> {
    deleteAsync(id: number): Promise<void>;
    getPerClientNeeds(date: Date): Promise<RecipeByClientDTO[]>;
    getClientsForDeliveredInformation(date: Date): Promise<any[]>;
    getAddressForTodayByClientId(clientId: number): Promise<Address | null>;
}