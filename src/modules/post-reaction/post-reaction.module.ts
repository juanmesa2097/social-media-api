import { Module } from '@nestjs/common';
import { PostReactionResolver } from './post-reaction.resolver';
import { PostReactionService } from './post-reaction.service';

@Module({
  providers: [PostReactionResolver, PostReactionService],
})
export class PostReactionModule {}
