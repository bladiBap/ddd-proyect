import { Exception } from "@core/results/ErrorCustom";

export class PackageError {
    
    public static notFoundById (id: number): Exception {
        return Exception.NotFound(
            "Pacckage.NotFound",
            `Not found package with id ${id}`
        );
    }

    public static notFoundForDate (date: Date): Exception {
        return Exception.NotFound(
            "Pacckage.NotFound",
            `Not found package for this date ${date}`
        );
    }

    public static alredyExistForThisDate (date: Date): Exception {
        return Exception.Conflict(
            "Package.AlredyExist",
            `Alredy exist package for this date ${date}`
        );
    }
}