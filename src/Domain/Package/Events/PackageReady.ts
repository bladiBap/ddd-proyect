import { DomainEvent } from '@common/Core/Abstractions/DomainEvent';
import { Package } from '../Entities/Package';

export class PackageCompleted extends DomainEvent {
    public readonly packageId: number;
    public readonly dateCompleted: Date;

    constructor(pkg: Package) {
        super();
        this.packageId = pkg.getId();
        this.dateCompleted = new Date();
    }
}