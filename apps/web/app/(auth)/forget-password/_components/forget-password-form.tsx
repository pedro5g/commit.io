"use client"

import { State } from "@/@types"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { ServerLoaderButton } from "@/components/ui/server-loader-button"
import { ForgetPasswordSchemaType } from "@/schemas/auth-schemas"
import { ArrowRight, MailCheckIcon } from "lucide-react"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { forgetPasswordAction } from "../_actions/forget-password-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ForgetPasswordFormProps {
  email: string
}

export const ForgetPasswordForm = ({ email }: ForgetPasswordFormProps) => {
  const initialState: State<ForgetPasswordSchemaType> = {
    message: "",
    defaultValues: {
      email,
    },
    success: false,
    errors: {},
  }
  const router = useRouter()
  const [state, dispatch] = useActionState(forgetPasswordAction, initialState)

  useEffect(() => {
    if (!state.success && state.message) {
      switch (state.message) {
        case "ACCOUNT_NOT_FOUND":
          toast.error(
            "It looks like you don't have an account yet, please sign up",
            {
              action: {
                label: "Go to sign up",
                onClick: () => router.push("/sign-up"),
              },
            },
          )
          break
        case "CONFIRM_EMAIL":
          toast.error(
            "Ooh, It looks like you haven't confirmed your account yet",
          )
          router.replace("/email-confirmation")
          break
        default:
          toast.error(state.message)
      }
    }
  }, [state, router])

  return !state?.success ? (
    <div className="size-full rounded-md p-5">
      <h1 className="text-center text-xl font-bold sm:text-2xl md:text-3xl">
        Commit.io{"</>"}
      </h1>
      <h2
        className="mb-1.5 mt-8 text-center text-base font-bold tracking-[-0.16px] sm:text-left
        sm:text-xl dark:text-[#fcfdffef]"
      >
        Reset password
      </h2>
      <p className="mb-6 text-center text-sm font-normal sm:text-left sm:text-base dark:text-[#f1f7feb5]">
        Include the email address associated with your account and we’ll send
        you an email with instructions to reset your password.
      </p>
      <form className="flex flex-col gap-6" action={dispatch}>
        <div className="grid gap-2">
          <FormField
            id="email"
            name="email"
            label="Email"
            type="email"
            error={!!state.errors?.email}
            defaultValue={state.defaultValues.email}
            errors={state.errors?.email}
          />
          <Link
            className="ml-auto inline-block text-xs underline-offset-4 hover:underline sm:text-sm"
            href="/login"
          >
            Did you remember your account?
          </Link>
        </div>
        <ServerLoaderButton>Send reset instructions</ServerLoaderButton>
      </form>
    </div>
  ) : (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-2 rounded-md">
      <div className="size-[48px]">
        <MailCheckIcon size="48px" className="animate-bounce" />
      </div>
      <h2 className="text-lg  font-bold tracking-[-0.16px] sm:text-xl dark:text-[#fcfdffef]">
        Check your email
      </h2>
      <p className="text-muted-foreground mb-2 text-center text-sm font-normal dark:text-[#f1f7feb5]">
        We just sent a password reset link to {state.defaultValues.email}.
      </p>
      <Link href="/login">
        <Button className="h-[40px] cursor-pointer">
          Go to login
          <ArrowRight />
        </Button>
      </Link>
    </div>
  )
}
