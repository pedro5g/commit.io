import { ResetPasswordForm } from "./_components/reset-password-form"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    code: string
    exp: string
  }>
}) {
  const { code, exp } = await searchParams

  return (
    <main className="w-full max-w-[25rem]">
      <ResetPasswordForm code={code} exp={exp} />
    </main>
  )
}
