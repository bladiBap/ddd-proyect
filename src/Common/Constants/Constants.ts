interface Constants {
    RABBIT_MQ_SETTINGS: {
        HOST: string;
        USERNAME: string;
        PASSWORD: string;
        VIRTUAL_HOST: string;
    }
    JWT: {
        ISSUER: string;
        AUDIENCE: string;
        SECRET: string;
    }
}

export const constants: Constants = {
	RABBIT_MQ_SETTINGS: {
		HOST: process.env.RABBITMQ_HOST || 'localhost',
		USERNAME: process.env.RABBITMQ_USERNAME || 'guest',
		PASSWORD: process.env.RABBITMQ_PASSWORD || 'guest',
		VIRTUAL_HOST: process.env.RABBITMQ_VIRTUAL_HOST || '/',
	},
	JWT: {
		ISSUER: process.env.JWT_ISSUER || 'api_security',
		AUDIENCE: process.env.JWT_AUDIENCE || '*',
		SECRET: process.env.JWT_SECRET || 'DiplomadoMicroservicios2025SecretoJTWApiSecurity'
	}
}