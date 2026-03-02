export class RabbitMQSettings {
    public host : string | undefined
    public port : number
    public username : string | undefined
    public password : string | undefined
    public virtualHost : string | undefined
    public useSSL: boolean

    constructor (
        port: number,
        useSSL: boolean = false,
        host: string | undefined,
        username: string | undefined,
        password: string | undefined,
        virtualHost: string | undefined,
    ){
        this.port = port
        this.useSSL = useSSL
        this.host = host
        this.username = username
        this.password = password
        this.virtualHost = virtualHost
    }
}