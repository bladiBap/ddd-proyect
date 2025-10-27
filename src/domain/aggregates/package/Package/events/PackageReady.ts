import { DomainEvent } from "../../../../../core/abstractions/DomainEvent";
import { Package } from '../Package';

export class PackageCompleted extends DomainEvent {
    public readonly packageId: number;
    public readonly dateCompleted: Date;

    constructor(pkg: Package) {
        super();
        this.packageId = pkg.getId();
        this.dateCompleted = new Date();
    }
}