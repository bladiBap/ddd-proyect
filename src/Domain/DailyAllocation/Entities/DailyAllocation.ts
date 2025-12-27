import { AggregateRoot } from '@core/Abstractions/AgregateRoot';
import { AllocationLine } from './AllocationLine';

export class DailyAllocation extends AggregateRoot {
    private date: Date;
    private lines: AllocationLine[];

    constructor(id: number, date: Date, lines: AllocationLine[] = []) {
        super(id);
        this.date = date;
        this.lines = lines;
    }

    public addLine(line: AllocationLine) {
        this.lines.push(line);
    }

    public clientHasAllRecipes(clientId: number, recipesIds: number[]): boolean {
        const clientRecipeIds = new Set(
            this.lines
                .filter(line => line.getClientId() === clientId)
                .map(line => line.getRecipeId())
        );
        return recipesIds.every(recipeId => clientRecipeIds.has(recipeId));
    }

    public getLines(): AllocationLine[] {
        return this.lines;
    }

    public getDate(): Date {
        return this.date;
    }
}