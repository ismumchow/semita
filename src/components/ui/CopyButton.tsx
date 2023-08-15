'use client'

import { cn } from '@/lib/utils'
import { Copy } from 'lucide-react'
import { ButtonHTMLAttributes, FC } from 'react'
import { Button } from '@/components/ui/Button'
import { toast } from "@/hooks/use-toast";

interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  valueToCopy: string
}

const CopyButton: FC<CopyButtonProps> = ({
  valueToCopy,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      type='button'
      onClick={() => {
        navigator.clipboard.writeText(valueToCopy)
        toast({
          title: 'Copied',
          message: 'Link key copied to clipboard',
        })
      }}
      className={cn('', className)}>
      <Copy className='h-5 w-5' />
    </Button>
  )
}

export default CopyButton