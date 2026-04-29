// API client for the Spring Boot microservices, routed via the API Gateway.
// The gateway exposes "clean" paths (no service-id prefix):
//   POST /auth/login            -> auth-service
//   GET  /mobiles               -> mobile-service
//   GET  /customers             -> customer-service
//   GET  /orders                -> order-service
//   POST /bills/order/{id}      -> billing-service
//
// In local development, requests use Vite's proxy so the browser does not hit
// Spring Gateway cross-origin and get blocked by CORS. Set VITE_API_BASE_URL
// only when you intentionally want direct browser calls to a deployed gateway.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_DISPLAY_URL = API_BASE_URL || "the local Vite proxy to http://localhost:8080";

const TOKEN_KEY = "msi_token";

export const tokenStore = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, options = {}) {
  const { auth = true, json, headers, ...rest } = options;
  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };
  if (json !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = tokenStore.get();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch (e) {
    throw new ApiError(
      "Cannot reach API gateway at " +
        API_DISPLAY_URL +
        ". Make sure your Spring Boot services (Eureka + gateway + microservices) are running.",
      0
    );
  }

  if (res.status === 401) {
    // Dispatch a global event so AuthProvider can do a clean logout + redirect.
    // Do NOT clear the token here — avoid cascading failures if multiple
    // requests are in-flight simultaneously.
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    throw new ApiError("Session expired — please log in again.", 401);
  }
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const text = await res.text();
      if (text) msg = text;
    } catch {
      // ignore
    }
    throw new ApiError(msg, res.status);
  }
  if (res.status === 204) return undefined;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return await res.json();
  return await res.text();
}

// ---------- Endpoints ----------
// Clean gateway paths (no service-id prefix).

export const authApi = {
  register: (username, password, role = "ADMIN") =>
    api("/auth/register", {
      method: "POST",
      auth: false,
      json: { username, password, role },
    }),
  login: (username, password) =>
    api("/auth/login", {
      method: "POST",
      auth: false,
      json: { username, password },
    }),
};

export const mobilesApi = {
  list: () => api("/mobiles"),
  get: (id) => api(`/mobiles/${id}`),
  create: (m) => api("/mobiles", { method: "POST", json: m }),
  update: (id, m) => api(`/mobiles/${id}`, { method: "PUT", json: m }),
  remove: (id) => api(`/mobiles/${id}`, { method: "DELETE" }),
  reduceStock: (mobileId, quantity) =>
    api(`/mobiles/reduce-stock?mobileId=${mobileId}&quantity=${quantity}`, {
      method: "PUT",
    }),
};

export const customersApi = {
  list: () => api("/customers"),
  get: (id) => api(`/customers/${id}`),
  create: (c) => api("/customers", { method: "POST", json: c }),
  remove: (id) => api(`/customers/${id}`, { method: "DELETE" }),
};

export const ordersApi = {
  list: () => api("/orders"),
  get: (id) => api(`/orders/${id}`),
  // Backend OrderDTO: { mobileId, quantity, customerId }
  create: (o) => api("/orders", { method: "POST", json: o }),
  remove: (id) => api(`/orders/${id}`, { method: "DELETE" }),
};

export const billsApi = {
  // Backend: POST /bills/order/{orderId}
  create: (orderId) => api(`/bills/order/${orderId}`, { method: "POST" }),
  list: () => api("/bills"),
  get: (id) => api(`/bills/${id}`),
};