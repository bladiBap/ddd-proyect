import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { StatusPackage } from "@domain/Package/StatusPackage";

import { PackageItem } from "./PackageItem";
import { Client } from "./Client";
import { Address } from "./Address";

@Entity()
export class Package {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    datePackage!: Date;

    @Column({ type: "enum", enum: StatusPackage, default: StatusPackage.PACKAGING })
    status!: StatusPackage;

    @OneToMany(() => PackageItem, (packageItem) => packageItem.package, { cascade: true, eager: true })
    packageItems!: PackageItem[];

    @ManyToOne(() => Client, (client) => client.packages)
    @JoinColumn({ name: "clientId" })
    client!: Client;

    @OneToOne(() => Address, (address) => address.package, { cascade: true, eager: true })
    @JoinColumn({ name: "addressId" })
    address!: Address;
}