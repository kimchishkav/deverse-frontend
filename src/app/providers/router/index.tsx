import { Routes, Route, Navigate } from "react-router-dom";

import { AppRoutes } from "@/shared/config/routes";

import { AuthPage } from "@/pages/auth";
import { FeedPage } from "@/pages/feed";
import { ProfilePage } from "@/pages/profile";
import { FriendsPage } from "@/pages/friends";
import { ProjectsPage } from "@/pages/projects";
import { NotFoundPage } from "@/pages/not-found";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={AppRoutes.AUTH} replace />} />
      <Route path={AppRoutes.AUTH} element={<AuthPage />} />
      <Route path={AppRoutes.FEED} element={<FeedPage />} />
      <Route path={AppRoutes.PROFILE} element={<ProfilePage />} />
      <Route path={AppRoutes.PROFILE_BY_ID} element={<ProfilePage />} />
      <Route path={AppRoutes.FRIENDS} element={<FriendsPage />} />
      <Route path={AppRoutes.PROJECTS} element={<ProjectsPage />} />
      <Route path={AppRoutes.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};
