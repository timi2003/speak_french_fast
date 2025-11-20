"use client"

import { useEffect } from "react"
import { Clock, AlertTriangle } from "lucide-react"

interface ListeningTimerProps {
  timeLeft: number
  onTimeUp: () => void
  setTimeLeft: (time: number) => void
}

export default function ListeningTimer({ timeLeft, onTimeUp, setTimeLeft }: ListeningTimerProps) {
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp, setTimeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isWarning = timeLeft < 300 // Warning when less than 5 minutes

  return (
    <div className={`sticky top-0 z-50 border-b ${isWarning ? "bg-red-50" : "bg-background"}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold">Listening Comprehension - 25 min</h2>
        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${isWarning ? "text-red-600" : ""}`}>
          {isWarning && <AlertTriangle className="w-5 h-5 text-red-600" />}
          <Clock className="w-5 h-5" />
          <span>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}
