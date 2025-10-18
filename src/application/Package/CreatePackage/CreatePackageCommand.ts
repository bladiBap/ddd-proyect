
export class CreatePackageCommand {
    constructor(
        public readonly clientId: number,
        public readonly addressId: number,
        public readonly recipeIds: number[]
    ) {}
}
