const USERS_KEY = "devtrack_users_v1";
const SESSION_KEY = "devtrack_session_v1";
const RESET_KEY = "devtrack_reset_requests_v1";

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export async function registerUser({ name, email, password }) {
  await delay();
  const users = read(USERS_KEY, []);
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error(
      "An account with this email already exists. Try logging in.",
    );
  }
  // Demo only: never store plaintext passwords in a production application.
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    profile: null,
    createdAt: new Date().toISOString(),
  };
  write(USERS_KEY, [...users, user]);
  write(SESSION_KEY, user.id);
  return sanitizeUser(user);
}

export async function loginUser({ email, password }) {
  await delay();
  const normalizedEmail = email.trim().toLowerCase();
  const user = read(USERS_KEY, []).find(
    (item) => item.email === normalizedEmail && item.password === password,
  );
  if (!user) throw new Error("Incorrect email or password. Please try again.");
  write(SESSION_KEY, user.id);
  return sanitizeUser(user);
}

export function getCurrentUser() {
  const id = read(SESSION_KEY, null);
  if (!id) return null;
  const user = read(USERS_KEY, []).find((item) => item.id === id);
  return user ? sanitizeUser(user) : null;
}

export async function updateUserProfile(userId, profile) {
  await delay();
  const users = read(USERS_KEY, []);
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1)
    throw new Error("Your session could not be found. Please log in again.");
  users[index] = {
    ...users[index],
    profile: { ...profile, completedAt: new Date().toISOString() },
  };
  write(USERS_KEY, users);
  return sanitizeUser(users[index]);
}

export async function requestPasswordReset(email) {
  await delay();
  const normalizedEmail = email.trim().toLowerCase();
  const exists = read(USERS_KEY, []).some(
    (user) => user.email === normalizedEmail,
  );
  // Use a generic response so the interface does not reveal whether an account exists.
  if (exists) {
    const requests = read(RESET_KEY, []);
    write(RESET_KEY, [
      ...requests,
      { email: normalizedEmail, requestedAt: new Date().toISOString() },
    ]);
  }
  return true;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}
