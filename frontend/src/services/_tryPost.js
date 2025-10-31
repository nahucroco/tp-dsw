// services/_tryPost.js
import api from "../api/axiosConfig";

function baseHasApiPrefix() {
  try {
    const u = new URL(api.defaults.baseURL || window.location.origin, window.location.origin);
    return /\/api(\/|$)/.test(u.pathname);
  } catch {
    // si baseURL es relativo, chequeo string
    return (api.defaults.baseURL || "").includes("/api");
  }
}

function normalizeEndpoints(candidates) {
  const hasApi = baseHasApiPrefix();

  // si baseURL YA tiene /api, descartamos candidatos que empiecen con /api
  if (hasApi) {
    return candidates
      .map(p => (p.startsWith("http") ? p : p.replace(/^\/+/, "/"))) // normalizo
      .filter(p => !p.startsWith("/api/") && p !== "/api");          // fuera duplicados
  }
  // si baseURL NO tiene /api, dejamos todos
  return candidates;
}

/**
 * Intenta POST sobre endpoints y bodies candidatos.
 * 400 de validación ⇒ probamos otro body
 * 404 ⇒ probamos otro endpoint
 * otros ⇒ lanzamos
 */
export async function tryPost({ endpoints, bodies }) {
  const eps = normalizeEndpoints(endpoints);
  let lastErr = null;

  for (const ep of eps) {
    for (const body of bodies) {
      try {
        const res = await api.post(ep, body);
        return res;
      } catch (e) {
        const status = e?.response?.status;
        const msg = (e?.response?.data?.message || e?.response?.data?.error || "").toLowerCase();

        if (status === 400 && (msg.includes("invalid") || msg.includes("input") || msg.includes("validation"))) {
          lastErr = e;              // probar siguiente body en mismo endpoint
          continue;
        }
        if (status === 404) {       // probar siguiente endpoint
          lastErr = e;
          break;
        }
        throw e;                    // otros errores: cortar
      }
    }
  }
  throw lastErr ?? new Error("No payload shape matched");
}
