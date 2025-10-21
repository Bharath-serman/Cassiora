import { useState, useEffect } from "react";
import { useUser } from "@/components/UserContext";
import StreakHeatmap from "@/components/StreakHeatmap";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";

// New interface for the activity log
interface ActivityLog {
  _id: string;
  date: string;
  type: 'test' | 'streak';
  details: string;
  topic?: string;
  score?: number;
  totalQuestions?: number;
}

// Fetch activity data from MongoDB
async function fetchActivity(token: string): Promise<ActivityLog[]> {
  try {
    const res = await fetch(`http://localhost:3001/api/activity`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch activity');
    const data = await res.json();
    // The API now returns an array of activity logs
    return data.logs || [];
  } catch (err) {
    console.error('Failed to fetch activity:', err);
    return [];
  }
}

export default function Activity() {
  const { profile, loading, refresh } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [currentStreak, setCurrentStreak] = useState(0);

  // This effect will run every time the user navigates to this page,
  // ensuring the user data (and thus activity) is fresh.
  useEffect(() => {
    if (refresh) {
      refresh();
    }
  }, [location]);

  useEffect(() => {
    if (!profile) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    fetchActivity(token).then(logs => {
      setActivityLogs(logs);
      // To maintain the heatmap, we need to process the logs into the format it expects
      const processedForHeatmap = logs.reduce((acc, log) => {
        const date = new Date(log.date).toISOString().slice(0, 10);
        acc[date] = (acc[date] || 0) + 1; // Increment for each activity on that day
        return acc;
      }, {});
      setHeatmapData(processedForHeatmap);
    });

    setCurrentStreak(profile.streak);

  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in to view activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Activity</h1>
        </div>
        <p className="text-muted-foreground mt-0">
          Track your daily progress and maintain your streak
        </p>

        {/* Display Current Streak */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">
            {currentStreak} Day Streak 🔥
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Activity Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StreakHeatmap data={heatmapData} />
          </CardContent>
        </Card>

        {/* Display Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {activityLogs.slice(0, 10).map(log => (
                <li key={log._id} className="flex items-center gap-4 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="text-sm text-muted-foreground">
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{log.details}</p>
                    {log.topic && (
                      <p className="text-xs text-muted-foreground">
                        Topic: {log.topic} | Score: {log.score}/{log.totalQuestions}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
