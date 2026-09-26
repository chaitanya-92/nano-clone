import { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { RegisterRoleChoice } from "./register/RegisterRoleChoice";
import { RegistrationWizard } from "./register/RegistrationWizard";

export default function Register() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );

  const googleOnboarding = searchParams.get("oauth") === "google";
  const requestedRole =
    searchParams.get("role") === "brand" ? "brand" : "creator";

  const [role, setRole] = useState<"creator" | "brand" | null>(
    googleOnboarding ? requestedRole : null,
  );

  if (!isLoading && isAuthenticated && !googleOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  if (googleOnboarding && !isLoading && !isAuthenticated) {
    return <Navigate to="/login?error=google_failed" replace />;
  }

  if (!role) {
    return (
      <RegisterRoleChoice
        onSelect={(value) => {
          setRole(value);
        }}
      />
    );
  }

  return (
    <RegistrationWizard
      role={role}
      googleOnboarding={googleOnboarding}
      userName={user?.name}
      userEmail={user?.email}
      onExit={() => {
        setRole(null);
      }}
    />
  );
}
