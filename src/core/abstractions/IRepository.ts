import { AggregateRoot } from "./AgregateRoot";

export interface IRepository< T extends AggregateRoot> {

    getByIdAsync(id: number, readOnly?: boolean): Promise<T | null>;
    addAsync(entity: T): Promise<void>;
} 