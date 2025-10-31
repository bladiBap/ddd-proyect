import { EntityManager } from "typeorm";

export interface IEntityManagerProvider {
    getManager(): EntityManager;
}