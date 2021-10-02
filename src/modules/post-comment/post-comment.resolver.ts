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
@Resolver()
export class PostCommentResolver {
  private readonly POST_COMMENT_CREATED = 'post_comment_created';
  private readonly POST_COMMENT_UPDATED = 'post_comment_updated';
  private readonly POST_COMMENT_REMOVED = 'post_comment_removed';

  constructor(
    private postCommentService: PostCommentService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Subscription(() => PostComment)
  postChanged() {
    return this.pubSub.asyncIterator([
      this.POST_COMMENT_CREATED,
      this.POST_COMMENT_UPDATED,
      this.POST_COMMENT_REMOVED,
    ]);
  }

  @Query(() => [PostComment])
  async postComments(
    @Args() args: FindManyPostCommentArgs,
    @Info() info: GraphQLResolveInfo,
  ): Promise<PostComment[]> {
    const select = new PrismaSelect(info).value;
    return this.postCommentService.get(args, select);
  }

  @Mutation(() => PostComment)
  async postCommentCreate(@Args('data') data: PostCommentCreateInput): Promise<PostComment> {
    const createdPost = this.postCommentService.create(data);
    this.pubSub.publish(this.POST_COMMENT_CREATED, { postChanged: createdPost });
    return createdPost;
  }

  @Mutation(() => PostComment)
  async postCommentUpdate(
    @Args('data') data: PostCommentUpdateInput,
    @Args('where') where: PostCommentWhereUniqueInput,
  ): Promise<PostComment> {
    const updatedPost = this.postCommentService.update(data, where);
    this.pubSub.publish(this.POST_COMMENT_UPDATED, { postChanged: updatedPost });
    return updatedPost;
  }

  @Mutation(() => PostComment)
  async postCommentDelete(@Args('where') where: PostCommentWhereUniqueInput): Promise<PostComment> {
    const deletedPost = this.postCommentService.delete(where);
    this.pubSub.publish(this.POST_COMMENT_UPDATED, { postChanged: deletedPost });
    return deletedPost;
  }
}
