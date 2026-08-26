import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existingUser = await prisma.user.findUnique({ where: { id: userId } })
  if (existingUser) return NextResponse.json(existingUser)

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`
  const dbUser = await prisma.user.create({
    data: { id: userId, email, level: 1, xp: 0 },
  })

  return NextResponse.json(dbUser, { status: 201 })
}
