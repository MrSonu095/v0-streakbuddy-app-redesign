'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Copy, QrCode, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

/**
 * Payment details — swap these with your own.
 * UPI_ID is where payments are collected. WHATSAPP_NUMBER is the support line.
 */
const UPI_ID = '8967928897@kotakbank'
const PAYEE_NAME = 'StreakBuddy'
const WHATSAPP_NUMBER = '918967928897' // +91 8967928897

type PaymentMethod = 'upi' | 'qr'

type PaymentModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  planName: string
  amount: string // e.g. "$2.49"
}

export function PaymentModal({ open, onOpenChange, planName, amount }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('upi')
  const [copied, setCopied] = useState(false)

  // Numeric amount for the UPI deep link (strip the currency symbol).
  const numericAmount = amount.replace(/[^0-9.]/g, '')
  const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    PAYEE_NAME,
  )}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(`StreakBuddy ${planName}`)}`

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I've paid ${amount} for the StreakBuddy ${planName} plan. Here is my payment confirmation:`,
  )}`

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard not available — ignore
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Complete your payment</DialogTitle>
          <DialogDescription className="text-sm">
            {planName} plan ·{' '}
            <span className="font-semibold text-foreground">{amount}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Method tabs */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-secondary/60 p-1">
          <button
            onClick={() => setMethod('upi')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all',
              method === 'upi'
                ? 'bg-brand-gradient text-primary-foreground shadow-sm'
                : 'text-muted-foreground',
            )}
          >
            <Smartphone className="size-4" />
            UPI
          </button>
          <button
            onClick={() => setMethod('qr')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all',
              method === 'qr'
                ? 'bg-brand-gradient text-primary-foreground shadow-sm'
                : 'text-muted-foreground',
            )}
          >
            <QrCode className="size-4" />
            QR Code
          </button>
        </div>

        {/* UPI option */}
        {method === 'upi' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
              <div>
                <p className="text-xs text-muted-foreground">Pay to UPI ID</p>
                <p className="text-sm font-semibold text-foreground">{UPI_ID}</p>
              </div>
              <button
                onClick={copyUpi}
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary/70"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <a
              href={upiUri}
              className="w-full rounded-2xl bg-brand-gradient py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.99]"
            >
              Pay {amount} with UPI app
            </a>
          </div>
        )}

        {/* QR option */}
        {method === 'qr' && (
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
              <QRCodeSVG value={upiUri} size={180} level="M" />
            </div>
            <p className="text-pretty text-center text-xs text-muted-foreground">
              Scan with any UPI app (GPay, PhonePe, Paytm) to pay{' '}
              <span className="font-semibold text-foreground">{amount}</span>
            </p>
          </div>
        )}

        {/* Confirmation via WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-2xl border border-border bg-card py-3 text-center text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary/60"
        >
          Send payment proof on WhatsApp
        </a>
      </DialogContent>
    </Dialog>
  )
}
