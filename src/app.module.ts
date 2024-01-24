import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CONFIG, MONGO_HOST } from './configs/mongo.config';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoryCategoryModule } from './modules/story-category/story-category.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_HOST, MONGO_CONFIG),
    AccountModule,
    AuthModule,
    StoryCategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
