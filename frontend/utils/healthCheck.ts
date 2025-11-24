export function runHealthCheck(apiUrl: string) {
  if (typeof window === "undefined") {
    return { token: null, backendOK: false, profileOK: false };
  }

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    null;

  return {
    token,
    backendOK: !!apiUrl,
    profileOK: !!token, 
  };
}

export function autoFixHealth(check: any) {
  // si no hay token, elimina los datos corruptos
  if (!check.token) {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    return true;
  }
  return false;
}
