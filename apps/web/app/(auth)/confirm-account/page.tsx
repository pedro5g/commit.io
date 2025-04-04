import { ConfirmAccount } from "./_components/confirm-account"

export default async function ConfirmAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ code: string }>
}) {
  const { code } = await searchParams

  return (
    <div className="w-full max-w-3xl">
      <ConfirmAccount code={code} />
    </div>
  )
}
