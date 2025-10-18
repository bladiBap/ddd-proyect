import "reflect-metadata";
import { AppDataSource } from "../Persistence/PersistenceModel/data-source";

import { MeasurementUnit } from "../Persistence/PersistenceModel/Entities/MeasurementUnit";
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

    // 🔹 Repositorios
    const unitRepo = AppDataSource.getRepository(MeasurementUnit);
    const ingredientRepo = AppDataSource.getRepository(Ingredient);
    const recipeRepo = AppDataSource.getRepository(Recipe);
    const recipeIngRepo = AppDataSource.getRepository(RecipeIngredient);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);
    const addressRepo = AppDataSource.getRepository(Address);
    const calendarRepo = AppDataSource.getRepository(Calendar);
    const mealPlanRepo = AppDataSource.getRepository(MealPlan);
    const dayliDietRepo = AppDataSource.getRepository(DayliDiet);

    // 🧂 Unidades de medida
    const gram = unitRepo.create({ name: "Gram", simbol: "g" });
    const piece = unitRepo.create({ name: "Piece", simbol: "pc" });
    await unitRepo.save([gram, piece]);

    // 🥕 Ingredientes
    const rice = ingredientRepo.create({ name: "Rice", measurementUnit: gram });
    const chicken = ingredientRepo.create({ name: "Chicken Breast", measurementUnit: gram });
    const egg = ingredientRepo.create({ name: "Egg", measurementUnit: piece });
    await ingredientRepo.save([rice, chicken, egg]);

    // 🍛 Recetas
    const recipe1 = recipeRepo.create({
        name: "Chicken Rice Bowl",
        instructions: "Cook rice, grill chicken, and serve together.",
    });
    const recipe2 = recipeRepo.create({
        name: "Fried Egg",
        instructions: "Fry an egg with a pinch of salt.",
    });
    await recipeRepo.save([recipe1, recipe2]);

    // ⚗️ Relación receta - ingredientes
    const rel1 = recipeIngRepo.create({ recipe: recipe1, ingredient: rice, quantity: 200 });
    const rel2 = recipeIngRepo.create({ recipe: recipe1, ingredient: chicken, quantity: 150 });
    const rel3 = recipeIngRepo.create({ recipe: recipe2, ingredient: egg, quantity: 1 });
    await recipeIngRepo.save([rel1, rel2, rel3]);

    // 🗓️ Datos de calendario / direcciones / plan alimenticio
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 2);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 2);

    const calendar = calendarRepo.create({});
    await calendarRepo.save(calendar);

    const addressToday = addressRepo.create({
        date: today.toISOString().split("T")[0],
        address: "Av. Principal 123",
        reference: "Casa azul",
        latitude: -17.7833,
        longitude: -63.1821,
        calendar: calendar,
    });
    await addressRepo.save(addressToday);

    const mealPlan = mealPlanRepo.create({
        startDate,
        endDate,
        durationDays: 5,
        calendar: calendar,
    });
    await mealPlanRepo.save(mealPlan);

    // 🍎 Dieta diaria (con recetas de hoy)
    const dayliDiet = dayliDietRepo.create({
        date: today,
        nDayPlan: 3,
        mealPlan,
        recipes: [recipe1, recipe2],
    });
    await dayliDietRepo.save(dayliDiet);

    // 🧾 Orden (para probar OrderItem directo)
    const order = orderRepo.create({
        dateOrdered: today,
        dateCreatedOn: new Date(),
        status: StatusOrder.CREATED,
    });
    await orderRepo.save(order);

    const item1 = orderItemRepo.create({
        order,
        recipe: recipe1,
        quantity: 2,
        status: StatusOrder.CREATED,
    });

    const item2 = orderItemRepo.create({
        order,
        recipe: recipe2,
        quantity: 3,
        status: StatusOrder.CREATED,
    });

    await orderItemRepo.save([item1, item2]);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
    }

    seed().catch((err) => {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
});
