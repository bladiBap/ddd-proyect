import { IClientDeliveredDTO } from '../dto/dto';

export class ClientDeliveredDTOMapper {

    static toDTO(clients: any[]): IClientDeliveredDTO[] {
        
        const grouped: Record<number, IClientDeliveredDTO> = {};
        
        clients.forEach(item => {
            if (!grouped[item.clientId]) {
                grouped[item.clientId] = {
                    clientName: item.clientName,
                    id: item.clientId,
                    address: {
                        id: item.addressId,
                        address: item.clientAddress,
                        reference: item.reference,
                        latitude: item.latitude,
                        longitude: item.longitude,
                    },
                    recipes: [],
                };
            }

            grouped[item.clientId].recipes.push({
                id: item.recipeId,
                name: item.recipeName,
            });
        });

        const lista = Object.values(grouped);
        return lista;
    }
}