/** @format */

import { Context } from '..';
import { userLoader } from '../loaders/UserLoader';

interface PostParentType {
  authorId: number;
}

export const Post = {
  //Query to fetch self details
  user: async (parent: PostParentType, __: any, { prisma }: Context) => {
    return userLoader.load(parent.authorId);
  },
};
