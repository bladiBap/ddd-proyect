export class ResponseDto<T> {
    public isSuccess: boolean;
    public error?: Exeption;
    public value?: T;
}


export class Exeption {
    public structuredMessage: string;
    public description: string;
    public code: string;
    public type: number;
}