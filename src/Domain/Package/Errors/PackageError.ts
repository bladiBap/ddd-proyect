import { StatusPackage } from '../Types/StatusPackage';

export class PackageError {
    public static codeIsRequired(): Error {
        return new Error('The code of the package is required.');
    }

    public static canNotChangeStatus ( currentStatus: StatusPackage, newStatus: StatusPackage ) : Error {
        return new Error(`Cannot change order status from ${currentStatus} to ${newStatus}.`);
    }

    public static packageMustHaveAtLeastOneItem(): Error {
        return new Error('The package must have at least one item.');
    }

    public static cannotAddItemToDeliveredPackage(): Error {
        return new Error('Cannot add item to a package that is already DELIVERED.');
    }
}