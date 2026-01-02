'use client'

import { Message } from '@/http/schemas'
import { useEffect, useRef } from 'react'

interface ChatMessagesScrollToBottomProps {
    messages: Message[]
}

export function ChatMessagesScrollToBottom({ messages }: ChatMessagesScrollToBottomProps) {
    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    // When user sends a new message, scroll to bottom
    useEffect(() => {
        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length])

    return <div ref={scrollToBottomRef} />
}
