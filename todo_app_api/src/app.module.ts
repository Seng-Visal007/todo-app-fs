import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; // 1. Import APP_GUARD
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TodosModule } from './todos/todos.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js'; // 2. Import your JwtAuthGuard

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "todo",
      autoLoadEntities: true,
      synchronize: false,
    }),
    TodosModule,
    ProfileModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 3. Make the JwtAuthGuard global (secure by default)
    },
  ],
})
export class AppModule {}