"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";

export function CustomCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState("month"); // 'day', 'week', 'month'
    const [events, setEvents] = useState<{ date: Date; title: string }[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const addEvent = (date: Date) => {
        const eventTitle = prompt("Enter event title:");
        if (eventTitle) {
            setEvents((prevEvents) => [...prevEvents, { date, title: eventTitle }]);
        }
    };

    const deleteEvent = (eventIndex: number) => {
        setEvents((prevEvents) => prevEvents.filter((_, index) => index !== eventIndex));
    };

    const renderEvents = (date: Date) => {
        return events
            .filter((event) => isSameDay(new Date(event.date), date))
            .map((event, index) => (
                <div key={index} className="p-2 bg-muted rounded-xl flex justify-between">
                    <p className="text-primary font-medium">{event.title}</p>
                    <Button variant="ghost" size="sm" onClick={() => deleteEvent(index)}>
                        Delete
                    </Button>
                </div>
            ));
    };

    const changeViewMode = (mode: string) => {
        setViewMode(mode);
    };

    const renderCalendar = () => {
        if (viewMode === "month") {
            const start = startOfMonth(currentDate);
            const end = endOfMonth(currentDate);
            const days = Array.from({ length: end.getDate() }, (_, i) => addDays(start, i));

            return (
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => (
                        <div
                            key={day.toString()}
                            className="p-2 border rounded-xl flex flex-col items-center cursor-pointer"
                            onClick={() => setSelectedDate(day)}
                        >
                            <span className="text-sm text-muted-foreground">{format(day, "EEE")}</span>
                            <span className="text-lg font-bold text-primary">{format(day, "d")}</span>
                            {renderEvents(day)}
                        </div>
                    ))}
                </div>
            );
        }

        if (viewMode === "week") {
            const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
            const daysOfWeek = Array.from({ length: 7 }, (_, index) => addDays(startOfCurrentWeek, index));

            return (
                <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => (
                        <div
                            key={day.toString()}
                            className="p-2 border rounded-xl flex flex-col items-center cursor-pointer"
                            onClick={() => setSelectedDate(day)}
                        >
                            <span className="text-sm text-muted-foreground">{format(day, "EEE")}</span>
                            <span className="text-lg font-bold text-primary">{format(day, "d")}</span>
                            {renderEvents(day)}
                        </div>
                    ))}
                </div>
            );
        }

        if (viewMode === "day") {
            return (
                <div className="p-4 border rounded-xl">
                    <h3 className="text-lg font-bold text-primary mb-4">{format(selectedDate, "EEEE, MMMM d")}</h3>
                    {renderEvents(selectedDate)}
                    <Button variant="outline" onClick={() => addEvent(selectedDate)} className="mt-4">
                        Add Event
                    </Button>
                </div>
            );
        }
    };

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => changeViewMode("day")}>Day</Button>
                    <Button variant="ghost" onClick={() => changeViewMode("week")}>Week</Button>
                    <Button variant="ghost" onClick={() => changeViewMode("month")}>Month</Button>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Select Date</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <DatePicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (date) setSelectedDate(date);
                                if (date) setCurrentDate(date);
                            }}
                        />
                    </PopoverContent>
                </Popover>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
                        <ChevronLeft />
                    </Button>
                    <h2 className="text-xl font-semibold text-primary">
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <Button variant="ghost" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>
            {renderCalendar()}
        </Card>
    );
}