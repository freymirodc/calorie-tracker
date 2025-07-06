'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { MobileLayout } from '@/components/mobile/mobile-layout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardNav />
        <main className="container mx-auto px-4 py-8">
          <MobileLayout>
            {children}
          </MobileLayout>
        </main>
      </div>
    </ProtectedRoute>
  )
}
