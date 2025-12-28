import { ResponseDto } from '@test/Integration/DTOs/ResponseDto';
import { Order } from '../Interface/Order';

export const responseGenerateOrder : Order = {
    id: 1,
    dateOrdered: '2025-12-27',
    dateCreatedOn: '2025-12-27',
    status: 0,
    orderItems: [
        {
            id: 1,
            quantity: 2,
            status: 0,
            recipe: {
                id: 1,
                name: 'Chicken Rice Bowl',
                instructions: 'Cook rice, grill chicken, and serve together.',
                ingredients: [
                    {
                        id: 1,
                        name: 'Rice',
                        measurementUnit: {
                            id: 1,
                            name: 'Gram',
                            simbol: 'g'
                        }
                    },
                    {
                        id: 2,
                        name: 'Chicken Breast',
                        measurementUnit: {
                            id: 1,
                            name: 'Gram',
                            simbol: 'g'
                        }
                    }
                ]
            }
        },
        {
            id: 2,
            quantity: 3,
            status: 0,
            recipe: {
                id: 2,
                name: 'Fried Egg',
                instructions: 'Fry an egg with a pinch of salt.',
                ingredients: [
                    {
                        id: 3,
                        name: 'Egg',
                        measurementUnit: {
                            id: 2,
                            name: 'Piece',
                            simbol: 'pc'
                        }
                    }
                ]
            }
        },
        {
            id: 3,
            quantity: 1,
            status: 0,
            recipe: {
                id: 2,
                name: 'Fried Egg',
                instructions: 'Fry an egg with a pinch of salt.',
                ingredients: [
                    {
                        id: 3,
                        name: 'Egg',
                        measurementUnit: {
                            id: 2,
                            name: 'Piece',
                            simbol: 'pc'
                        }
                    }
                ]
            }
        }
    ]
};

export const responseGetOrder: ResponseDto<Order> = {
    isSuccess: true,
    error: {
        structuredMessage: '',
        description: '',
        code: '',
        type: 0
    },
    value: responseGenerateOrder
};