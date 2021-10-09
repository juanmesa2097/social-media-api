import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PostCommentModule } from './modules/post-comment/post-comment.module';
import { PostReactionModule } from './modules/post-reaction/post-reaction.module';
import { PostModule } from './modules/post/post.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigProviderModule } from './providers/config-provider.module';
import { GqlProviderModule } from './providers/gql-provider.module';
import { PubSubModule } from './pub-sub/pub-sub.module';

@Module({
  imports: [
    ConfigProviderModule,
    GqlProviderModule,
    PubSubModule,
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    PostCommentModule,
    PostReactionModule,
    TagModule,
  ],
})
export class AppModule {}
