import { IRepository } from "@domain/core/abstractions/IRepository";
import { Address } from "./Address";

export interface IAddressRepository extends IRepository<Address> {
    deleteAsync(id: number): Promise<void>;
    getRecipesToPrepare(date: Date): Promise<{ recipeId: number; quantity: number }[]>;
}