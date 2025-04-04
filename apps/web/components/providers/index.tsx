"use client"

import React from "react"
import { Toaster } from "../ui/sonner"

export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
