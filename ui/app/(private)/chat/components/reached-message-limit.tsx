'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { getLimits, getSubscription } from '@/http/api-client'
import type { Limits, Subscription } from '@/http/schemas'
import dayjs from 'dayjs'
import { SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ReachedMessageLimitAlertProps {
  hasReachedLimit: boolean;
}

export function ReachedMessageLimitAlert({ hasReachedLimit }: ReachedMessageLimitAlertProps) {
  const [limits, setLimits] = useState<Limits | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isOverLimit, setIsOverLimit] = useState(hasReachedLimit)

  useEffect(() => {
    setIsOverLimit(hasReachedLimit)

    if (!hasReachedLimit) {
      getLimits().then(setLimits)
      getSubscription().then(setSubscription)
    }
  }, [hasReachedLimit])

  useEffect(() => {
    if (limits && subscription) {
      const limitExceeded = limits.resetAt !== null && dayjs(limits.resetAt).isAfter(dayjs())
      setIsOverLimit(limitExceeded || hasReachedLimit)
    }
  }, [limits, subscription, hasReachedLimit])

  if (!isOverLimit) return null

  return (
    <Alert className="mb-2 flex flex-col sm:flex-row items-center gap-2 p-6 max-w-2xl mx-auto">
      <div className="flex flex-col">
        <AlertTitle className="font-bold">
          Você chegou ao seu limite de uso do ACME.
        </AlertTitle>
        <AlertDescription>
          Faça o upgrade do seu plano ou tente novamente após{' '}
          {dayjs(limits?.resetAt ?? new Date()).format('HH:mm')}.
        </AlertDescription>
      </div>

      {subscription?.product.monthlyPrice === 0 && (
        <Button asChild className="ml-auto w-full sm:w-fit">
          <Link href="/plans">
            <SparklesIcon className="ml-2 h-4 w-4" />
            Fazer Upgrade
          </Link>
        </Button>
      )}
    </Alert>
  )
}
