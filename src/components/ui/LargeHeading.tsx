import { FC } from 'react'
import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'

const headingVariants = cva(
  'text-black dark:text-white text-center lg:text-left leading-tight tracking-tighter font-bold',
  {
    variants: {
      size: {
        tiny: 'text-base md:text-xl lg:text-2xl',
        default: 'text-4xl md:text-5xl lg:text-6xl',
        lg: 'text-5xl md:text-6xl lg:text-7xl',
        sm: 'text-2xl md:text-3xl lg:text-4xl',
        md: 'text-3xl md:text-4xl lg:text-5xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

interface LargeHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

const LargeHeading: FC<LargeHeadingProps> = ({
  children,
  className,
  size,
  ...props
}) => {
  return (
    <h1 {...props} className={cn(headingVariants({ size, className }))}>
      {children}
    </h1>
  )
}

export default LargeHeading