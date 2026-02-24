import { prisma } from "../lib/prisma.js";

export const createUser = async (user) => {
  return await prisma.user.create({ data: user });
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const updateUser = async ({ id, user }) => {
  return await prisma.user.update({ where: { id }, data: user });
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id } });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};
