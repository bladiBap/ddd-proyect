import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1771920254742 implements MigrationInterface {
	name = 'InitialMigration1771920254742'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('CREATE TABLE "outbox_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" jsonb NOT NULL, "type" character varying NOT NULL, "created" TIMESTAMP NOT NULL, "processed" boolean NOT NULL DEFAULT false, "processedOn" TIMESTAMP, "correlationId" character varying, "traceId" character varying, "spanId" character varying, CONSTRAINT "PK_2f36ee5236f2793f3e7bd554589" PRIMARY KEY ("id"))');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP TABLE "outbox_message"');
	}

}
