import "reflect-metadata";
import { AppDataSource } from "./DomainModel/data-source";
import { MeasurementUnit } from "./PersistenceModel/Entities/MeasurementUnit";
import { Ingredient } from "./PersistenceModel/Entities/Ingredient";
import { Recipe } from "./PersistenceModel/Entities/Recipe";
import { RecipeIngredient } from "./PersistenceModel/Entities/RecipeIngredient";
import { Order } from "./PersistenceModel/Entities/Order";
import { OrderItem } from "./PersistenceModel/Entities/OrderItem";
import { StatusOrder } from "@domain/aggregates/order/StatusOrderEnum";

async function seed() {
    await AppDataSource.initialize();
    console.log("Connected to database");

    const unitRepo = AppDataSource.getRepository(MeasurementUnit);
    const ingredientRepo = AppDataSource.getRepository(Ingredient);
    const recipeRepo = AppDataSource.getRepository(Recipe);
    const recipeIngRepo = AppDataSource.getRepository(RecipeIngredient);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);

    //Crear unidades de medida
    const gram = unitRepo.create({ name: "Gram", simbol: "g" });
    const piece = unitRepo.create({ name: "Piece", simbol: "pc" });
    await unitRepo.save([gram, piece]);

    //Crear ingredientes
    const rice = ingredientRepo.create({ name: "Rice", measurementUnit: gram });
    const chicken = ingredientRepo.create({ name: "Chicken Breast", measurementUnit: gram });
    const egg = ingredientRepo.create({ name: "Egg", measurementUnit: piece });
    await ingredientRepo.save([rice, chicken, egg]);

    //Crear recetas
    const recipe1 = recipeRepo.create({
        name: "Chicken Rice Bowl",
        instructions: "Cook rice, grill chicken, and serve together."
    });

    const recipe2 = recipeRepo.create({
        name: "Fried Egg",
        instructions: "Fry an egg with a pinch of salt."
    });

    await recipeRepo.save([recipe1, recipe2]);

    //Crear relaciones receta-ingrediente
    const rel1 = recipeIngRepo.create({
        recipe: recipe1,
        ingredient: rice,
        quantity: 200
    });
    const rel2 = recipeIngRepo.create({
        recipe: recipe1,
        ingredient: chicken,
        quantity: 150
    });
    const rel3 = recipeIngRepo.create({
        recipe: recipe2,
        ingredient: egg,
        quantity: 1
    });
    await recipeIngRepo.save([rel1, rel2, rel3]);

    //Crear una orden
    const order = orderRepo.create({
        dateOrdered: new Date("2025-10-17"),
        dateCreatedOn: new Date(),
        status: StatusOrder.CREATED
    });
    await orderRepo.save(order);

  // Crear los items de la orden
    const item1 = orderItemRepo.create({
        order,
        recipe: recipe1,
        quantity: 2,
        status: StatusOrder.CREATED
    });

    const item2 = orderItemRepo.create({
        order,
        recipe: recipe2,
        quantity: 3,
        status: StatusOrder.CREATED
    });

    await orderItemRepo.save([item1, item2]);

    console.log("✅ Database populated successfully!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
});
