import { useMemo } from "react";

// Updated colors for improved vibrancy and distinction
const cellColors = [
  "bg-muted/30 border border-border",                  // 0
  "bg-green-200",                                      // 1+
  "bg-green-400",                                      // 2+
  "bg-green-500",                                      // 4+
  "bg-green-600",                                      // 6+
];

// Days of week for row labels (Sunday to Saturday)
const dayLabels = [
  { day: "S", key: "sun" },
  { day: "M", key: "mon" },
  { day: "T", key: "tue" },
  { day: "W", key: "wed" },
  { day: "T", key: "thu" },
  { day: "F", key: "fri" },
  { day: "S", key: "sat" }
];

// Helper: get all days in the current month (client-side, local calendar day)
function getDaysInCurrentMonth(): string[] {
  const arr: string[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed month

  const firstDayOfMonth = new Date(year, month, 1); // Start from the 1st of the current month
  const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of the current month

  for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) { // Iterate until the end of the month
    const formattedYear = d.getFullYear();
    const formattedMonth = (d.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = d.getDate().toString().padStart(2, '0');
    arr.push(`${formattedYear}-${formattedMonth}-${formattedDay}`);
  }
  return arr;
}

// Helper: find the longest streak
function getLongestStreak(dates: string[], data: { [date: string]: number }) {
  let maxStreak = 0;
  let curStreak = 0;
  let bestEndIdx = -1;
  for (let i = 0; i < dates.length; i++) {
    if ((data[dates[i]] ?? 0) > 0) {
      curStreak++;
      if (curStreak > maxStreak) {
        maxStreak = curStreak;
        bestEndIdx = i;
      }
    } else {
      curStreak = 0;
    }
  }
  if (maxStreak === 0) return [];
  return Array.from(
    { length: maxStreak },
    (_, i) => dates[bestEndIdx - maxStreak + 1 + i]
  );
}

type StreakHeatmapProps = {
  data: { [date: string]: number };
};

export default function StreakHeatmap({ data }: StreakHeatmapProps) {
  const currentMonthDays = useMemo(() => getDaysInCurrentMonth(), []);
  
  // Calculate the day of the week for the first day of the month to align the grid
  const firstDayOfMonth = new Date(currentMonthDays[0]);
  const startDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Pad the beginning of the first week if it doesn't start on Sunday
  const paddedDates = Array(startDay).fill(null).concat(currentMonthDays);

  // For easier grid: group dates by week (each row = week, 7 days per week)
  const weeks: (string | null)[][] = [];
  let week: (string | null)[] = [];
  for (let i = 0; i < paddedDates.length; i++) {
    week.push(paddedDates[i]);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  // Push any remaining days as the last week, padding with nulls if necessary
  if (week.length > 0) {
    while (week.length < 7) { 
      week.push(null);
    }
    weeks.push(week);
  }

  // Find longest streak for highlight (only within the displayed month's days)
  const streakDates = useMemo(() => getLongestStreak(currentMonthDays, data), [currentMonthDays, data]);
  const streakDatesSet = useMemo(() => new Set(streakDates), [streakDates]);

  const currentMonthName = new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="bg-card/60 p-4 rounded-2xl shadow-lg border border-primary/10 w-full max-w-[410px] mx-auto animate-fade-in">
      <h3 className="text-md font-semibold mb-2 text-primary flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse mr-1" />
        Your {currentMonthName} Activity
      </h3>
      <div className="flex items-start">
        {/* Day labels column */}
        <div className="flex flex-col gap-2 mr-2">
          {dayLabels.map(({ day, key }) => (
            <div 
              key={key} 
              className="h-6 w-6 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Activity grid */}
        <div className="flex gap-2">
          {weeks.map((days, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-2">
              {days.map((date, rowIdx) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${weekIdx}-${rowIdx}`}
                      className="w-6 h-6 rounded-xl opacity-0"
                    />
                  );
                }
                const count = data[date] || 0;
                let colorIndex = 0;
                if (count > 0) colorIndex = 1;
                if (count > 1) colorIndex = 2;
                if (count > 3) colorIndex = 3;
                if (count > 5) colorIndex = 4;
                const inStreak = streakDatesSet.has(date);

                return (
                  <div
                    key={date}
                    className={[
                      "group relative w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow",
                      cellColors[colorIndex],
                      inStreak
                        ? "ring-2 ring-green-500 scale-[1.07] shadow-lg z-10"
                        : "hover:ring-2 hover:ring-primary/50",
                    ].join(" ")}
                  >
                    <span className="sr-only">{date} - {count} questions</span>
                    <span className="absolute z-20 px-3 py-1.5 bg-background/90 border border-primary text-primary rounded-xl text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity select-none -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap drop-shadow shadow-xl">
                      <span className="font-semibold block text-center mb-1">
                        {new Date(date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="text-green-700 font-bold block text-center">
                        {count} solved
                      </span>
                      {inStreak && (
                        <span className="block text-center mt-1 text-green-600 font-semibold">🔥 Streak</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs mt-3 text-muted-foreground text-center">
        Green circles indicate more questions solved.<br />
        <span className="inline-block px-2 mt-1 rounded-full bg-green-500/10 text-green-700 font-semibold">
          {streakDates.length > 1 ? `Longest streak: ${streakDates.length} days` : "Start a streak!"}
        </span>
      </div>
    </div>
  );
}
