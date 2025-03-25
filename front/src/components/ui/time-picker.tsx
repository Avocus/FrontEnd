"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  date: Date
  setDate: (date: Date) => void
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)

  const hours = date.getHours()
  const minutes = date.getMinutes()

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    const newHour = isNaN(value) ? 0 : Math.max(0, Math.min(23, value))
    const newDate = new Date(date)
    newDate.setHours(newHour)
    setDate(newDate)

    if (value >= 0 && value <= 23) {
      minuteRef.current?.focus()
    }
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    const newMinute = isNaN(value) ? 0 : Math.max(0, Math.min(59, value))
    const newDate = new Date(date)
    newDate.setMinutes(newMinute)
    setDate(newDate)
  }

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Horas
        </Label>
        <Input
          ref={hourRef}
          id="hours"
          className="w-16 text-center"
          value={hours.toString().padStart(2, "0")}
          onChange={handleHourChange}
          type="number"
          min={0}
          max={23}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutos
        </Label>
        <Input
          ref={minuteRef}
          id="minutes"
          className="w-16 text-center"
          value={minutes.toString().padStart(2, "0")}
          onChange={handleMinuteChange}
          type="number"
          min={0}
          max={59}
        />
      </div>
      <Clock className="h-4 w-4 text-muted-foreground" />
    </div>
  )
} 