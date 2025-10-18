import { IAddressRepository } from "@domain/aggregates/address/IAddressRepository";

import { AppDataSource } from "../PersistenceModel/data-source";
import { Address } from "@domain/aggregates/address/Address";
import { Address as AddressPersis } from "../PersistenceModel/Entities/Address";
import { AddressMapper } from "../DomainModel/Config/AddressMapper";

export class AddressRepository implements IAddressRepository {

    private readonly repo = AppDataSource.getRepository(AddressPersis);

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

    async getClientsForDeliveredInformation(date: Date): Promise<any[]> {

        const formattedDate = date.toISOString().split("T")[0];

        return await this.repo.query(
            `
            SELECT 
                c."name" AS "clientName",
                c."id" AS "clientId",
                a."address" AS "clientAddress",
                a."reference" AS "reference",
                a."latitude" AS "latitude",
                a."longitude" AS "longitude",
                a."id" AS "addressId",
                r."name" AS "recipeName",
                r."id"   AS "recipeId"
            FROM "address" a
            INNER JOIN "calendar" cal ON cal."id" = a."calendarId"
            INNER JOIN "meal_plan" mp ON mp."calendarId" = cal."id"
            INNER JOIN "client" c ON c."id" = mp."clientId"
            INNER JOIN "dayli_diet" dd ON dd."mealPlanId" = mp."id"
            INNER JOIN "dayli_diet_recipes" ddr ON ddr."dayliDietId" = dd."id"
            INNER JOIN "recipe" r ON r."id" = ddr."recipeId"
            WHERE a."date"::date = $1
                AND mp."startDate" <= $1::date
                AND mp."endDate" >= $1::date
            ORDER BY c."name", r."name";
            `,
            [formattedDate]
        );
    }
    
    async deleteAsync(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async getByIdAsync(id: number, readOnly?: boolean): Promise<Address | null> {
        const address = await this.repo.findOne({ where: { id: id }, relations: ["client"] });
        if (!address) return null;
        return AddressMapper.toDomain(address);
    }

    async addAsync(entity: Address): Promise<void> {
        const addressEntity = AddressMapper.toPersistence(entity);
        await this.repo.save(addressEntity);
    }
    
}