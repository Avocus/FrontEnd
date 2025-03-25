"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export interface EventType {
  date: Date
  time?: string
}

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  events?: EventType[]
}

interface DayContentProps {
  date: Date
  displayMonth?: Date
  activeModifiers?: Record<string, boolean>
  className?: string
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  events = [],
  ...props
}: CalendarProps) {
  const eventDays = events.map(event => 
    event.date.toISOString().split('T')[0]
  )

  const modifiers = {
    event: (date: Date) => 
      eventDays.includes(date.toISOString().split('T')[0])
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      event.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    )
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-full p-3 [&_.rdp-day_button.event]:relative [&_.rdp-day_button.event]:after:content-[''] [&_.rdp-day_button.event]:after:absolute [&_.rdp-day_button.event]:after:bottom-1 [&_.rdp-day_button.event]:after:left-1/2 [&_.rdp-day_button.event]:after:-translate-x-1/2 [&_.rdp-day_button.event]:after:w-1 [&_.rdp-day_button.event]:after:h-1 [&_.rdp-day_button.event]:after:rounded-full [&_.rdp-day_button.event]:after:bg-secondary", className)}
      modifiers={modifiers}
      modifiersClassNames={{
        event: "event"
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
        DayContent: ({ date, displayMonth, activeModifiers, className }: DayContentProps) => {
          const dayEvents = getEventsForDay(date)
          return (
            <div className="relative w-full h-full">
              <div className={className}>
                {date.getDate()}
              </div>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <div className="text-[0.6rem] text-muted-foreground">
                    {dayEvents.map(event => event.time).filter(Boolean).join(', ')}
                  </div>
                </div>
              )}
            </div>
          )
        }
      }}
      classNames={{
        months: "flex flex-col w-full sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative w-full h-9 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-full p-0 font-normal aria-selected:opacity-100 relative"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-accent hover:bg-accent text-accent-foreground aria-selected:border-2 aria-selected:border-primary",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
