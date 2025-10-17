export interface IUnitOfWork {
    commitAsync(cancelationToken: string): Promise<void>;
}