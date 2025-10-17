import { Entity } from "../shared/abstractions/Entity";
import { DomainException } from "../shared/results/DomainExeption";
import { RecipeError } from "./RecipeError";
import { Ingredient } from '../Ingredient/Ingredient';

export class Recipe extends Entity {
    
    private name : string;
    private instructions : string;
    private ingredients: Ingredient[];  

    constructor(id: number, name: string, instructions: string, ingredients: Ingredient[]) {
        super(id);
        if (name.trim().length === 0) {
            throw new DomainException( RecipeError.nameIsRequired() );
        }
        if (instructions.trim().length === 0) {
            throw new DomainException( RecipeError.instructionsAreRequired() );
        }
        if (ingredients.length === 0) {
            throw new DomainException( RecipeError.listOfIngredientsCannotBeEmpty() );
        }
        this.name = name;
        this.instructions = instructions;
        this.ingredients = ingredients;
    }
    
    public getName() : string {
        return this.name;
    }
    
    public getIngredients() : readonly Ingredient[] {
        return this.ingredients;
    }

    public getInstructions() : string {
        return this.instructions;
    }
}