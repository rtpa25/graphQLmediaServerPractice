/** @format */

import { Context } from '../..';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signUp: async (
    _: any,
    { credentials, bio, name }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    //ecxtract the email and password
    const { email, password } = credentials;
    //check the validity of the email
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        token: null,
        userErrors: [
          {
            message: 'Invalid Email',
          },
        ],
      };
    }

    //check the validity of the password
    const isValidPassword = validator.isLength(password, {
      min: 5,
    });
    if (!isValidPassword) {
      return {
        token: null,
        userErrors: [
          {
            message: 'Invalid Email',
          },
        ],
      };
    }

    //check for the name and bio
    if (!name || !bio) {
      return {
        token: null,
        userErrors: [
          {
            message: 'Invalid Name and Bio',
          },
        ],
      };
    }

    //HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });

    //create a profile
    const profile = await prisma.profile.create({
      data: {
        bio: bio,
        userId: user.id,
      },
    });

    //CREATE A JWT
    const token = await jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SIGN as string,
      {
        expiresIn: '3d',
      }
    );

    return {
      token: token,
      userErrors: [
        {
          message: 'sucess',
        },
      ],
    };
  },
  signin: async (
    _: any,
    { credentials }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;

    //FIND THE USER IN THE DB WITH THE PROVIDED EMAIL
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return {
        token: null,
        userErrors: [
          {
            message: 'Invalid credentials',
          },
        ],
      };
    }

    //CHECK IS THE PASSWORD IS VALID
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        token: null,
        userErrors: [
          {
            message: 'Invalid credentials',
          },
        ],
      };
    }
    //CREATE A JWT
    const token = await jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SIGN as string,
      {
        expiresIn: '3d',
      }
    );
    //RETURN THE RESPONSE
    return {
      token: token,
      userErrors: [
        {
          message: 'sucess',
        },
      ],
    };
  },
};
