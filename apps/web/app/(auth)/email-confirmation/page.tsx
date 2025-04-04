export default async function EmailConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>
}) {
  const { email } = (await searchParams) || "your email"
  return (
    <main className="flex w-full items-center justify-center">
      <div className="w-full max-w-3xl rounded-md bg-zinc-900 px-5 py-4 text-center opacity-75 ring-gray-500 backdrop-blur-md">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
          Commit.io{"</>"}
        </h1>
        <br />
        <h2 className="text-base font-bold sm:text-xl md:text-2xl">
          ✅ Account Created Successfully!
        </h2>
        <br />
        <p className="text-muted-foreground mt-6 text-sm font-normal dark:text-[#f1f7feb5]">
          Just one more step! We&apos;ve sent a confirmation email to [{email}].
          To activate your account, open the email and click the verification
          link. If you don’t see the email, check your spam folder.
        </p>
        <br />
        <footer>
          <span className="text-muted-foreground mt-6 text-sm font-normal dark:text-[#f1f7feb5]">
            Didn&apos;t receive the email?{" "}
            <a
              className="text-primary focus-visible:ring-primary outline-none 
            transition duration-150 ease-in-out hover:underline focus-visible:ring-2"
              href="#"
            >
              [Resend Confirmation]
            </a>
          </span>
        </footer>
      </div>
    </main>
  )
}
