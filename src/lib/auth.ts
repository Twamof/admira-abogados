export const ADMIN_CREDENTIALS = {
  email: "aziza@admiraabogados.com",
  password: "Admira2026!",
};

export function login(email: string, password: string): boolean {
  if (
    email === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    if (typeof window !== "undefined") {
      localStorage.setItem("admira_auth", "true");
      localStorage.setItem("admira_user", JSON.stringify({ email, name: "Aziza Maghni" }));
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admira_auth");
    localStorage.removeItem("admira_user");
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admira_auth") === "true";
  }
  return false;
}

export function getUser(): { email: string; name: string } | null {
  if (typeof window !== "undefined") {
    const u = localStorage.getItem("admira_user");
    return u ? JSON.parse(u) : null;
  }
  return null;
}
