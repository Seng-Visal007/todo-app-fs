import { DataSource } from "typeorm";
export default new DataSource({
    type: "postgres",
    host: "localhost", port: 5432,
    username: "postgres",
    password: "postgres",
    database: "todo",
    // Keep this in sync with the actual entity locations under src/**/entities.
    entities: ["src/**/*.entity.ts"],
    migrations: ["src/migrations/*.ts"],
});
