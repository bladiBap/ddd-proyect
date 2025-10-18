import "reflect-metadata";
import "dotenv/config";

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
import { Package } from "../PersistenceModel/Entities/Package";
import { PackageItem } from "../PersistenceModel/Entities/PackageItem";
import { Recipe } from "../PersistenceModel/Entities/Recipe";
import { RecipeIngredient } from "../PersistenceModel/Entities/RecipeIngredient";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "nur_tricenter",
    synchronize: true,
    logging: false,
    entities: [
        Address,
        Calendar,
        Client,
        DayliDiet,
        Order,
        OrderItem,
        Recipe,
        Ingredient,
        MeasurementUnit,
        RecipeIngredient,
        MealPlan,
        Package,
        PackageItem
    ],
});