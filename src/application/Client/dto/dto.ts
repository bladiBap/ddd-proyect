export interface IRecipeDTO {
    id: number;
    name: string;
}

export interface IAddressDTO {
    id: number;
    address: string;
    reference: string;
    latitude: number;
    longitude: number;
}

export interface IClientRecipesTodayDTO {
    id: number;
    clientName: string;
    address: IAddressDTO;
    recipes: IRecipeDTO[];
}

