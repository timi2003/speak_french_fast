"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface LoginActivity {
  id: string
  ip_address: string
  device_info: string
  login_time: string
  is_suspicious: boolean
}

export default function LoginActivityMonitor() {
  const [activities, setActivities] = useState<LoginActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/security/login-activity")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error("Failed to fetch login activity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Activity</CardTitle>
        <CardDescription>Recent login attempts to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No login activity</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  activity.is_suspicious ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                {activity.is_suspicious && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900 truncate">{activity.device_info}</p>
                    {activity.is_suspicious && (
                      <Badge variant="destructive" className="text-xs">
                        Suspicious
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.ip_address}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(activity.login_time).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
