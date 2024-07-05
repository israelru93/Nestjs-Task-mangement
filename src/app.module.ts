
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './confif.schema';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.stage.dev'],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST');
        const dbPort = configService.get<string>('DB_PORT');
        const dbUsername = configService.get<string>('DB_USERNAME');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbDatabase = configService.get<string>('DB_DATABASE');

        console.log('DB_HOST:', dbHost);
        console.log('DB_PORT:', dbPort);
        console.log('DB_USERNAME:', dbUsername);
        console.log('DB_PASSWORD:', dbPassword);
        console.log('DB_DATABASE:', dbDatabase);

        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: dbHost,
          port: parseInt(dbPort, 10),
          username: dbUsername,
          password: dbPassword,
          database: dbDatabase,
        };
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
