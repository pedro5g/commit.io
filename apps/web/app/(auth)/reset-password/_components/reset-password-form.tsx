"use client"

import { State } from "@/@types"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { ServerLoaderButton } from "@/components/ui/server-loader-button"
import { ResetPasswordSchemaType } from "@/schemas/auth-schemas"
import { ArrowLeft, Frown } from "lucide-react"
import Link from "next/link"
import { useActionState } from "react"
import { resetPasswordAction } from "../_actions/reset-password-action"

interface ResetPasswordFormProps {
  code: string
  exp: string | number
}

export const ResetPasswordForm = ({ code, exp }: ResetPasswordFormProps) => {
  const initialState: State<ResetPasswordSchemaType> = {
    message: "",
    defaultValues: {
      password: "",
      confirmPassword: "",
      code,
    },
    errors: {},
  }
  const [state, dispatch] = useActionState(resetPasswordAction, initialState)

  const now = Date.now()
  const isValid = code && exp && Number(exp) > now

  return isValid ? (
    <div className="size-full rounded-md p-5">
      <h1 className="text-center text-xl font-bold sm:text-2xl md:text-3xl">
        Commit.io {"</>"}
      </h1>
      <h1
        className="mb-1.5 mt-8 text-center text-xl font-bold tracking-[-0.16px]
        sm:text-left dark:text-[#fcfdffef]"
      >
        Set up a new password
      </h1>
      <p className="mb-6 text-center text-[15px] font-normal sm:text-left dark:text-[#f1f7feb5]">
        Your password must be different from your previous one.
      </p>

      <form action={dispatch} className="flex flex-col gap-6">
        <div className="grid gap-2">
          <FormField
            id="password"
            name="password"
            label="Password"
            placeholder="••••••••••••"
            type="password"
            error={!!state.errors?.password}
            defaultValue={state.defaultValues.password}
            errors={state.errors?.password}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            placeholder="••••••••••••"
            type="password"
            error={!!state.errors?.confirmPassword}
            defaultValue={state.defaultValues.confirmPassword}
            errors={state.errors?.confirmPassword}
          />
        </div>

        <ServerLoaderButton>Update password</ServerLoaderButton>
      </form>
    </div>
  ) : (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-2 rounded-md">
      <div className="size-[48px]">
        <Frown size="48px" className="animate-bounce text-red-500" />
      </div>
      <h2 className="text-xl font-bold tracking-[-0.16px] dark:text-[#fcfdffef]">
        Invalid or expired reset link
      </h2>
      <p className="text-muted-foreground mb-2 text-center text-sm font-normal dark:text-[#f1f7feb5]">
        You can request a new password reset link
      </p>
      <Link href="/forget-password">
        <Button className="h-[40px] cursor-pointer">
          <ArrowLeft />
          Go to forget password
        </Button>
      </Link>
    </div>
  )
}
