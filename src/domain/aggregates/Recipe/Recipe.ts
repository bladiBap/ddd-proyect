import { Entity } from "../../../core/abstractions/Entity";
import { DomainException } from "../../../core/results/DomainExeption";
import { RecipeError } from "./RecipeError";

export class Recipe extends Entity {
    
    private name : string; 

    constructor(id: number, name: string) {
        super(id);
        if (name.trim().length === 0) {
            throw new DomainException( RecipeError.nameIsRequired() );
        }
        
        this.name = name;
    }
    
    public getName() : string {
        return this.name;
    }
}