import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"; // Store this in .env

export const signJwt = (payload: object) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" }); // Token valid for 7 days
};
