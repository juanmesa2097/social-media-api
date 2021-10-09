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
import { Authorize } from '../auth/guards/authorize.guard';
import { PostReactionService } from './post-reaction.service';

@Authorize()
@Resolver(() => PostReaction)
export class PostReactionResolver {
  private readonly POST_REACTION_CREATED = 'post_reaction_created';
  private readonly POST_REACTION_UPDATED = 'post_reaction_updated';
  private readonly POST_REACTION_DELETED = 'post_reaction_deleted';

  constructor(
    private postReactionService: PostReactionService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Subscription(() => PostReaction)
  postReactionChanged() {
    return this.pubSub.asyncIterator([
      this.POST_REACTION_CREATED,
      this.POST_REACTION_UPDATED,
      this.POST_REACTION_DELETED,
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
    const createdPostReaction = this.postReactionService.create(data);
    this.pubSub.publish(this.POST_REACTION_CREATED, { postReactionChanged: createdPostReaction });
    return createdPostReaction;
  }

  @Mutation(() => PostReaction)
  async postReactionUpdate(
    @Args('data') data: PostReactionUpdateInput,
    @Args('where') where: PostReactionWhereUniqueInput,
  ): Promise<PostReaction> {
    const updatedPostReaction = this.postReactionService.update(data, where);
    this.pubSub.publish(this.POST_REACTION_UPDATED, { postReactionChanged: updatedPostReaction });
    return updatedPostReaction;
  }

  @Mutation(() => PostReaction)
  async postReactionDelete(
    @Args('where') where: PostReactionWhereUniqueInput,
  ): Promise<PostReaction> {
    const deletedPostReaction = this.postReactionService.delete(where);
    this.pubSub.publish(this.POST_REACTION_DELETED, { postReactionChanged: deletedPostReaction });
    return deletedPostReaction;
  }
}
