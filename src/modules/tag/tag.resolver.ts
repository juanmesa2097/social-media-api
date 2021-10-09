import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';
import { FindManyTagArgs } from 'src/@generated/tag/find-many-tag.args';
import { TagCreateInput } from 'src/@generated/tag/tag-create.input';
import { TagUpdateInput } from 'src/@generated/tag/tag-update.input';
import { TagWhereUniqueInput } from 'src/@generated/tag/tag-where-unique.input';
import { Tag } from 'src/@generated/tag/tag.model';
import { Authorize } from '../auth/guards/authorize.guard';
import { TagService } from './tag.service';

@Authorize()
@Resolver(() => Tag)
export class TagResolver {
  constructor(private tagService: TagService) {}

  @Query(() => [Tag])
  async tag(@Args() args: FindManyTagArgs, @Info() info: GraphQLResolveInfo): Promise<Tag[]> {
    const select = new PrismaSelect(info).value;
    return this.tagService.get(args, select);
  }

  @Mutation(() => Tag)
  async tagCreate(@Args('data') data: TagCreateInput): Promise<Tag> {
    return this.tagService.create(data);
  }

  @Mutation(() => Tag)
  async tagUpdate(
    @Args('data') data: TagUpdateInput,
    @Args('where') where: TagWhereUniqueInput,
  ): Promise<Tag> {
    return this.tagService.update(data, where);
  }

  @Mutation(() => Tag)
  async tagDelete(@Args('where') where: TagWhereUniqueInput): Promise<Tag> {
    return this.tagService.delete(where);
  }
}
