"use client"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { confirmAction } from "../_actions/confirm"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ConfirmAccountProps {
  code: string
}

export const ConfirmAccount = ({ code }: ConfirmAccountProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const submitAction = async () => {
    startTransition(async () => {
      const { success, message } = await confirmAction(code)
      if (success) {
        toast.success(message)
        router.push("/login")
        return
      }

      toast(message)
    })
  }

  return (
    <main className=" ring-3 flex size-full max-w-full items-center justify-center rounded-md bg-zinc-900 opacity-75 ring-gray-500 backdrop-blur-md">
      <div className="size-full rounded-md p-5">
        <h1 className="text-center text-xl font-bold sm:text-2xl md:text-3xl">
          Commit.io {"</>"}
        </h1>
        <h1
          className="mb-4 mt-8 text-center text-lg font-bold tracking-[-0.16px] sm:text-left
        md:text-xl dark:text-[#fcfdffef]"
        >
          Account confirmation
        </h1>
        <p className="mb-6 text-center text-[15px] font-normal sm:text-left dark:text-[#f1f7feb5]">
          To confirm your account, please follow the button below.
        </p>

        <Button
          onClick={submitAction}
          disabled={isPending}
          type="submit"
          variant="secondary"
          className=" h-[40px] w-full cursor-pointer text-[15px] font-semibold text-white"
        >
          {isPending && <Loader className="animate-spin" />}
          Confirm account
        </Button>

        <p className="text-muted-foreground mt-6 text-sm font-normal dark:text-[#f1f7feb5]">
          If you have any issue confirming your account please, contact{" "}
          <a
            className="text-primary focus-visible:ring-primary outline-none 
            transition duration-150 ease-in-out hover:underline focus-visible:ring-2"
            href="#"
          >
            pedro.env5@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  )
}
