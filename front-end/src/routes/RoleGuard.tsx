import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getUserProfile } from "@/store/slices/authSlice";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles = [],
  redirectTo = "/login",
}) => {
  const dispatch = useAppDispatch();
  const { accessToken, user, loading, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, accessToken, user]);

  if (!accessToken || error === "Unauthorized") {
    return <Navigate to="/login" replace />;
  }

  if ((loading || (accessToken && !user)) && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">
          Đang xác thực tài khoản...
        </p>
      </div>
    );
  }

  if (user && requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
