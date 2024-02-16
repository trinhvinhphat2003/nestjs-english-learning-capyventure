import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountModule } from "../account/account.module";
import { VocabularyTagService } from "./vocabulary-tag.service";
import { VocabularyTag, VocabularyTagSchema } from "./vocabulary-tag.schema";
import { VocabularyTagController } from "./vocabulary-tag.controller";
import { AuthModule } from "../auth/auth.module";
import { VocabularyModule } from "../vocabulary/vocabulary.module";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: VocabularyTag.name, schema: VocabularyTagSchema }]),
        AccountModule,
        AuthModule,
        forwardRef(() => VocabularyModule)
    ],
    controllers: [
        VocabularyTagController,
    ],
    providers: [
        {
            provide: 'VOCABULARY_TAG_SERVICE_PHATTV',
            useClass: VocabularyTagService,
        }
    ],
    exports: [
        {
            provide: 'VOCABULARY_TAG_SERVICE_PHATTV',
            useClass: VocabularyTagService,
        }
    ],
})
export class VocabularyTagModule { }