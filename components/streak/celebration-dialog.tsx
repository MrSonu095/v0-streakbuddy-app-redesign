'use client'

import { Trophy } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type CelebrationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CelebrationDialog({ open, onOpenChange }: CelebrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs rounded-3xl text-center">
        <DialogHeader className="items-center">
          <span className="mb-2 flex size-16 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground shadow-lg shadow-primary/25">
            <Trophy className="size-8" />
          </span>
          <DialogTitle className="text-xl font-bold">All done for today!</DialogTitle>
          <DialogDescription className="text-pretty text-sm">
            You completed every habit today. Amazing work — come back tomorrow to keep your streak
            alive!
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={() => onOpenChange(false)}
          className="mt-2 w-full rounded-2xl bg-brand-gradient py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.99]"
        >
          Keep it up
        </button>
      </DialogContent>
    </Dialog>
  )
}
