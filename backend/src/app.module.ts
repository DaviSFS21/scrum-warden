import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RulesModule } from './rules/rules.module';
import { SprintsModule } from './sprints/sprints.module';
import { PointsModule } from './points/points.module';
import { DailyModule } from './daily/daily.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RulesModule,
    SprintsModule,
    PointsModule,
    DailyModule,
    DashboardModule,
    ExportModule,
  ],
})
export class AppModule {}
