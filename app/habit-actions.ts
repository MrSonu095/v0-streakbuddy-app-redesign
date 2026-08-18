"use server";

import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// 1. Nayi Habit Add Karne Ka Function
export async function addHabitToDB(text: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User logged in nahi hai");

  const newHabit = await prisma.habit.create({
    data: {
      userId: userId,
      title: text,
      streak: 0,
      isCompleted: false,
    }
  });

  return newHabit;
}

// 2. Habit Delete Karne Ka Function
export async function deleteHabitFromDB(id: string) {
  const { userId } = await auth();
  if (!userId) return;

  await prisma.habit.delete({
    where: { 
      id: id,
    },
  });
}

// 3. Habit Ko Tick (Complete) Karne Ka Function
export async function toggleHabitInDB(id: string, currentDone: boolean) {
  const { userId } = await auth();
  if (!userId) return;

  const habit = await prisma.habit.update({
    where: { id: id },
    data: {
      isCompleted: !currentDone,
    }
  });

  return habit;
}

// 4. User Ki Saari Habits Database Se Mangwane Ka Function
export async function getUserHabitsFromDB() {
  const { userId } = await auth();
  if (!userId) return [];

  const habits = await prisma.habit.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'asc' }
  });

  return habits;
}
