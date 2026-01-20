import { DataSource } from 'typeorm';
import { injectable, inject } from 'tsyringe';
import { ResultWithValue } from '@common/Core/Results/Result';

import { QueryHandler } from '@/Common/Mediator/Decorators';
import { Address } from '@infrastructure/Persistence/PersistenceModel/Entities/Address';
import { GetAddressById } from '@application/Address/Query/GetAddressById';
import { AddressDTO } from '@application/Address/Dto/AddressDto';
import { Exception } from '@common/Core/Results/Exception';
import { AddressDTOMapper } from '@application/Address/Query/Mappers/AddressMapper';

@injectable()
@QueryHandler(GetAddressById)
export class GetAddressByIdHandler {

    constructor(
        @inject('DataSource') private readonly dataSource: DataSource
    ) {}

    async execute(request: GetAddressById): Promise<ResultWithValue<AddressDTO>> {
        const addressTable = this.dataSource.getRepository(Address);

        const address =  await addressTable.findOneBy({ id: request.id });

        if (!address) {
            return ResultWithValue.failureWith<AddressDTO>(
                Exception.NotFound('address_not_found', `Address with id ${request.id} not found`)
            )
        }
        
        const addressDTO= AddressDTOMapper.toDTO(address);
        return ResultWithValue.successWith<AddressDTO>(addressDTO);
    }
}