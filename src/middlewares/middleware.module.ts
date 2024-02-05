import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JWTFilter } from './JWT-filter.middleware';

@Module({
    imports: [
        AuthModule,
    ]
})
export class MyMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JWTFilter)
            .forRoutes('*')
    }
}