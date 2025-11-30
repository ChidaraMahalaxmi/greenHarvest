export function isLoggedIn() {
  return !!localStorage.getItem("authToken");
}

export function getRole() {
  return localStorage.getItem("userRole");
}

export function logout() {
  localStorage.clear();
  window.location.href = "/login";
}
