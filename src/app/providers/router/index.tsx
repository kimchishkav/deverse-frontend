import { Routes, Route, Navigate } from "react-router-dom";

import { AppRoutes } from "@/shared/config/routes";

import { AuthPage } from "@/pages/auth";
import { FeedPage } from "@/pages/feed";
import { ProfilePage } from "@/pages/profile";
import { FriendsPage } from "@/pages/friends";
import { ProjectsPage } from "@/pages/projects";
import { NotFoundPage } from "@/pages/not-found";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={AppRoutes.AUTH} replace />} />
      <Route path={AppRoutes.AUTH} element={<AuthPage />} />
      <Route
        path={AppRoutes.FEED}
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={AppRoutes.PROFILE}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={AppRoutes.PROFILE_BY_ID}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={AppRoutes.FRIENDS}
        element={
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={AppRoutes.PROJECTS}
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />

      <Route path={AppRoutes.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};
