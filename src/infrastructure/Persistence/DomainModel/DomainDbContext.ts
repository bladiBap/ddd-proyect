import { DataSource } from "typeorm";

import { Address } from "../PersistenceModel/Entities/Address";
import { Calendar } from "../PersistenceModel/Entities/Calendar";
import { Client } from "../PersistenceModel/Entities/Client";
import { DayliDiet } from "../PersistenceModel/Entities/DayliDiet";
import { Ingredient } from "../PersistenceModel/Entities/Ingredient";
import { MealPlan } from "../PersistenceModel/Entities/MealPlan";
import { MeasurementUnit } from "../PersistenceModel/Entities/MeasurementUnit";
import { Order } from "../PersistenceModel/Entities/Order";
import { OrderItem } from "../PersistenceModel/Entities/OrderItem";
import { Package } from "@domain/Package/Package";
import 

export class DomainDbContext {
    private connection: DataSource;

    constructor() {
        this.connection = new DataSource({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "root",
            database:  "domain_db",
            entities: [
                // Add your entities here
            ],
            synchronize: true,
        });
        this.connection.initialize()
            .then(() => {
                console.log("Data Source has been initialized!");
            })
            .catch((err) => {
                console.error("Error during Data Source initialization:", err);
            }); 
    }

    public getConnection(): DataSource {
        return this.connection;
    }
}