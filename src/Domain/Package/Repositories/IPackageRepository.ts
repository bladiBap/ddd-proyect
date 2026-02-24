import { IRepository } from '@common/Core/Abstractions/IRepository';
import { Package } from '../Entities/Package';

export interface IPackageRepository extends IRepository<Package> {
    getDetailsByIdAsync(id: number, readOnly?: boolean): Promise<Package | null>;
    getPackageByAddressClientIdAsync(addressId: number, clientId: number): Promise<Package | null>;
}