"use server";

import { prisma } from './db'; // <-- Brackets add kiye hain taaki error na aaye
import { auth, currentUser } from '@clerk/nextjs/server';

export async function syncUserToDatabase() {
  const { userId } = await auth();
  if (!userId) return null;

  let dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`;

    dbUser = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        level: 1,
        xp: 0,
      },
    });
  }

  return dbUser;
}