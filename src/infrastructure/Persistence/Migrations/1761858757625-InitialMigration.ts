import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1761858757625 implements MigrationInterface {
    name = 'InitialMigration1761858757625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "daily_allocation" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "daily_allocation" ADD "date" date NOT NULL');
        await queryRunner.query('ALTER TABLE "package" DROP COLUMN "datePackage"');
        await queryRunner.query('ALTER TABLE "package" ADD "datePackage" date NOT NULL');
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "dateOrdered"');
        await queryRunner.query('ALTER TABLE "order" ADD "dateOrdered" date NOT NULL');
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "dateCreatedOn"');
        await queryRunner.query('ALTER TABLE "order" ADD "dateCreatedOn" date NOT NULL');
        await queryRunner.query('ALTER TABLE "dayli_diet" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "dayli_diet" ADD "date" date NOT NULL');
        await queryRunner.query('ALTER TABLE "meal_plan" DROP COLUMN "startDate"');
        await queryRunner.query('ALTER TABLE "meal_plan" ADD "startDate" date NOT NULL');
        await queryRunner.query('ALTER TABLE "meal_plan" DROP COLUMN "endDate"');
        await queryRunner.query('ALTER TABLE "meal_plan" ADD "endDate" date NOT NULL');
        await queryRunner.query('ALTER TABLE "address" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "address" ADD "date" date NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "address" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "address" ADD "date" TIMESTAMP NOT NULL');
        await queryRunner.query('ALTER TABLE "meal_plan" DROP COLUMN "endDate"');
        await queryRunner.query('ALTER TABLE "meal_plan" ADD "endDate" TIMESTAMP NOT NULL');
        await queryRunner.query('ALTER TABLE "meal_plan" DROP COLUMN "startDate"');
        await queryRunner.query('ALTER TABLE "meal_plan" ADD "startDate" TIMESTAMP NOT NULL');
        await queryRunner.query('ALTER TABLE "dayli_diet" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "dayli_diet" ADD "date" TIMESTAMP NOT NULL');
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "dateCreatedOn"');
        await queryRunner.query('ALTER TABLE "order" ADD "dateCreatedOn" TIMESTAMP NOT NULL');
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "dateOrdered"');
        await queryRunner.query('ALTER TABLE "order" ADD "dateOrdered" TIMESTAMP NOT NULL');
        await queryRunner.query('ALTER TABLE "package" DROP COLUMN "datePackage"');
        await queryRunner.query('ALTER TABLE "package" ADD "datePackage" TIMESTAMP NOT NULL');
        await queryRunner.query('ALTER TABLE "daily_allocation" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "daily_allocation" ADD "date" TIMESTAMP NOT NULL');
    }

}
