import "reflect-metadata";
import "dotenv/config";

import { DataSource } from "typeorm";
import { dataSource } from "./db";

export class AppDataSource {
    private static instance: DataSource;
    private count = 0;

    static getInstance(): DataSource {
        if (!this.instance) {
            this.instance = dataSource;
        }

        return this.instance;
    }

    static async initialize(): Promise<DataSource> {
        const dataSource = this.getInstance();

        if (!dataSource.isInitialized) {
            await dataSource.initialize();
            console.log("DataSource initialized successfully");
        }

        return dataSource;
    }

    static async destroy(): Promise<void> {
        const dataSource = this.getInstance();

        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log("DataSource destroyed");
        }
    }
}