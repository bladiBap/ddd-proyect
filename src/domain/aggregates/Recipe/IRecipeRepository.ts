import { IRepository } from '@core/abstractions/IRepository';
import { Recipe } from './Recipe';
import { RecipeRawDTO } from '@application/order/dto/OrderRawDTO';

export interface IRecipeRepository extends IRepository<Recipe> {
    getByIdsAsync(ids: number[], readOnly?: boolean): Promise<Recipe[]>;
    getRecipesToPrepare(date: Date): Promise<RecipeRawDTO[]>;
}