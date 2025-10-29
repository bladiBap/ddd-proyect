
export class CreatePackageCommand {
    constructor(
        public readonly clientId: number,
        public readonly recipeIds: number[]
    ) {}
}
