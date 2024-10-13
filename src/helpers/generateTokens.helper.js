import jwt from "jsonwebtoken";

export const generateTokens = async (userId) => {
  console.log("Generating Tokens ...");
  try {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("Generated Tokens: ", accessToken, refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};
