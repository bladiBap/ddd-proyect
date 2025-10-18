import { AggregateRoot } from "../../../core/abstractions/AgregateRoot";
import { Client } from '../../../Client/Client';
import { PackageItem } from "../PackageItem/PackageItem";
import { StatusPackage } from "./StatusPackage";
import { DomainException } from "../../../core/results/DomainExeption";
import { PackageError } from "./PackageError";

export class Package extends AggregateRoot {
    
    private clientId: number;
    private addressId: number;
    private code: string;
    private statusPackage: StatusPackage;
    private datePackage: Date = new Date();
    private listPackageItems: PackageItem[] = [];

    constructor(id: number, code: string, statusPackage: StatusPackage, clientId: number, addressId: number, datePackage: Date, listPackageItems: PackageItem[] = []) {
        super(id);
        
        if (code.trim().length === 0) {
            throw new DomainException( PackageError.codeIsRequired() );
        }

        this.code = code;
        this.statusPackage = statusPackage;
        this.clientId = clientId;
        this.listPackageItems = listPackageItems;
        this.addressId = addressId;
        this.datePackage = datePackage;
    }

    public addPackageItem(packageItem: PackageItem): void {
        if (this.statusPackage === StatusPackage.DELIVERED) {
            throw new DomainException( PackageError.cannotAddItemToDeliveredPackage() );
        }
        this.listPackageItems.push(packageItem);
    }

    public changeToDelivered(): void {
        if (this.statusPackage !== StatusPackage.PACKAGING) {
            throw new DomainException( PackageError.canNotChangeStatus(this.statusPackage, StatusPackage.DELIVERED) );
        }
        this.statusPackage = StatusPackage.DELIVERED;
    }


    public getCode(): string {
        return this.code;
    }

    public getStatusPackage(): StatusPackage {
        return this.statusPackage;
    }

    public getClientId(): number {
        return this.clientId;
    }

    public getListPackageItems(): PackageItem[] {
        return this.listPackageItems;
    }

    public getAddressId(): number {
        return this.addressId;
    }

    public getDatePackage(): Date {
        return this.datePackage;
    }
}