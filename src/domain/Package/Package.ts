import { AggregateRoot } from "../core/abstractions/AgregateRoot";
import { Client } from '../Client/Client';
import { PackageItem } from "../PackageItem/PackageItem";
import { StatusPackage } from "./StatusPackage";
import { DomainException } from "../core/results/DomainExeption";
import { PackageError } from "./PackageError";

export class Package extends AggregateRoot {
    
    private code: string;
    private statusPackage: StatusPackage;
    private client: Client;
    private listPackageItems: PackageItem[] = [];

    constructor(id: number, code: string, statusPackage: StatusPackage, client: Client, listPackageItems: PackageItem[] = []) {
        super(id);
        if (code.trim().length === 0) {
            throw new DomainException( PackageError.codeIsRequired() );
        }

        if (listPackageItems.length === 0) {
            throw new DomainException( PackageError.packageMustHaveAtLeastOneItem() );
        }

        this.code = code;
        this.statusPackage = statusPackage;
        this.client = client;
        this.listPackageItems = listPackageItems;
    }


    public getCode(): string {
        return this.code;
    }

    public getStatusPackage(): StatusPackage {
        return this.statusPackage;
    }

    public getClient(): Client {
        return this.client;
    }

    public getListPackageItems(): PackageItem[] {
        return this.listPackageItems;
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

}