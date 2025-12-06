import { IRepository } from '@core/Abstractions/IRepository';
import { Recipe } from '../Entities/Recipe';
import { RecipeRawDTO } from '@application/Order/Dto/OrderRawDTO';

export interface IRecipeRepository extends IRepository<Recipe> {
    getByIdsAsync(ids: number[], readOnly?: boolean): Promise<Recipe[]>;
    getRecipesToPrepare(date: Date): Promise<RecipeRawDTO[]>;
}