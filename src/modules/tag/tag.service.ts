import { Injectable } from '@nestjs/common';
import { FindManyTagArgs } from 'src/@generated/tag/find-many-tag.args';
import { TagCreateInput } from 'src/@generated/tag/tag-create.input';
import { TagUpdateInput } from 'src/@generated/tag/tag-update.input';
import { TagWhereUniqueInput } from 'src/@generated/tag/tag-where-unique.input';
import { Tag } from 'src/@generated/tag/tag.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async get(args: FindManyTagArgs, select: any): Promise<Tag[]> {
    return this.prisma.tag.findMany({ ...args, ...select });
  }

  async create(data: TagCreateInput): Promise<Tag> {
    return this.prisma.tag.create({ data });
  }

  async update(data: TagUpdateInput, where: TagWhereUniqueInput): Promise<Tag> {
    return this.prisma.tag.update({ data, where });
  }

  async delete(where: TagWhereUniqueInput): Promise<Tag> {
    return this.prisma.tag.delete({ where });
  }
}
