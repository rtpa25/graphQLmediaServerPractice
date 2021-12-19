/** @format */

import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    me: User
    posts: [Post!]!
    profile(userId: ID!): Profile
  }
  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postID: ID!, post: PostInput!): PostPayload!
    postDelete(postID: ID!): PostPayload!
    postPublish(postID: ID!): PostPayload!
    postUnpublish(postID: ID!): PostPayload!
    signUp(
      credentials: CredentialInput!
      name: String!
      bio: String!
    ): AuthPayload!
    signin(credentials: CredentialInput!): AuthPayload!
  }
  input CredentialInput {
    email: String!
    password: String!
  }
  input PostInput {
    title: String
    content: String
  }
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }
  type Profile {
    id: ID!
    bio: String!
    user: User!
  }
  type UserError {
    message: String!
  }
  type PostPayload {
    userErrors: [UserError]
    post: Post
  }
  type AuthPayload {
    userErrors: [UserError]
    token: String!
  }
`;
