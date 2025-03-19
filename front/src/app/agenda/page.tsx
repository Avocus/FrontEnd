// app/agenda/page.tsx

import { CustomCalendar } from "@/components/agenda/calendar";

export default function AgendaPage() {
  return (
    <div className="p-4 md:p-8">
      <CustomCalendar />
    </div>
  );
}