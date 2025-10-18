import "reflect-metadata";
import "dotenv/config";

import { DataSource } from "typeorm";

import { Address } from "./Entities/Address";
import { Calendar } from "./Entities/Calendar";
import { Client } from "./Entities/Client";
import { DayliDiet } from "./Entities/DayliDiet";
import { Ingredient } from "./Entities/Ingredient";
import { MealPlan } from "./Entities/MealPlan";
import { MeasurementUnit } from "./Entities/MeasurementUnit";
import { Order } from "./Entities/Order";
import { OrderItem } from "./Entities/OrderItem";
import { Package } from "./Entities/Package";
import { PackageItem } from "./Entities/PackageItem";
import { Recipe } from "./Entities/Recipe";
import { RecipeIngredient } from "./Entities/RecipeIngredient";

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