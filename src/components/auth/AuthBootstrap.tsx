import { useEffect } from "react";
import { finishAuthCheck } from "@/features/authSlice";
import { getCurrentUser } from "@/lib/auth";
import { useAppDispatch } from "@/store/hooks";

export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void getCurrentUser()
      .then(({ user }) => dispatch(finishAuthCheck(user)))
      .catch(() => dispatch(finishAuthCheck(null)));
  }, [dispatch]);
  return null;
}
