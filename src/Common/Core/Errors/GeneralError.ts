export class GeneralError {
    
    public static stringEmpty(variableName: string, entityName: string): Error {
        return new Error(`The variable ${variableName}(VariableName) of ${entityName}(EntityName) cannot be an empty string.`);
    }
}