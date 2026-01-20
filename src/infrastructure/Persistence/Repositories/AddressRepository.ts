import { IAddressRepository } from '@domain/Address/Repositories/IAddressRepository';

import { Address } from '@domain/Address/Entities/Address';
import { Address as AddressPersis } from '../PersistenceModel/Entities/Address';
import { AddressMapper } from '../DomainModel/Config/AddressMapper';
import { RecipeByClientDTO } from '@application/Order/Dto/RecipeByClientDTO';
import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider } from '@common/Core/Abstractions/IEntityManagerProvider';

@injectable()
export class AddressRepository implements IAddressRepository {

    constructor(
        @inject('IEntityManagerProvider') private readonly emProvider: IEntityManagerProvider
    ) {}

    async getPerClientNeeds(date: Date): Promise<RecipeByClientDTO[]> {
        const manager = this.emProvider.getManager();
        const formattedDate = date.toISOString().split('T')[0];
        const result = await manager.query(`
            SELECT 
                c."id" AS "clientId",
                c."name" AS "clientName",
                ddr."recipeId" AS "recipeId",
                COUNT(ddr."recipeId") AS "quantity"
            FROM "address" a
            INNER JOIN "calendar" cal ON cal."id" = a."calendarId"
            INNER JOIN "meal_plan" mp ON mp."calendarId" = cal."id"
            INNER JOIN "client" c ON c."id" = mp."clientId"
            INNER JOIN "dayli_diet" dd ON dd."mealPlanId" = mp."id"
            INNER JOIN "dayli_diet_recipes" ddr ON ddr."dayliDietId" = dd."id"
            WHERE a."date" = $1
                AND mp."startDate" <= $1::date
                AND mp."endDate" >= $1::date
            GROUP BY c."id", c."name", ddr."recipeId"; `,
            [formattedDate]
        );
        if (result.length === 0) {
            return [];
        }
        const clientNeeds: RecipeByClientDTO[] = result.map((row: any) => ({
            clientId: parseInt(row.clientId, 10),
            recipeId: parseInt(row.recipeId, 10),
            quantity: parseInt(row.quantity, 10),
        }));
        return clientNeeds;
    }

    async getClientsForDeliveredInformation(date: Date): Promise<any[]> {
        const manager = this.emProvider.getManager();
        const formattedDate = date.toISOString().split('T')[0];

        return await manager.query(
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

    async getAddressForTodayByClientId(clientId: number): Promise<Address | null> {
        
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const manager = this.emProvider.getManager();

        const addressRaw = await manager
            .getRepository(AddressPersis)
            .createQueryBuilder('a')
            .innerJoin('a.calendar', 'cal')
            .innerJoin('cal.mealPlan', 'mp')
            .where('mp.clientId = :clientId', { clientId })
            .andWhere('a.date::date >= :start AND a.date::date < :end', { start: start.toISOString(), end: end.toISOString() })
            .orderBy('a.date', 'DESC')
            .getOne();

        if (addressRaw === null) {return null;}

        return AddressMapper.toDomain(addressRaw);
    }

    async addAsync(entity: Address): Promise<void> {
        const manager = this.emProvider.getManager();
        const addressEntity = AddressMapper.toPersistence(entity);

        await manager.getRepository(AddressPersis).save(addressEntity);
    }

    async getByIdAsync(id: number, readOnly?: boolean): Promise<Address | null> {
        const manager = this.emProvider.getManager();
        const address = await manager.getRepository(AddressPersis).findOne(
            { where: { id: id }}
        );
        if (!address) {return null;}
        return AddressMapper.toDomain(address);
    }

    async updateAsync(address: Address): Promise<void> {
        const manager = this.emProvider.getManager();
        const addressEntity = AddressMapper.toPersistence(address);
        await manager.getRepository(AddressPersis).save(addressEntity);
    }

    async deleteAsync(id: number): Promise<void> {
        const manager = this.emProvider.getManager();
        await manager.getRepository(AddressPersis).delete({ id });
    }
}