
import "@/styles/globals.css"
import { Suspense } from "react"
import { Metadata } from "next"
// import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import cx from "classnames"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Nav from "@/components/layout/nav"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider,useSession } from "next-auth/react"
import Provider from "./Provider"


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precedent - Building blocks for your Next.js project",
    description:
      "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
    creator: "@steventey",
  },
  metadataBase: new URL("https://precedent.dev"),
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {

  return (
    <>
      <html lang="en">
  
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        
           <div className="relative flex min-h-screen flex-col">
            <Provider >
              <>
               <SiteHeader />
               {children}
              </>
            </Provider>
             </div>
             <TailwindIndicator />
         </ThemeProvider>
         

          {/* <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
            {children}
          </main> */}
          {/* <Footer /> */}
          <Analytics />
        </body>
      </html>
    </>
  )
}

//  {/* <html lang="en" suppressHydrationWarning>
//     {/* <head /> */}
//     <Suspense fallback="...">
//       {/* @ts-expect-error Server Component */}
//       <Nav />
//     </Suspense>
//     <body
//       className={cn(
//         "min-h-screen bg-background font-sans antialiased",
//         fontSans.variable
//       )}
//     >
//       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//         <div className="relative flex min-h-screen flex-col">
//           <SiteHeader />
//           <div className="flex-1">{children}</div>
//         </div>
//         <TailwindIndicator />
//       </ThemeProvider>
//     </body>
//   </html> */}
