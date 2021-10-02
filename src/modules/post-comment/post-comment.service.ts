import { Injectable } from '@nestjs/common';
import { FindManyPostCommentArgs } from 'src/@generated/post-comment/find-many-post-comment.args';
import { PostCommentCreateInput } from 'src/@generated/post-comment/post-comment-create.input';
import { PostCommentUpdateInput } from 'src/@generated/post-comment/post-comment-update.input';
import { PostCommentWhereUniqueInput } from 'src/@generated/post-comment/post-comment-where-unique.input';
import { PostComment } from 'src/@generated/post-comment/post-comment.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostCommentService {
  constructor(private prisma: PrismaService) {}

  async get(args: FindManyPostCommentArgs, select: any): Promise<PostComment[]> {
    return this.prisma.postComment.findMany({ ...args, ...select });
  }

  async create(data: PostCommentCreateInput): Promise<PostComment> {
    return this.prisma.postComment.create({ data });
  }

  async update(
    data: PostCommentUpdateInput,
    where: PostCommentWhereUniqueInput,
  ): Promise<PostComment> {
    return this.prisma.postComment.update({ data, where });
  }

  async delete(where: PostCommentWhereUniqueInput): Promise<PostComment> {
    return this.prisma.postComment.delete({ where });
  }
}
