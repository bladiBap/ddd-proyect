import { ResponseDto } from '@test/Integration/DTOs/ResponseDto';
import { Order } from '@test/Contract/Response/Interface/Order';
import { api } from '@test/Contract/Api';

export class OrderService {

    constructor(private baseUrl: string) {
        api.defaults.baseURL = this.baseUrl;
    }

    generateForToday(): Promise<ResponseDto<null>> {
        return new Promise((resolve, reject) => {
            api.post('/order-today/generate')
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getTodayOrder(): Promise<ResponseDto<Order>> {
        return new Promise<ResponseDto<Order>>((resolve, reject) => {
            api.get('/order-today/details')
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}