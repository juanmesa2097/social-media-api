import { Inject } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { FindManyPostCommentArgs } from 'src/@generated/post-comment/find-many-post-comment.args';
import { PostCommentCreateInput } from 'src/@generated/post-comment/post-comment-create.input';
import { PostCommentUpdateInput } from 'src/@generated/post-comment/post-comment-update.input';
import { PostCommentWhereUniqueInput } from 'src/@generated/post-comment/post-comment-where-unique.input';
import { PostComment } from 'src/@generated/post-comment/post-comment.model';
import { Authorize } from '../auth/guards/authorize.guard';
import { PostCommentService } from './post-comment.service';

@Authorize()
@Resolver(() => PostComment)
export class PostCommentResolver {
  private readonly POST_COMMENT_CREATED = 'post_comment_created';
  private readonly POST_COMMENT_UPDATED = 'post_comment_updated';
  private readonly POST_COMMENT_DELETED = 'post_comment_deleted';

  constructor(
    private postCommentService: PostCommentService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Subscription(() => PostComment)
  postCommentChanged() {
    return this.pubSub.asyncIterator([
      this.POST_COMMENT_CREATED,
      this.POST_COMMENT_UPDATED,
      this.POST_COMMENT_DELETED,
    ]);
  }

  @Query(() => [PostComment])
  async postComment(
    @Args() args: FindManyPostCommentArgs,
    @Info() info: GraphQLResolveInfo,
  ): Promise<PostComment[]> {
    const select = new PrismaSelect(info).value;
    return this.postCommentService.get(args, select);
  }

  @Mutation(() => PostComment)
  async postCommentCreate(@Args('data') data: PostCommentCreateInput): Promise<PostComment> {
    const createdPostComment = this.postCommentService.create(data);
    this.pubSub.publish(this.POST_COMMENT_CREATED, { postCommentChanged: createdPostComment });
    return createdPostComment;
  }

  @Mutation(() => PostComment)
  async postCommentUpdate(
    @Args('data') data: PostCommentUpdateInput,
    @Args('where') where: PostCommentWhereUniqueInput,
  ): Promise<PostComment> {
    const updatedPostComment = this.postCommentService.update(data, where);
    this.pubSub.publish(this.POST_COMMENT_UPDATED, { postCommentChanged: updatedPostComment });
    return updatedPostComment;
  }

  @Mutation(() => PostComment)
  async postCommentDelete(@Args('where') where: PostCommentWhereUniqueInput): Promise<PostComment> {
    const deletedPostComment = this.postCommentService.delete(where);
    this.pubSub.publish(this.POST_COMMENT_DELETED, { postCommentChanged: deletedPostComment });
    return deletedPostComment;
  }
}
