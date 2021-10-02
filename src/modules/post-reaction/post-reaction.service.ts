import { Injectable } from '@nestjs/common';
import { FindManyPostReactionArgs } from 'src/@generated/post-reaction/find-many-post-reaction.args';
import { PostReactionCreateInput } from 'src/@generated/post-reaction/post-reaction-create.input';
import { PostReactionUpdateInput } from 'src/@generated/post-reaction/post-reaction-update.input';
import { PostReactionWhereUniqueInput } from 'src/@generated/post-reaction/post-reaction-where-unique.input';
import { PostReaction } from 'src/@generated/post-reaction/post-reaction.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostReactionService {
  constructor(private prisma: PrismaService) {}

  async get(args: FindManyPostReactionArgs, select: any): Promise<PostReaction[]> {
    return this.prisma.postReaction.findMany({ ...args, ...select });
  }

  async create(data: PostReactionCreateInput): Promise<PostReaction> {
    return this.prisma.postReaction.create({ data });
  }

  async update(
    data: PostReactionUpdateInput,
    where: PostReactionWhereUniqueInput,
  ): Promise<PostReaction> {
    return this.prisma.postReaction.update({ data, where });
  }

  async delete(where: PostReactionWhereUniqueInput): Promise<PostReaction> {
    return this.prisma.postReaction.delete({ where });
  }
}
