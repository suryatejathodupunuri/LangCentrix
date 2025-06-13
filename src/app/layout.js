// app/layout.js or app/layout.tsx
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
