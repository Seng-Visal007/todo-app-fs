import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsers1792854950888 implements MigrationInterface {
    name = 'AddUsers1792854950888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "ownerId" uuid`);
        await queryRunner.query(`INSERT INTO "users" ("id", "email", "passwordHash", "role") SELECT uuid_generate_v4(), 'legacy-owner@todo.local', '!disabled!', 'USER' WHERE EXISTS (SELECT 1 FROM "todo")`);
        await queryRunner.query(`UPDATE "todo" SET "ownerId" = (SELECT "id" FROM "users" WHERE "email" = 'legacy-owner@todo.local') WHERE "ownerId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb8" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb8"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "ownerId"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
