import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1760770602056 implements MigrationInterface {
    name = 'InitialMigration1760770602056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "latitude" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "longitude" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "longitude" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "latitude" integer NOT NULL`);
    }

}
