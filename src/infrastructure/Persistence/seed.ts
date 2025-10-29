import "reflect-metadata";
import { AppDataSource } from "../Persistence/PersistenceModel/data-source";

import { MeasurementUnit } from "../Persistence/PersistenceModel/Entities/MeasurementUnit";
import { Client } from "../Persistence/PersistenceModel/Entities/Client";
import { Ingredient } from "../Persistence/PersistenceModel/Entities/Ingredient";
import { Recipe } from "../Persistence/PersistenceModel/Entities/Recipe";
import { RecipeIngredient } from "../Persistence/PersistenceModel/Entities/RecipeIngredient";
import { Order } from "../Persistence/PersistenceModel/Entities/Order";
import { OrderItem } from "../Persistence/PersistenceModel/Entities/OrderItem";
import { StatusOrder } from "@domain/aggregates/order/StatusOrderEnum";
import { Address } from "../Persistence/PersistenceModel/Entities/Address";
import { Calendar } from "../Persistence/PersistenceModel/Entities/Calendar";
import { MealPlan } from "../Persistence/PersistenceModel/Entities/MealPlan";
import { DayliDiet } from "../Persistence/PersistenceModel/Entities/DayliDiet";

async function seed() {
    await AppDataSource.initialize();
    console.log("📦 Connected to database");

    
    await AppDataSource.synchronize(true);
    console.log("🧹 Schema recreated");

    // 🔹 Repositorios
    const unitRepo = AppDataSource.getRepository(MeasurementUnit);
    const clientRepo = AppDataSource.getRepository(Client);
    const ingredientRepo = AppDataSource.getRepository(Ingredient);
    const recipeRepo = AppDataSource.getRepository(Recipe);
    const recipeIngRepo = AppDataSource.getRepository(RecipeIngredient);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);
    const addressRepo = AppDataSource.getRepository(Address);
    const calendarRepo = AppDataSource.getRepository(Calendar);
    const mealPlanRepo = AppDataSource.getRepository(MealPlan);
    const dayliDietRepo = AppDataSource.getRepository(DayliDiet);

    const [gram, piece] = await unitRepo.save([
        unitRepo.create({ name: "Gram", simbol: "g" }),
        unitRepo.create({ name: "Piece", simbol: "pc" }),
    ]);

    const [client1, client2] = await clientRepo.save([
        clientRepo.create({ name: "John Doe" }),
        clientRepo.create({ name: "Jane Smith" }),
    ]);

    const [rice, chicken, egg] = await ingredientRepo.save([
        ingredientRepo.create({ name: "Rice", measurementUnit: gram }),
        ingredientRepo.create({ name: "Chicken Breast", measurementUnit: gram }),
        ingredientRepo.create({ name: "Egg", measurementUnit: piece }),
    ]);

    const [recipe1, recipe2] = await recipeRepo.save([
        recipeRepo.create({
        name: "Chicken Rice Bowl",
        instructions: "Cook rice, grill chicken, and serve together.",
        }),
        recipeRepo.create({
        name: "Fried Egg",
        instructions: "Fry an egg with a pinch of salt.",
        }),
    ]);

    await recipeIngRepo.save([
        recipeIngRepo.create({ recipe: recipe1, ingredient: rice, quantity: 200 }),
        recipeIngRepo.create({ recipe: recipe1, ingredient: chicken, quantity: 150 }),
        recipeIngRepo.create({ recipe: recipe2, ingredient: egg, quantity: 1 }),
    ]);

    const calendar1 = calendarRepo.create({});
    const calendar2 = calendarRepo.create({});
    await calendarRepo.save([calendar1, calendar2]);

    const today = new Date();
    const address1 = addressRepo.create({
        date: today.toISOString().split("T")[0],
        address: "Av. Principal 123",
        reference: "Casa azul",
        latitude: -17.7833,
        longitude: -63.1821,
        calendar: calendar1,
    });
    const address2 = addressRepo.create({
        date: today.toISOString().split("T")[0],
        address: "Calle Secundaria 45",
        reference: "Depto 2B",
        latitude: -17.7805,
        longitude: -63.1859,
        calendar: calendar2,
    });
    await addressRepo.save([address1, address2]);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 2);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 2);

    const [mealPlan1, mealPlan2] = await mealPlanRepo.save([
        mealPlanRepo.create({
        startDate,
        endDate,
        durationDays: 5,
        calendar: calendar1,
        client: client1,
        }),
        mealPlanRepo.create({
        startDate,
        endDate,
        durationDays: 5,
        calendar: calendar2,
        client: client2,
        }),
    ]);

    const diet1 = dayliDietRepo.create({
        date: today,
        nDayPlan: 3,
        mealPlan: mealPlan1,
        recipes: [recipe1, recipe2],
    });
    const diet2 = dayliDietRepo.create({
        date: today,
        nDayPlan: 3,
        mealPlan: mealPlan2,
        recipes: [recipe2],
    });
    await dayliDietRepo.save([diet1, diet2]);

    const order = orderRepo.create({
        dateOrdered: today,
        dateCreatedOn: new Date(),
        status: StatusOrder.CREATED,
    });
    await orderRepo.save(order);

    const [item1, item2, item3] = await orderItemRepo.save([
        orderItemRepo.create({
        order,
        recipe: recipe1,
        quantityPlanned: 2,
        quantityPrepared: 0,
        quantityDelivered: 0,
        status: StatusOrder.CREATED,
        }),
        orderItemRepo.create({
        order,
        recipe: recipe2,
        quantityPlanned: 3,
        quantityPrepared: 0,
        quantityDelivered: 0,
        status: StatusOrder.CREATED,
        }),
        orderItemRepo.create({
        order,
        recipe: recipe2,
        quantityPlanned: 1,
        quantityPrepared: 0,
        quantityDelivered: 0,
        status: StatusOrder.CREATED,
        }),
    ]);

    console.log("Database seeded successfully!");
    process.exit(0);
    }

    seed().catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
});
