import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { signToken } from "../../utils/jwt";

const publicUser = { id: true, name: true, email: true, role: true } as const;

export async function signup(data: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(409, "Email is already registered");

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
    },
    select: publicUser,
  });

  return { user, token: signToken({ sub: user.id, role: user.role }) };
}

export async function login(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  const valid = user && (await bcrypt.compare(data.password, user.password));
  if (!user || !valid) throw new AppError(401, "Invalid email or password");

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: signToken({ sub: user.id, role: user.role }),
  };
}