
import { cn } from "@/lib/utils";

type Badge = {
  key: string;
  name: string;
  desc: string;
  unlocked: boolean;
  icon: string;
};

const allBadges: Badge[] = [
  {
    key: "streak-3",
    name: "3-Day Streak",
    desc: "Completed tests 3 days in a row",
    unlocked: false,
    icon: "🥉",
  },
  {
    key: "streak-7",
    name: "7-Day Streak",
    desc: "Completed tests a week straight",
    unlocked: false,
    icon: "🥈",
  },
  {
    key: "questions-50",
    name: "Solved 50 Questions",
    desc: "Practice builds mastery.",
    unlocked: false,
    icon: "🏅",
  },
  {
    key: "questions-200",
    name: "Solved 200 Questions",
    desc: "Persistence! Great job.",
    unlocked: false,
    icon: "🏆",
  },
  {
    key: "streak-30",
    name: "30-Day Streak",
    desc: "Legendary commitment!",
    unlocked: false,
    icon: "👑",
  },
];

type Props = {
  unlocked: string[];
};

export default function AchievementBadges({ unlocked }: Props) {
  return (
    <div>
      <h4 className="font-semibold text-base mb-2 text-muted-foreground">Badges</h4>
      <div className="flex flex-row flex-wrap gap-3 items-center">
        {allBadges.map((badge) => {
          const isUnlocked = unlocked.includes(badge.key);
          return (
            <div
              key={badge.key}
              className={cn(
                "flex flex-col items-center rounded-xl px-3 py-2 min-w-[90px] transition-all duration-300 border",
                isUnlocked
                  ? "bg-gradient-to-t from-green-200 to-green-100 border-green-400 shadow"
                  : "bg-muted border-muted"
              )}
            >
              <span
                className={cn(
                  "text-3xl mb-1",
                  isUnlocked ? "opacity-100" : "opacity-50 grayscale"
                )}
              >
                {badge.icon}
              </span>
              <span
                className={cn(
                  "font-semibold text-xs text-center",
                  isUnlocked ? "text-green-700" : "text-muted-foreground"
                )}
              >
                {badge.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
