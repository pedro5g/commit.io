import { useFormStatus } from "react-dom"
import { Button } from "./button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServerLoaderButtonProps {
  children: React.ReactNode
  className?: string
}

export const ServerLoaderButton = ({
  children,
  className,
}: ServerLoaderButtonProps) => {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={cn(
        "w-full cursor-pointer bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-500/90",
        className,
      )}
    >
      {children}
      {pending && <Loader2 className="ml-2 size-5 animate-spin" />}
    </Button>
  )
}
