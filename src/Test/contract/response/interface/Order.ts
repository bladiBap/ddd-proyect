export interface Order {
    id:            number;
    dateOrdered:   string;
    dateCreatedOn: string;
    status:        number;
    orderItems:    OrderItem[];
}

export interface OrderItem {
    id:       number;
    quantity: number;
    status:   number;
    recipe:   Recipe;
}

export interface Recipe {
    id:           number;
    name:         string;
    instructions: string;
    ingredients:  Ingredient[];
}

export interface Ingredient {
    id:              number;
    name:            string;
    measurementUnit: MeasurementUnit;
}

export interface MeasurementUnit {
    id:     number;
    name:   string;
    simbol: string;
}
