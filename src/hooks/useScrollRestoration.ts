import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setScrollPosition } from "@/features/scrollSlice";

export function useScrollRestoration() {
  const { pathname, search } = useLocation();
  const dispatch = useAppDispatch();

  const key = `${pathname}${search}`;

  const savedPosition = useAppSelector(
    (state) => state.scroll.positions[key] ?? 0,
  );

  const positionRef = useRef(savedPosition);

  useEffect(() => {
    positionRef.current = savedPosition;
  }, [savedPosition]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    if (savedPosition <= 0) {
      window.scrollTo(0, 0);
      return;
    }

    window.scrollTo(0, 0);

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: "smooth",
        });
      });
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [key]);

  useEffect(() => {
    let timeout: number | undefined;

    const handleScroll = () => {
      window.clearTimeout(timeout);

      timeout = window.setTimeout(() => {
        const currentPosition = window.scrollY;

        positionRef.current = currentPosition;

        dispatch(
          setScrollPosition({
            key,
            position: currentPosition,
          }),
        );
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.clearTimeout(timeout);

      dispatch(
        setScrollPosition({
          key,
          position: window.scrollY,
        }),
      );

      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch, key]);
}