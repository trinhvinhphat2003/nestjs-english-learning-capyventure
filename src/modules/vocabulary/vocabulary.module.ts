import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VocabularyService } from "./vocabulary.service";
import { VocabularyController } from "./vocabulary.controller";
import { Vocabulary, VocabularySchema } from "./vocabulary.schema";
import { AccountModule } from "../account/account.module";
import { VocabularyTagModule } from "../vocabulary-tag/vocabulary-tag.module";
import { AuthModule } from "../auth/auth.module";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Vocabulary.name, schema: VocabularySchema }]),
        AccountModule,
        forwardRef(() => VocabularyTagModule),
        AuthModule
    ],
    controllers: [
        VocabularyController,
    ],
    providers: [
        {
            provide: 'VOCABULARY_SERVICE_PHATTV',
            useClass: VocabularyService,
        }
    ],
    exports: [
        {
            provide: 'VOCABULARY_SERVICE_PHATTV',
            useClass: VocabularyService,
        }
    ],
})
export class VocabularyModule { }