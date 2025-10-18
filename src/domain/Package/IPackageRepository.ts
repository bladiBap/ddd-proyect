import { IRepository } from '../core/abstractions/IRepository';
import { Package } from './Package';

export interface IPackageRepository extends IRepository<Package> {
    getDetailsByIdAsync(id: number, readOnly?: boolean): Promise<Package | null>;
}