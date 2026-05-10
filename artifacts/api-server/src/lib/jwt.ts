import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"];

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export function signToken(payload: { userId: string }): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as { userId: string };
  } catch {
    return null;
  }
}
