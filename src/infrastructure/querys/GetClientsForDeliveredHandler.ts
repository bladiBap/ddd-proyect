import { DataSource } from 'typeorm';
import { injectable, inject } from 'tsyringe';
import { ResultWithValue } from '@core/Results/Result';

import { QueryHandler } from '@application/Mediator/Decorators';
import { IClientDeliveredDTO } from '@application/Client/Dto/dto';
import { GetClientsForDelivered } from '@application/Client/GetClientsForDelivery/GetClientsForDelivered';
import { Address } from '@infrastructure/Persistence/PersistenceModel/Entities/Address';
import { DateUtils } from '@utils/Date';
import { ClientDeliveredDTOMapper } from '@application/Client/GetClientsForDelivery/ClientDeliveredDTOMapper';

@injectable()
@QueryHandler(GetClientsForDelivered)
export class GetClientsForDeliveredHandler {

    constructor(
        @inject('DataSource') private readonly dataSource: DataSource
    ) {}

    async execute(request: GetClientsForDelivered): Promise<ResultWithValue<IClientDeliveredDTO[]>> {
        const addressTable = this.dataSource.getRepository(Address);

        const date = DateUtils.formatDate(request.date);
        console.log('Fetching clients for delivery on date:', date);
        const clientsToDelivered = await addressTable.find({
            where: { date: date },
            relations: [
                'calendar',
                'calendar.mealPlan',
                'calendar.mealPlan.client',
                'calendar.mealPlan.dayliDiets',
                'calendar.mealPlan.dayliDiets.recipes'
            ]
        });
        const listclientsToDeliveredList = ClientDeliveredDTOMapper.toDTO(clientsToDelivered);
        return ResultWithValue.successWith<IClientDeliveredDTO[]>(listclientsToDeliveredList);
    }
}