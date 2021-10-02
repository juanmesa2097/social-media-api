import { Module } from '@nestjs/common';
import { PostCommentResolver } from './post-comment.resolver';
import { PostCommentService } from './post-comment.service';

@Module({
  providers: [PostCommentResolver, PostCommentService],
})
export class PostCommentModule {}
