import { DataSource } from "typeorm";
import { injectable, inject } from "tsyringe";
import { ResultWithValue } from "@core/Results/Result";

import { QueryHandler } from "@application/Mediator/Decorators";
import { IClientDeliveredDTO } from "@application/Client/Dto/dto";
import { GetClientsForDelivered } from "@application/Client/GetClientsForDelivery/GetClientsForDelivered";
import { ClientDeliveredDTOMapper } from "@application/Client/GetClientsForDelivery/ClientDeliveredDTOMapper";

@injectable()
@QueryHandler(GetClientsForDelivered)
export class GetClientsForDeliveredHandler {

    constructor(
        @inject("DataSource") private readonly dataSource: DataSource
    ) {}

    async execute(query: GetClientsForDelivered): Promise<ResultWithValue<IClientDeliveredDTO[]>> {

        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        const flatData = await this.dataSource.query(`
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
            ORDER BY c."name", r."name"; `,
            [formattedDate]
        );
        
        const lista = ClientDeliveredDTOMapper.toDTO(flatData);

        return ResultWithValue.successWith<IClientDeliveredDTO[]>(lista);
    }
}
