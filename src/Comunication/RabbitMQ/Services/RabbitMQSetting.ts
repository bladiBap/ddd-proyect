export class RabbitMQSettings {
	constructor(
        public readonly port: number = 5672,
        public readonly useSSL: boolean = false,
        public readonly host: string = 'localhost',
        public readonly username: string = 'guest',
        public readonly password: string = 'guest',
        public readonly virtualHost: string = '/'
	) {}
}