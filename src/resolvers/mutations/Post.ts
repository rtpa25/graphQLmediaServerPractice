/** @format */

import { Post } from '@prisma/client';
import { Context } from '../..';
import { validation } from '../../utils/validateUser';

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

export const postResolvers = {
  //MUTATION TO CREATE POST
  postCreate: async (
    _parent: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
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
        authorId: userInfo.userId,
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
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    //if no title or content provided then throw error as no purpose of update req
    if (!post.title && !post.content) {
      return {
        userErrors: [{ message: 'need to have atlseas one meesage' }],
        post: null,
      };
    }
    validation({ postID: postID }, { prisma: prisma, userInfo: userInfo });

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
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    const existingPost = validation(
      { postID: postID },
      { prisma: prisma, userInfo: userInfo }
    );

    //DELETE FROM DB
    await prisma.post.delete({
      where: {
        id: Number(postID),
      },
    });

    return {
      userErrors: null,
      post: existingPost as any,
    };
  },
  //MUTATION TO PUBLISH THE POST
  postPublish: async (
    _parent: any,
    { postID }: { postID: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    validation({ postID: postID }, { prisma: prisma, userInfo: userInfo });

    //update the post in the db with new data
    const updatedPost = await prisma.post.update({
      where: {
        id: Number(postID),
      },
      data: {
        published: true,
      },
    });

    //return the updatedPost
    return {
      userErrors: null,
      post: updatedPost,
    };
  },
  //MUTATION TO UNPUBLISH THE POST
  postUnpublish: async (
    _parent: any,
    { postID }: { postID: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    validation({ postID: postID }, { prisma: prisma, userInfo: userInfo });

    //update the post in the db with new data
    const updatedPost = await prisma.post.update({
      where: {
        id: Number(postID),
      },
      data: {
        published: false,
      },
    });

    //return the updatedPost
    return {
      userErrors: null,
      post: updatedPost,
    };
  },
};
