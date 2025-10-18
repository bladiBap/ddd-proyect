import { IAddressRepository } from "@domain/Address/IAddressRepository";
import { Order } from "@domain/aggregates/order/Order";

import { AppDataSource } from "../PersistenceModel/data-source";
import { Address as Entities } from '../PersistenceModel/Entities/Address';
import { Address } from "@domain/Address/Address";

export class AddressRepository implements IAddressRepository {

    private readonly repo = AppDataSource.getRepository(Address);

    async getRecipesToPrepare(date: Date): Promise<{ recipeId: number; quantity: number; }[]> {
        
        const formattedDate = date.toISOString().split("T")[0];

        const result = await this.repo.query(
            `
            SELECT 
                ddr."recipeId" AS "recipeId",
                COUNT(ddr."recipeId") AS "quantity"
            FROM "address" a
            INNER JOIN "calendar" c ON c."id" = a."calendarId"
            INNER JOIN "meal_plan" mp ON mp."calendarId" = c."id"
            INNER JOIN "dayli_diet" dd ON dd."mealPlanId" = mp."id"
            INNER JOIN "dayli_diet_recipes" ddr ON ddr."dayliDietId" = dd."id"
            WHERE a."date" = $1
                AND mp."startDate" <= $1::date
                AND mp."endDate" >= $1::date
            GROUP BY ddr."recipeId";
            `,
            [formattedDate]
        );

        return result.map((row: any) => ({
            recipeId: Number(row.recipeId),
            quantity: Number(row.quantity),
        }));
    }
    
    async deleteAsync(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async getByIdAsync(id: number, readOnly?: boolean): Promise<null> {
        return null;
    }

    async addAsync(entity: Address): Promise<void> {
        await this.repo.save(entity);
    }
    
}