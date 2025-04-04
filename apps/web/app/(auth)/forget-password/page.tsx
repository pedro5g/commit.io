import { ForgetPasswordForm } from "./_components/forget-password-form"

export default async function ForgetPassword({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>
}) {
  const { email } = await searchParams

  return (
    <main className="w-full max-w-3xl">
      <ForgetPasswordForm email={email || ""} />
    </main>
  )
}
