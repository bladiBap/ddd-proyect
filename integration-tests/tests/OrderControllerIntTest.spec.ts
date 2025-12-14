import { ResponseDto } from '../DTOs/ResponseDto';
import { HttpClientBuilder } from '../http/Client';

describe('OrderControllerIntTest', () => {
    describe('GenerateOrder', () => {
        //Create Order Test
        it('should generate an order successfully', async () => {
            // Arrange
            const client = new HttpClientBuilder().withUrl('order-today/generate', 'POST');   
            // Act
            const response = await client.send();
            const data: ResponseDto<null> = response.data;
            // Assert
            expect(response).toBeDefined();
            expect(response.status).toBe(201);
            expect(data).toHaveProperty('isSuccess', true);
        });

        //should not create order if one already exists for today
        it('should not generate an order if one already exists for today', async () => {
            // Arrange
            const client = new HttpClientBuilder().withUrl('order-today/generate', 'POST');
            // Act
            const firstResponse = await client.send();
            const secondResponse = await client.send();
            const data: ResponseDto<null> = secondResponse.data;
            // Assert
            expect(firstResponse).toBeDefined();
            expect(firstResponse.status).toBe(201);
            expect(secondResponse).toBeDefined();
            expect(secondResponse.status).toBe(400);
            expect(data).toHaveProperty('isSuccess', false);
            expect(data).toHaveProperty('error');
            expect(data.error).toHaveProperty('code', 'Order.AlreadyExists');
            expect(data.error).toHaveProperty('type', 3);
        });

        //should not create order if there are no recipes to prepare
        it('should not generate an order if there are no recipes to prepare', async () => {
            // Arrange
            const client = new HttpClientBuilder().withUrl('order-today/generate', 'POST');
            // Act
            const response = await client.send();
            const data: ResponseDto<null> = response.data;
            // Assert
            expect(response).toBeDefined();
            expect(response.status).toBe(400);
            expect(data).toHaveProperty('isSuccess', false);
            expect(data).toHaveProperty('error');
            expect(data.error).toHaveProperty('code', 'Order.NoRecipes');
            expect(data.error).toHaveProperty('type', 1);
        });
    });
});