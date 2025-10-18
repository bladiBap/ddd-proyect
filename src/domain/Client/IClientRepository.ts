import { IRepository } from "@domain/core/abstractions/IRepository";
import { Client } from "./Client";

export interface IClientRepository extends IRepository<Client> {
    deleteAsync(id: number): Promise<void>;
}