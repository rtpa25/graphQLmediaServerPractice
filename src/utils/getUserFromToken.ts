/** @format */

import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const getUserFromToken = async (token: string) => {
  try {
    const tr = await jwt.verify(token, process.env.JWT_SIGN as string);
    return tr;
  } catch (error: any) {
    return null;
  }
};
