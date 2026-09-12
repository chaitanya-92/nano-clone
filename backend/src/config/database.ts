import { initializeDatabase } from "../db/schema";

export function initializeDatabaseConnection() {
  initializeDatabase();
  console.log("Database initialized.");
}
