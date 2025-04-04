"use client"

import { State } from "@/@types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { LoginSchemaType } from "@/schemas/auth-schemas"
import Link from "next/link"
import { useActionState } from "react"
import { loginAction } from "../_actions/login-action"
import { AlertCircle } from "lucide-react"
import { ServerLoaderButton } from "@/components/ui/server-loader-button"

const initialState: State<LoginSchemaType> = {
  message: "",
  errors: {},
  defaultValues: {
    email: "",
    password: "",
  },
}

export function LoginForm() {
  const [state, dispatch] = useActionState(loginAction, initialState)
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Login in commit.oi {"</>"}
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch}>
            <div className="flex flex-col gap-4">
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
              </div>
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
                <Link
                  href={
                    state.defaultValues.email
                      ? `/forget-password?email=${state.defaultValues.email}`
                      : `/forget-password`
                  }
                  className="ml-auto inline-block text-xs underline-offset-4 hover:underline sm:text-sm"
                >
                  Forgot your password?
                </Link>
              </div>
              {!state.errors && state.message && (
                <p className="mt-2 inline-flex gap-2 text-xs tracking-tighter text-red-500">
                  <AlertCircle className=" size-4" /> {state.message}
                </p>
              )}
              <ServerLoaderButton>Login</ServerLoaderButton>
              <Button variant="outline" className="w-full" disabled>
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-xs md:text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
