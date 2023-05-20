'use client'
import React from 'react';
import { SessionProvider,useSession } from "next-auth/react"

const Provider = ({children}:{children:JSX.Element}) => {
  return (
    <SessionProvider >
        {children}
    </SessionProvider>
  )
}

export default Provider