'use client'

import { Check, Copy } from 'lucide-react'
import { useCallback, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface PromptCopyProps {
  title: string
  prompt: string
}

export function PromptCopy({ title, prompt }: PromptCopyProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [prompt])

  return (
    <Popover>
      <PopoverTrigger
        onClick={handleCopy}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm transition-colors hover:bg-muted"
      >
        {copied ? (
          <>
            <Check className="size-3.5" />
            已复制
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            {title}
          </>
        )}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-[480px] p-0">
        <div className="border-b px-3 py-2">
          <span className="font-medium text-sm">{title}</span>
          <span className="ml-2 text-muted-foreground text-xs">
            点击按钮复制
          </span>
        </div>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap p-3 font-mono text-xs leading-relaxed">
          {prompt}
        </pre>
      </PopoverContent>
    </Popover>
  )
}
