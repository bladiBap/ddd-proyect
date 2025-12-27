import { Entity } from '@core/Abstractions/Entity';
import { DomainException } from '@core/Results/DomainExeption';
import { RecipeError } from '../Errors/RecipeError';

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