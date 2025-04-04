"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { registerAction } from "../_actions/register"
import { State } from "@/@types"
import { RegisterSchemaType } from "@/schemas/auth-schemas"
import { ServerLoaderButton } from "@/components/ui/server-loader-button"
import { FormField } from "@/components/ui/form-field"
import { AlertCircle } from "lucide-react"
import { useActionState } from "react"

const initialState: State<RegisterSchemaType> = {
  message: "",
  errors: {},
  defaultValues: {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
}
export function SignUpForm() {
  const [state, dispatch] = useActionState(registerAction, initialState)

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Sign Up commit.oi {"</>"}
          </CardTitle>
          <CardDescription>Join in the best dev social media</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <FormField
                  id="name"
                  name="userName"
                  label="User name"
                  type="text"
                  error={!!state.errors?.userName}
                  defaultValue={state.defaultValues.userName}
                  errors={state.errors?.userName}
                />
              </div>
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
              {!state.errors && state.message && (
                <p className="mt-2 inline-flex gap-2 text-xs tracking-tighter text-red-500">
                  <AlertCircle className=" size-4" /> {state.message}
                </p>
              )}
              <ServerLoaderButton>Sing up</ServerLoaderButton>
              <Button variant="outline" className="w-full" disabled>
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-xs md:text-sm">
              Do you have an account? Go to{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
