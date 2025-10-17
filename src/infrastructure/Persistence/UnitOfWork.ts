import { IUnitOfWork } from "@domain/shared/abstractions/IUnitOfWork";

export class UnitOfWork implements IUnitOfWork {

    

    commitAsync(cancelationToken: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

