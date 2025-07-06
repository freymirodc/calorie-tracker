'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Target, TrendingUp } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Calorie Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your weekly calorie intake, set goals, and maintain a healthy lifestyle with smart calorie distribution.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <CalendarDays className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Daily Tracking</CardTitle>
              <CardDescription>
                Log your daily calorie intake with ease and track your progress over time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Smart Goals</CardTitle>
              <CardDescription>
                Set weekly calorie targets and let our app distribute remaining calories across upcoming days.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Progress Insights</CardTitle>
              <CardDescription>
                Visualize your progress with charts and get insights into your eating patterns.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Start Tracking?</CardTitle>
            <CardDescription>
              Connect to your Supabase database and begin your calorie tracking journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Make sure to configure your Supabase credentials in the .env.local file
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
