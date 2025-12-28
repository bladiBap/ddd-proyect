import { MatchersV3, PactV3 } from '@pact-foundation/pact';
import { describe, it } from 'mocha';
import { OrderService } from '../Services/OrderService';
import { expect } from 'chai';
import { responseGenerateOrder, responseGetOrder } from '../Response/Models';
const { like } = MatchersV3;

describe('Order Service', () => {
    let orderService : OrderService;

    const provider = new PactV3({
        consumer: 'react-client',
        provider: 'order-service',
        port: 3000,
    });

    describe('Ger Order for Today', () => {
        it('should get an order for today with orderItems', async () => {
            provider
                .given('Order for today exists with order items')
                .uponReceiving('A request to get an order for today')
                .withRequest({
                    method: 'GET',
                    path: '/order-today/details',
                })
                .willRespondWith({
                    status: 200,
                    body: like(responseGetOrder),
                });
            await provider.executeTest(async (mockServer) => {
                orderService = new OrderService(mockServer.url);
                const response = await orderService.getTodayOrder();
                expect(response).to.be.not.null;
                expect(response.isSuccess).to.be.true;
                expect(response.value).to.deep.equal(responseGenerateOrder);
                expect(response.value?.orderItems).to.be.an('array').that.is.not.empty;
                expect(response.value?.orderItems).to.have.lengthOf(3);
            });
        });
    });
});