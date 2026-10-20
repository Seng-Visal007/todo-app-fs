import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTodoBonusFields1792492000000 implements MigrationInterface {
  name = "AddTodoBonusFields1792492000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" ADD "starred" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "todo" ADD "sort_order" integer NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "sort_order"`);
    await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "starred"`);
  }
}
