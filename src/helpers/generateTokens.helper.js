import jwt from "jsonwebtoken";

export const generateTokens = async (userId) => {
  try {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};
