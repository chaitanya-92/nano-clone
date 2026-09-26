import {
  useEffect,
  useState,
} from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSidebar } from "./DashboardSidebar";

const COLLAPSED_WIDTH = 76;
const EXPANDED_WIDTH = 232;

export function DashboardLayout() {
  const [collapsed, setCollapsed] =
    useState(() => {
      if (
        typeof window === "undefined"
      ) {
        return true;
      }

      return (
        window.localStorage.getItem(
          "naano-dashboard-sidebar",
        ) === "collapsed"
      );
    });

  useEffect(() => {
    window.localStorage.setItem(
      "naano-dashboard-sidebar",
      collapsed
        ? "collapsed"
        : "expanded",
    );
  }, [collapsed]);

  const sidebarWidth = collapsed
    ? COLLAPSED_WIDTH
    : EXPANDED_WIDTH;

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() =>
          setCollapsed(
            (current) => !current,
          )
        }
      />

      <motion.div
        animate={{
          paddingLeft: sidebarWidth,
        }}
        transition={{
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen"
      >
        <DashboardNavbar
          collapsed={collapsed}
          onToggleSidebar={() =>
            setCollapsed(
              (current) => !current,
            )
          }
        />

        <main className="min-h-[calc(100vh-72px)] bg-[#f7f9fc]">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </motion.div>
    </div>
  );
}
