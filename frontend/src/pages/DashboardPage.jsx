import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Flame,
  FolderKanban,
  FolderPlus,
  ListChecks,
  ListPlus,
  LogOut,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Brand from "../components/Brand.jsx";
import MetricCard from "../features/dashboard/MetricCard.jsx";
import SectionCard from "../features/dashboard/SectionCard.jsx";
import QuickActionModal from "../features/dashboard/QuickActionModal.jsx";
import {
  addDashboardItem,
  getDashboardData,
} from "../services/dashboardService.js";

function greetingForHour(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatRelativeTime(value) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 60000),
  );
  if (minutes < 2) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatDeadline(value) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function WeeklyChart({ values = [] }) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const max = Math.max(...values, 1);
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!values.length || total === 0)
    return (
      <div className="empty-chart">
        <Activity size={22} />
        <strong>No learning activity yet</strong>
        <span>Log a learning session to see your weekly progress.</span>
      </div>
    );
  return (
    <div
      className="weekly-chart"
      aria-label={`Weekly learning activity, ${total.toFixed(1)} hours total`}
    >
      <div className="chart-y-labels">
        <span>{Math.ceil(max)}h</span>
        <span>{(max / 2).toFixed(1)}h</span>
        <span>0h</span>
      </div>
      <div className="chart-bars">
        {labels.map((label, index) => {
          const height = Math.max(
            values[index] > 0 ? 7 : 2,
            (values[index] / max) * 100,
          );
          return (
            <div className="chart-day" key={label}>
              <div className="chart-bar-track">
                <div
                  className={`chart-bar ${index === (new Date().getDay() + 6) % 7 ? "chart-bar-today" : ""}`}
                  style={{ height: `${height}%` }}
                  title={`${values[index] || 0} hours`}
                />
              </div>
              <span
                className={
                  index === (new Date().getDay() + 6) % 7
                    ? "chart-day-current"
                    : ""
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityIcon({ type }) {
  const icons = {
    learning: BookOpen,
    project: FolderKanban,
    task: CheckCircle2,
    resource: Code2,
  };
  const Icon = icons[type] || Activity;
  return (
    <span className={`activity-icon activity-${type || "default"}`}>
      <Icon size={16} />
    </span>
  );
}

function EmptyState({ icon: Icon = Sparkles, title, description }) {
  return (
    <div className="dash-empty">
      <span>
        <Icon size={19} />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [notice, setNotice] = useState("");
  const firstName =
    user?.profile?.displayName?.trim().split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    "there";
  const greeting = useMemo(() => greetingForHour(new Date().getHours()), []);

  const loadDashboard = useCallback(async () => {
    setLoadState("loading");
    setLoadError("");
    try {
      const result = await getDashboardData(user?.id);
      setData(result);
      setLoadState("success");
    } catch (error) {
      setLoadError(error.message || "We could not load your dashboard.");
      setLoadState("error");
    }
  }, [user?.id]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleQuickSave = async (type, values) => {
    try {
      const updated = addDashboardItem(user.id, type, values);
      setData(updated);
      setNotice(
        type === "project"
          ? "Project added to your workspace."
          : type === "task"
            ? "Task added to your list."
            : "Learning time logged successfully.",
      );
      window.setTimeout(() => setNotice(""), 3200);
    } catch (error) {
      throw error;
    }
  };

  const metrics = data
    ? {
        active: data.projects.filter((item) => item.status === "active").length,
        completed: data.projects.filter((item) => item.status === "completed")
          .length,
        pending: data.tasks.filter((item) => item.status !== "completed")
          .length,
        hours: data.learningHours,
      }
    : null;

  const deadlines = useMemo(
    () =>
      data?.tasks
        .filter((task) => task.status !== "completed" && task.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4) || [],
    [data],
  );

  return (
    <div className="workspace-shell dashboard-shell">
      <header className="workspace-header dashboard-header">
        <Brand />
        <div className="dashboard-header-right">
          <span className="header-date">
            <CalendarDays size={14} />{" "}
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <div className="header-user">
            <span className="avatar">{firstName.charAt(0).toUpperCase()}</span>
            <span className="header-user-name">
              {user?.profile?.displayName || user?.name}
            </span>
            <button
              className="icon-button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome-row">
          <div className="workspace-welcome">
            <span className="form-kicker">YOUR WORKSPACE</span>
            <h1>
              {greeting}, {firstName}
              <span className="heading-period">.</span>
            </h1>
            <p>Small steps add up. Here's your progress at a glance.</p>
          </div>
          <button className="dashboard-date-filter" type="button">
            <CalendarDays size={15} /> This week <ChevronDown size={14} />
          </button>
        </div>

        {notice && (
          <div className="dashboard-notice" role="status">
            <CheckCircle2 size={16} />
            {notice}
          </div>
        )}

        {loadState === "loading" && (
          <div className="dashboard-state">
            <span className="spinner" />
            <strong>Preparing your workspace</strong>
            <p>Gathering your latest progress...</p>
          </div>
        )}
        {loadState === "error" && (
          <div className="dashboard-state dashboard-state-error">
            <span className="state-error-icon">
              <Activity size={22} />
            </span>
            <strong>We couldn't load your dashboard</strong>
            <p>{loadError}</p>
            <button className="secondary-button" onClick={loadDashboard}>
              <RefreshCw size={15} /> Try again
            </button>
          </div>
        )}

        {loadState === "success" && data && (
          <>
            <section className="metric-grid" aria-label="Workspace summary">
              <MetricCard
                label="Active projects"
                value={metrics.active}
                helper="In progress"
                icon={FolderKanban}
                tone="mint"
              />
              <MetricCard
                label="Completed projects"
                value={metrics.completed}
                helper="All time"
                icon={CheckCircle2}
                tone="blue"
              />
              <MetricCard
                label="Pending tasks"
                value={metrics.pending}
                helper="Need attention"
                icon={ListChecks}
                tone="amber"
              />
              <MetricCard
                label="Learning hours"
                value={`${metrics.hours}h`}
                helper="Total logged"
                icon={Clock3}
                tone="violet"
              />
            </section>

            <div className="dashboard-content-grid">
              <div className="dashboard-main-column">
                <SectionCard
                  title="Weekly productivity"
                  subtitle="Your learning activity over the last 7 days"
                  action={
                    <span className="chart-total">
                      <TrendingUp size={15} />{" "}
                      {data.weeklyHours
                        .reduce((sum, value) => sum + value, 0)
                        .toFixed(1)}
                      h <small>this week</small>
                    </span>
                  }
                >
                  <WeeklyChart values={data.weeklyHours} />
                </SectionCard>

                <SectionCard
                  title="Recent activity"
                  subtitle="A timeline of your latest progress"
                  action={
                    <button
                      className="text-action"
                      type="button"
                      onClick={() =>
                        setNotice(
                          "The full activity feed will be available in a future module.",
                        )
                      }
                    >
                      View all <ArrowRight size={14} />
                    </button>
                  }
                >
                  {data.activities.length ? (
                    <div className="activity-list">
                      {data.activities.slice(0, 5).map((activity) => (
                        <div className="activity-row" key={activity.id}>
                          <ActivityIcon type={activity.type} />
                          <div className="activity-copy">
                            <strong>{activity.title}</strong>
                            <span>{activity.detail}</span>
                          </div>
                          <time>{formatRelativeTime(activity.time)}</time>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Activity}
                      title="No activity yet"
                      description="Your completed work and learning sessions will appear here."
                    />
                  )}
                </SectionCard>
              </div>

              <aside className="dashboard-side-column">
                <SectionCard
                  title="Daily streak"
                  subtitle="Consistency beats intensity"
                  className="streak-card"
                >
                  <div className="streak-highlight">
                    <span className="streak-flame">
                      <Flame size={24} fill="currentColor" />
                    </span>
                    <div>
                      <strong>{data.streak} days</strong>
                      <span>Current learning streak</span>
                    </div>
                  </div>
                  <div className="streak-week">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                      <div className="streak-day" key={`${day}-${index}`}>
                        <span
                          className={
                            index < Math.min(data.streak, 7)
                              ? "streak-day-done"
                              : ""
                          }
                        >
                          {index < Math.min(data.streak, 7) ? (
                            <CheckCircle2 size={15} />
                          ) : (
                            day
                          )}
                        </span>
                        <small>{day}</small>
                      </div>
                    ))}
                  </div>
                  <div className="streak-footnote">
                    <Zap size={13} /> You're building a strong habit. Keep it
                    going!
                  </div>
                </SectionCard>

                <SectionCard
                  title="Upcoming deadlines"
                  subtitle="Your next tasks to focus on"
                  action={
                    <span className="deadline-count">
                      {deadlines.length} upcoming
                    </span>
                  }
                >
                  {deadlines.length ? (
                    <div className="deadline-list">
                      {deadlines.map((task) => (
                        <div className="deadline-row" key={task.id}>
                          <span className="deadline-dot" />
                          <div className="deadline-copy">
                            <strong>{task.title}</strong>
                            <span>{formatDeadline(task.dueDate)}</span>
                          </div>
                          <span className="deadline-arrow">
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={CheckCircle2}
                      title="You're all caught up"
                      description="No pending deadlines. Enjoy the breathing room."
                    />
                  )}
                </SectionCard>
              </aside>
            </div>

            <SectionCard
              title="Quick actions"
              subtitle="Keep your momentum going"
              className="quick-actions-card"
            >
              <div className="quick-actions-grid">
                <button
                  className="quick-action"
                  onClick={() => setActiveModal("project")}
                >
                  <span className="quick-action-icon quick-action-mint">
                    <FolderPlus size={19} />
                  </span>
                  <span>
                    <strong>New project</strong>
                    <small>Start something new</small>
                  </span>
                  <Plus size={16} className="quick-action-plus" />
                </button>
                <button
                  className="quick-action"
                  onClick={() => setActiveModal("task")}
                >
                  <span className="quick-action-icon quick-action-blue">
                    <ListPlus size={19} />
                  </span>
                  <span>
                    <strong>Add a task</strong>
                    <small>Plan your next step</small>
                  </span>
                  <Plus size={16} className="quick-action-plus" />
                </button>
                <button
                  className="quick-action"
                  onClick={() => setActiveModal("learning")}
                >
                  <span className="quick-action-icon quick-action-violet">
                    <BookOpen size={19} />
                  </span>
                  <span>
                    <strong>Log learning</strong>
                    <small>Record study time</small>
                  </span>
                  <Plus size={16} className="quick-action-plus" />
                </button>
              </div>
            </SectionCard>
          </>
        )}
      </main>

      <footer className="workspace-footer dashboard-footer">
        DEVTRACK <span>·</span> YOUR PERSONAL DEVELOPER WORKSPACE{" "}
        <button onClick={handleLogout}>Log out</button>
      </footer>
      {activeModal && (
        <QuickActionModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onSave={handleQuickSave}
        />
      )}
    </div>
  );
}
