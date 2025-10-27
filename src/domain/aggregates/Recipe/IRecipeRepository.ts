import { IRepository } from '../../../core/abstractions/IRepository';
import { Recipe } from './Recipe';

export interface IRecipeRepository extends IRepository<Recipe> {
    getByIdsAsync(ids: number[], readOnly?: boolean): Promise<Recipe[]>;
}