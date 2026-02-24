import { Package } from '@domain/Package/Entities/Package';
import { PackageItem } from '@domain/Package/Entities/PackageItem';
import { StatusPackage } from '@domain/Package/Types/StatusPackage';
import { DomainException } from '@common/Core/Results/DomainExeption';

describe('Package Aggregate Root', () => {
    const mockDate = new Date('2026-01-20');
    const validParams = {
        id: 1,
        code: 'PKG-001',
        status: StatusPackage.PACKAGING,
        clientId: 10,
        addressId: 5,
        date: mockDate
    };

    describe('Constructor & Validation', () => {
        it('should create a valid Package instance', () => {
            const pkg = new Package(
                validParams.id, 
                validParams.code, 
                validParams.status, 
                validParams.clientId, 
                validParams.addressId, 
                validParams.date
            );

            expect(pkg.getCode()).toBe(validParams.code);
            expect(pkg.getStatusPackage()).toBe(StatusPackage.PACKAGING);
        });

        it('should throw DomainException if code is empty or whitespace', () => {
            expect(() => {
                new Package(1, '   ', StatusPackage.PACKAGING, 10, 5, mockDate);
            }).toThrow(DomainException);
        });
    });

    describe('addPackageItem', () => {
        it('should add an item successfully when status is PACKAGING', () => {
            const pkg = new Package(1, 'CODE', StatusPackage.PACKAGING, 10, 5, mockDate);
            const item = new PackageItem(1, 101, 1, 2);

            pkg.addPackageItem(item);

            expect(pkg.getListPackageItems()).toHaveLength(1);
            expect(pkg.getListPackageItems()[0]).toBe(item);
        });

        it('should throw DomainException when adding an item to a DELIVERED package', () => {
            const pkg = new Package(1, 'CODE', StatusPackage.DELIVERED, 10, 5, mockDate);
            const item = new PackageItem(1, 101, 1, 2);

            expect(() => {
                pkg.addPackageItem(item);
            }).toThrow(DomainException);
        });
    });

    describe('changeToDelivered', () => {
        it('should change status to DELIVERED when current status is PACKAGING', () => {
            const pkg = new Package(1, 'CODE', StatusPackage.PACKAGING, 10, 5, mockDate);
            
            pkg.changeToDelivered();

            expect(pkg.getStatusPackage()).toBe(StatusPackage.DELIVERED);
        });

        it('should throw DomainException if trying to deliver a package that is NOT in PACKAGING status', () => {
            
            const pkg = new Package(1, 'CODE', StatusPackage.DELIVERED, 10, 5, mockDate);

            expect(() => {
                pkg.changeToDelivered();
            }).toThrow(DomainException);
        });
    });
});