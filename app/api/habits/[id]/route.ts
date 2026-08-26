import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (typeof body?.isCompleted !== 'boolean') {
    return NextResponse.json({ error: 'isCompleted must be a boolean' }, { status: 400 })
  }

  const habit = await prisma.habit.findFirst({ where: { id, userId } })
  if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 })

  const updatedHabit = await prisma.habit.update({
    where: { id },
    data: { isCompleted: body.isCompleted },
  })

  return NextResponse.json(updatedHabit)
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const result = await prisma.habit.deleteMany({ where: { id, userId } })
  if (result.count === 0) return NextResponse.json({ error: 'Habit not found' }, { status: 404 })

  return new NextResponse(null, { status: 204 })
}
