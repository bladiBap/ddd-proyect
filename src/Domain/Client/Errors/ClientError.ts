export class ClientError {

    public static nameIsRequired(): Error {
        return new Error('The name of the client is required.');
    }
}