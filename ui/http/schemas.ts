export type Terms = {
  hasAccepted: boolean
}

export type Billing = {
  id: string
  date: string
  status: string | null
  price: number
  downloadUrl: string | null
}

export type Product = {
  id: string
  name: string
  description: string
  image_url: string
  price: {
    id: string
    stripePriceId: string
    type: string
    trialPeriodDays: number
    unitAmount: number
    interval: string
    intervalCount: number
  }
  metadata: {
    benefits: string
    sendMessageLimit: number
    shouldHighlight: boolean
    off: number
  }
}

export type CheckoutSession = {
  id: string
  description: string
  name: string
  benefits: string
  image_url: string
}

export type Plan = {
  id: string
  name: string
  description: string | null
  monthlyPrice: number
  yearlyPrice: number
  dailyMessageLimit: number
  benefits: string[]
}

export type Subscription = {
  id: string
  product: {
    id: string
    name: string
    monthlyPrice: number | null
    metadata: {
      sendMessageLimit: number
      benefits: string
    }
  }
  startsAt: string | null
  endsAt: string | null
  status: string | null
  cancelAtPeriodEnd: boolean
  cancelAt: string | null
  canceledAt: string | null
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
}

export type Limits = {
  used: number
  limit: number
  resetAt: string | null
}

export type Profile = {
  name: string
  email: string
}

export type Attachment = {
  id: string
  filename: string
  mimetype: string
  bytes: number
  createdAt: string
}

export type Message = {
  id: string
  role: string
  text: string
  createdAt: string
  attachments: Attachment[]
}

export type Upload = {
  storage: string
  id: string
  createdAt: string
  userId: string
  file: Attachment
}

export type Thread = {
  id: string
  openaiThreadId: string
  title?: string | null
  createdAt: string
  archivedAt?: string | null
  deletedAt?: string | null
  messages: Message[]
}
