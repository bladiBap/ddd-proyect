import { ResponseDto } from '@test/integration/DTOs/ResponseDto';
import { HttpClientBuilder } from '@test/integration/http/Client';

describe('PackageControllerIntTest', () => {
    describe('CreatePackage', () => {
        //Create Package Test
        it('should create a package successfully', async () => {
            // Arrange
            const requestBody = {
                clientId: 1,
                recipeIds: [1, 2, 3]
            };
            const client = new HttpClientBuilder().withRequestBody(requestBody, 'package', 'POST');   
            // Act
            const response = await client.send();
            const data = response.data as ResponseDto<null>;
            // Assert
            expect(response).toBeDefined();
            expect(response.status).toBe(200);
            expect(data).toHaveProperty('isSuccess', true);
        });

        //should not create package if not found client
        it('should not create a package if client is not found', async () => {
            // Arrange
            const requestBody = {
                clientId: 999,
                recipeIds: [1, 2, 3]
            };
            const client = new HttpClientBuilder().withRequestBody(requestBody, 'package', 'POST');
            // Act
            const response = await client.send();
            const data = response.data as ResponseDto<null>;
            // Assert
            expect(response).toBeDefined();
            expect(response.status).toBe(400);
            expect(data).toHaveProperty('isSuccess', false);
            expect(data).toHaveProperty('error');
            expect(data.error).toHaveProperty('code', 'Client.NotFound');
        });

        //should not create package if package already exists for today
        it('should not create a package if one already exists for today', async () => {
            // Arrange
            const requestBody = {
                clientId: 1,
                recipeIds: [1, 2, 3]
            };
            const client = new HttpClientBuilder().withRequestBody(requestBody, 'package', 'POST');
            // Act
            const firstResponse = await client.send();
            const secondResponse = await client.send();
            const data = secondResponse.data as ResponseDto<null>;
            // Assert
            expect(firstResponse).toBeDefined();
            expect(firstResponse.status).toBe(200);
            expect(secondResponse).toBeDefined();
            expect(secondResponse.status).toBe(400);
            expect(data).toHaveProperty('isSuccess', false);
            expect(data).toHaveProperty('error');
            expect(data.error).toHaveProperty('code', 'Package.AlreadyExists');
        });
    });
});