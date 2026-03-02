interface Constants {
    RABBIT_MQ_SETTINGS: {
        HOST: string;
        USERNAME: string;
        PASSWORD: string;
        VIRTUAL_HOST: string;
    }
}

export const constants: Constants = {
    RABBIT_MQ_SETTINGS: {
        HOST: process.env.RABBITMQ_HOST || 'localhost',
        USERNAME: process.env.RABBITMQ_USERNAME || 'guest',
        PASSWORD: process.env.RABBITMQ_PASSWORD || 'guest',
        VIRTUAL_HOST: process.env.RABBITMQ_VIRTUAL_HOST || '/',
    }
}