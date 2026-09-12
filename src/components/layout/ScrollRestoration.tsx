import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_PREFIX = "naano-scroll:";

export function ScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const key = `${STORAGE_PREFIX}${location.pathname}${location.search}${location.hash}`;

    window.history.scrollRestoration = "manual";

    let saveTimeout: number | undefined;

    const savePosition = () => {
      window.clearTimeout(saveTimeout);

      saveTimeout = window.setTimeout(() => {
        sessionStorage.setItem(key, String(window.scrollY));
      }, 100);
    };

    window.addEventListener("scroll", savePosition, {
      passive: true,
    });

    const restorePosition = () => {
      const savedPosition = sessionStorage.getItem(key);

      if (!savedPosition) {
        window.scrollTo(0, 0);
        return;
      }

      const position = Number(savedPosition);

      if (!Number.isFinite(position)) {
        return;
      }

      window.scrollTo(0, position);
    };

    const restoreAfterRender = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          restorePosition();

          window.setTimeout(restorePosition, 100);
          window.setTimeout(restorePosition, 300);
          window.setTimeout(restorePosition, 600);
          window.setTimeout(restorePosition, 1000);
        });
      });
    };

    restoreAfterRender();

    return () => {
      window.clearTimeout(saveTimeout);

      sessionStorage.setItem(
        key,
        String(window.scrollY),
      );

      window.removeEventListener("scroll", savePosition);
    };
  }, [location.pathname, location.search, location.hash]);

  return null;
}