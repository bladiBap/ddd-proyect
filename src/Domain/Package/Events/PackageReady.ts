import { DomainEvent } from '@common/Core/Abstractions/DomainEvent';
//import { Package } from '../Entities/Package';

export class PackageCompleted extends DomainEvent {
    public readonly packageId: number;
    public readonly dateCompleted: Date;

    //constructor(pkg: Package) {
    constructor(pkgId: number) {
        super();
        this.packageId = pkgId;
        this.dateCompleted = new Date();
    }
}