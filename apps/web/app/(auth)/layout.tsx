export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className="before:backdrop-blur-xs relative flex min-h-svh w-full items-center justify-center 
    p-5 before:absolute before:inset-0 before:-z-10 before:bg-[url('/auth-background.jpeg')] before:bg-center
    before:opacity-15 md:p-20 before:md:bg-cover"
    >
      {children}
    </div>
  )
}
