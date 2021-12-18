/** @format */

import { Post } from '@prisma/client';
import { Context } from '..';

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors:
    | {
        message: string;
      }[]
    | null;
  post: Post | null;
}

export const Mutation = {
  //MUTATION TO CREATE POST
  postCreate: async (
    _parent: any,
    { post }: PostArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    //this checks the case of error by user
    if (!post.title || !post.content) {
      return {
        userErrors: [
          {
            message: 'You must provide a title and content to the post',
          },
        ],
        post: null,
      };
    }
    //create post with help of prisma
    const createdPost = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: 1,
      },
    });
    //return the user response
    return {
      userErrors: [
        {
          message: 'success',
        },
      ],
      post: createdPost,
    };
  },
  //MUTATION TO UPDATE POST
  postUpdate: async (
    _parent: any,
    { post, postID }: { postID: string; post: PostArgs['post'] },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    //if no title or content provided then throw error as no purpose of update req
    if (!post.title && !post.content) {
      return {
        userErrors: [{ message: 'need to have atlseas one meesage' }],
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

    //update the post in the db with new data
    const updatedPost = await prisma.post.update({
      where: {
        id: Number(postID),
      },
      data: {
        title: post.title,
        content: post.content,
      },
    });

    //return the updatedPost
    return {
      userErrors: null,
      post: updatedPost,
    };
  },
  //MUTATION TO DELETE POST
  postDelete: async (
    _parent: any,
    { postID }: { postID: string },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
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

    await prisma.post.delete({
      where: {
        id: Number(postID),
      },
    });

    return {
      userErrors: null,
      post: existingPost,
    };
  },
};
