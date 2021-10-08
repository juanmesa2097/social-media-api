import { Inject } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { FindManyPostReactionArgs } from 'src/@generated/post-reaction/find-many-post-reaction.args';
import { PostReactionCreateInput } from 'src/@generated/post-reaction/post-reaction-create.input';
import { PostReactionUpdateInput } from 'src/@generated/post-reaction/post-reaction-update.input';
import { PostReactionWhereUniqueInput } from 'src/@generated/post-reaction/post-reaction-where-unique.input';
import { PostReaction } from 'src/@generated/post-reaction/post-reaction.model';
import { PostReactionService } from './post-reaction.service';

@Resolver(() => PostReaction)
export class PostReactionResolver {
  private readonly POST_REACTION_CREATED = 'post_reaction_created';
  private readonly POST_REACTION_UPDATED = 'post_reaction_updated';
  private readonly POST_REACTION_REMOVED = 'post_reaction_removed';

  constructor(
    private postReactionService: PostReactionService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Subscription(() => PostReaction)
  postChanged() {
    return this.pubSub.asyncIterator([
      this.POST_REACTION_CREATED,
      this.POST_REACTION_UPDATED,
      this.POST_REACTION_REMOVED,
    ]);
  }

  @Query(() => [PostReaction])
  async postReactions(
    @Args() args: FindManyPostReactionArgs,
    @Info() info: GraphQLResolveInfo,
  ): Promise<PostReaction[]> {
    const select = new PrismaSelect(info).value;
    return this.postReactionService.get(args, select);
  }

  @Mutation(() => PostReaction)
  async postReactionCreate(@Args('data') data: PostReactionCreateInput): Promise<PostReaction> {
    const createdPost = this.postReactionService.create(data);
    this.pubSub.publish(this.POST_REACTION_CREATED, { postChanged: createdPost });
    return createdPost;
  }

  @Mutation(() => PostReaction)
  async postReactionUpdate(
    @Args('data') data: PostReactionUpdateInput,
    @Args('where') where: PostReactionWhereUniqueInput,
  ): Promise<PostReaction> {
    const updatedPost = this.postReactionService.update(data, where);
    this.pubSub.publish(this.POST_REACTION_UPDATED, { postChanged: updatedPost });
    return updatedPost;
  }

  @Mutation(() => PostReaction)
  async postReactionDelete(
    @Args('where') where: PostReactionWhereUniqueInput,
  ): Promise<PostReaction> {
    const deletedPost = this.postReactionService.delete(where);
    this.pubSub.publish(this.POST_REACTION_UPDATED, { postChanged: deletedPost });
    return deletedPost;
  }
}
