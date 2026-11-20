const STORAGE_PREFIX = "devtrack_dashboard_v1_";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function makeSeedData() {
  const today = new Date();
  const dateIn = (offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    return date.toISOString();
  };

  return {
    projects: [
      {
        id: "p-1",
        name: "RoadGuard AI",
        status: "active",
        updatedAt: dateIn(-1),
      },
      { id: "p-2", name: "DevTrack", status: "active", updatedAt: dateIn(0) },
      {
        id: "p-3",
        name: "AquaSense Monitor",
        status: "active",
        updatedAt: dateIn(-2),
      },
      {
        id: "p-4",
        name: "Photo2Instrument",
        status: "active",
        updatedAt: dateIn(-4),
      },
      ...Array.from({ length: 8 }, (_, index) => ({
        id: `done-${index}`,
        name: `Completed project ${index + 1}`,
        status: "completed",
        updatedAt: dateIn(-index - 5),
      })),
    ],
    tasks: [
      {
        id: "t-1",
        title: "Review React Router concepts",
        status: "pending",
        dueDate: dateIn(1),
      },
      {
        id: "t-2",
        title: "Finish dashboard responsive layout",
        status: "pending",
        dueDate: dateIn(2),
      },
      {
        id: "t-3",
        title: "Practise JavaScript array methods",
        status: "pending",
        dueDate: dateIn(3),
      },
      {
        id: "t-4",
        title: "Read about REST API design",
        status: "pending",
        dueDate: dateIn(4),
      },
      {
        id: "t-5",
        title: "Update project documentation",
        status: "pending",
        dueDate: dateIn(5),
      },
      {
        id: "t-6",
        title: "Solve two DSA problems",
        status: "pending",
        dueDate: dateIn(6),
      },
      {
        id: "t-7",
        title: "Set up Vite project",
        status: "completed",
        dueDate: dateIn(-1),
      },
    ],
    weeklyHours: [1.5, 2.25, 1, 3, 2.5, 4, 4.25],
    learningHours: 18.5,
    streak: 6,
    activities: [
      {
        id: "a-1",
        title: "Completed JavaScript fundamentals",
        detail: "Learning roadmap",
        time: dateIn(-0.15),
        type: "learning",
      },
      {
        id: "a-2",
        title: "Updated RoadGuard AI",
        detail: "Project activity",
        time: dateIn(-0.8),
        type: "project",
      },
      {
        id: "a-3",
        title: "Completed responsive navbar task",
        detail: "Task completed",
        time: dateIn(-1.1),
        type: "task",
      },
      {
        id: "a-4",
        title: "Added React Router resources",
        detail: "Resource library",
        time: dateIn(-1.6),
        type: "resource",
      },
    ],
  };
}

function readData(userId) {
  const key = `${STORAGE_PREFIX}${userId}`;
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  const initial = makeSeedData();
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

function saveData(userId, data) {
  localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(data));
  return data;
}

export async function getDashboardData(userId) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  if (!userId)
    throw new Error(
      "Your session could not be identified. Please sign in again.",
    );
  return readData(userId);
}

export function addDashboardItem(userId, type, values) {
  const data = readData(userId);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  if (type === "project") {
    data.projects.unshift({
      id,
      name: values.name.trim(),
      status: "active",
      updatedAt: now,
    });
    data.activities.unshift({
      id: `a-${id}`,
      title: `Created ${values.name.trim()}`,
      detail: "New project",
      time: now,
      type: "project",
    });
  } else if (type === "task") {
    data.tasks.unshift({
      id,
      title: values.name.trim(),
      status: "pending",
      dueDate: values.dueDate || now,
    });
    data.activities.unshift({
      id: `a-${id}`,
      title: `Added task: ${values.name.trim()}`,
      detail: "New task",
      time: now,
      type: "task",
    });
  } else if (type === "learning") {
    const hours = Number(values.hours);
    if (!Number.isFinite(hours) || hours <= 0 || hours > 12)
      throw new Error("Enter learning time between 0.25 and 12 hours.");
    data.learningHours = Number((data.learningHours + hours).toFixed(2));
    const dayIndex = (new Date().getDay() + 6) % 7;
    data.weeklyHours[dayIndex] = Number(
      (data.weeklyHours[dayIndex] + hours).toFixed(2),
    );
    data.streak = Math.max(data.streak, 1);
    data.activities.unshift({
      id: `a-${id}`,
      title: `Logged ${hours} learning hours`,
      detail: values.note?.trim() || "Learning session",
      time: now,
      type: "learning",
    });
  }

  data.activities = data.activities.slice(0, 8);
  return saveData(userId, data);
}
