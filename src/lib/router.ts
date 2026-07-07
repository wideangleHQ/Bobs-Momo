// Lightweight SPA router utility for client-side navigation.
// Uses a custom "navigate" event instead of relying on the unreliable
// synthetic "popstate" dispatch pattern.

const NAVIGATE_EVENT = "app:navigate"

/**
 * Navigate to a new path. Updates the browser URL via pushState
 * and emits a custom event that App.tsx listens to.
 */
export function navigate(path: string) {
  window.history.pushState({}, "", path)
  window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: { path } }))
}

/**
 * Subscribe to route changes (both programmatic and browser back/forward).
 * Returns an unsubscribe function.
 */
export function onRouteChange(callback: (path: string) => void): () => void {
  const handleNavigate = (e: Event) => {
    const path = (e as CustomEvent).detail?.path ?? window.location.pathname
    callback(path)
  }

  const handlePopState = () => {
    callback(window.location.pathname)
  }

  window.addEventListener(NAVIGATE_EVENT, handleNavigate)
  window.addEventListener("popstate", handlePopState)

  return () => {
    window.removeEventListener(NAVIGATE_EVENT, handleNavigate)
    window.removeEventListener("popstate", handlePopState)
  }
}

/**
 * Proactively load a route chunk to make navigation instant.
 */
export function prefetchRoute(path: string) {
  if (path === "/menu") {
    import("../pages/MenuPage")
  } else if (path === "/") {
    import("../pages/HomePage")
  }
}

