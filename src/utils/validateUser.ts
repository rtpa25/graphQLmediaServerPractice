/** @format */

import { Context } from '..';

export const validation = async (
  { postID }: { postID: string },
  { prisma, userInfo }: Context
) => {
  //CHECK IF THE USER IS AUTHENTICATED
  if (userInfo === null) {
    return {
      userErrors: [
        {
          message: 'Unauthenticated User Forbidden Acess',
        },
      ],
      post: null,
    };
  }
  //find the existing post in db and throw error if not found
  const existingPost = await prisma.post.findUnique({
    where: {
      id: Number(postID),
    },
  });

  if (!existingPost) {
    return {
      userErrors: [{ message: 'post does not exist' }],
      post: null,
    };
  }

  //CHECK IF THE USER WHO IS TRYING TO UPDATE IS SAME AS THE CREATOR
  const isUserSame = existingPost?.authorId === userInfo.userId;
  if (!isUserSame) {
    return {
      userErrors: [
        {
          message: 'Forbidden Acess',
        },
      ],
      post: null,
    };
  }

  return existingPost;
};
