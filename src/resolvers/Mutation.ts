/** @format */

import { Context } from '..';

interface PostCreateArgs {
  title: string;
  content: string;
}

export const Mutation = {
  postCreate: async (
    _parent: any,
    { title, content }: PostCreateArgs,
    { prisma }: Context
  ) => {
    await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: 1,
      },
    });
  },
};
