import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1760756084676 implements MigrationInterface {
    name = 'InitialMigration1760756084676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "measurement_unit" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "simbol" character varying NOT NULL, CONSTRAINT "PK_fc57e5fd5adea5a7009f99e140a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "measurementUnitId" integer, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_ingredient" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "recipeId" integer, "ingredientId" integer, CONSTRAINT "PK_a13ac3f2cebdd703ac557c5377c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."package_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "package" ("id" SERIAL NOT NULL, "datePackage" TIMESTAMP NOT NULL, "status" "public"."package_status_enum" NOT NULL DEFAULT '0', "clientId" integer, "addressId" integer, CONSTRAINT "REL_f2910517fa70c5ebf0a073ee7c" UNIQUE ("addressId"), CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package_item" ("id" SERIAL NOT NULL, "packageId" integer, "recipeId" integer, CONSTRAINT "PK_b9830060b4e555fe0e1bd97b577" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "dateOrdered" TIMESTAMP NOT NULL, "dateCreatedOn" TIMESTAMP NOT NULL, "status" "public"."order_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_item_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "status" "public"."order_item_status_enum" NOT NULL DEFAULT '0', "recipeId" integer NOT NULL, "orderId" integer NOT NULL, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "instructions" character varying NOT NULL, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dayli_diet" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "nDayPlan" integer NOT NULL, "mealPlanId" integer, CONSTRAINT "PK_b914639284df0b263e3f31e2c51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "meal_plan" ("id" SERIAL NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "durationDays" integer NOT NULL, "calendarId" integer, "clientId" integer, CONSTRAINT "REL_5868e8024da2e6cdc4bf716ab5" UNIQUE ("calendarId"), CONSTRAINT "PK_b526e5597b340a2c47380a5033d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calendar" ("id" SERIAL NOT NULL, CONSTRAINT "PK_2492fb846a48ea16d53864e3267" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "date" character varying NOT NULL, "address" character varying NOT NULL, "reference" character varying NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "calendarId" integer, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dayli_diet_recipes" ("dayliDietId" integer NOT NULL, "recipeId" integer NOT NULL, CONSTRAINT "PK_04464d35bb69d719e741eadb8e4" PRIMARY KEY ("dayliDietId", "recipeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f250249a5a5a9093862879c0c1" ON "dayli_diet_recipes" ("dayliDietId") `);
        await queryRunner.query(`CREATE INDEX "IDX_39e2bdc5f419788e468af62a10" ON "dayli_diet_recipes" ("recipeId") `);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "FK_594ce79856fe438d9938425674d" FOREIGN KEY ("measurementUnitId") REFERENCES "measurement_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_1ad3257a7350c39854071fba211" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_2879f9317daa26218b5915147e7" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_2b0e0170cc17d9f9b45da3cb0bc" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_f2910517fa70c5ebf0a073ee7c9" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package_item" ADD CONSTRAINT "FK_79b371667fbe8d59b1c4583bbd2" FOREIGN KEY ("packageId") REFERENCES "package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package_item" ADD CONSTRAINT "FK_e29a64c977f960e2895558a92da" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_7850f98130347caee87f7dff07c" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dayli_diet" ADD CONSTRAINT "FK_d441e7a6e8bbc6e8fcf58413ae1" FOREIGN KEY ("mealPlanId") REFERENCES "meal_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal_plan" ADD CONSTRAINT "FK_5868e8024da2e6cdc4bf716ab53" FOREIGN KEY ("calendarId") REFERENCES "calendar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal_plan" ADD CONSTRAINT "FK_065edaf7682fd232c51bb4b9c69" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_0eaf277374c498a9ce5378cb76b" FOREIGN KEY ("calendarId") REFERENCES "calendar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dayli_diet_recipes" ADD CONSTRAINT "FK_f250249a5a5a9093862879c0c16" FOREIGN KEY ("dayliDietId") REFERENCES "dayli_diet"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dayli_diet_recipes" ADD CONSTRAINT "FK_39e2bdc5f419788e468af62a104" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dayli_diet_recipes" DROP CONSTRAINT "FK_39e2bdc5f419788e468af62a104"`);
        await queryRunner.query(`ALTER TABLE "dayli_diet_recipes" DROP CONSTRAINT "FK_f250249a5a5a9093862879c0c16"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_0eaf277374c498a9ce5378cb76b"`);
        await queryRunner.query(`ALTER TABLE "meal_plan" DROP CONSTRAINT "FK_065edaf7682fd232c51bb4b9c69"`);
        await queryRunner.query(`ALTER TABLE "meal_plan" DROP CONSTRAINT "FK_5868e8024da2e6cdc4bf716ab53"`);
        await queryRunner.query(`ALTER TABLE "dayli_diet" DROP CONSTRAINT "FK_d441e7a6e8bbc6e8fcf58413ae1"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_7850f98130347caee87f7dff07c"`);
        await queryRunner.query(`ALTER TABLE "package_item" DROP CONSTRAINT "FK_e29a64c977f960e2895558a92da"`);
        await queryRunner.query(`ALTER TABLE "package_item" DROP CONSTRAINT "FK_79b371667fbe8d59b1c4583bbd2"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_f2910517fa70c5ebf0a073ee7c9"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_2b0e0170cc17d9f9b45da3cb0bc"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_2879f9317daa26218b5915147e7"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_1ad3257a7350c39854071fba211"`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "FK_594ce79856fe438d9938425674d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39e2bdc5f419788e468af62a10"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f250249a5a5a9093862879c0c1"`);
        await queryRunner.query(`DROP TABLE "dayli_diet_recipes"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "calendar"`);
        await queryRunner.query(`DROP TABLE "meal_plan"`);
        await queryRunner.query(`DROP TABLE "dayli_diet"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TYPE "public"."order_item_status_enum"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TABLE "package_item"`);
        await queryRunner.query(`DROP TABLE "package"`);
        await queryRunner.query(`DROP TYPE "public"."package_status_enum"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "recipe_ingredient"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
        await queryRunner.query(`DROP TABLE "measurement_unit"`);
    }

}
