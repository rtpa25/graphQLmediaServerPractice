/** @format */

import { Context } from '..';

export const Query = {
  //Query to fetch self details
  me: async (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;
    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },

  //query to fetch user profile
  profile: async (
    _: any,
    { userId }: { userId: string },
    { prisma, userInfo }: Context
  ) => {
    return prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });
  },

  //query to fetch posts
  posts: async (_: any, __: any, { prisma }: Context) => {
    const posts = await prisma.post.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    return posts;
  },
};
