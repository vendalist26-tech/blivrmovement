import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from './pages/HomePage'
import { GetConnectedPage } from './pages/GetConnectedPage'
import { UpcomingMeetingsPage } from './pages/UpcomingMeetingsPage'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './components/layout/AdminLayout'
import { RequireAuth } from './components/admin/RequireAuth'
import { AdminPortalLayout } from './components/admin/AdminPortalLayout'
import { AdminOverview } from './pages/admin/AdminOverview'
import { AdminSiteContentPage } from './pages/admin/AdminSiteContentPage'
import { AdminGetConnectedPage } from './pages/admin/AdminGetConnectedPage'
import { AdminGetConnectedCategoriesPage } from './pages/admin/AdminGetConnectedCategoriesPage'
import { AdminGetConnectedInfoPage } from './pages/admin/AdminGetConnectedInfoPage'
import { AdminAppearancePage } from './pages/admin/AdminAppearancePage'
import { AdminSeoPage } from './pages/admin/AdminSeoPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { AdminUpcomingMeetingsPage } from './pages/admin/AdminUpcomingMeetingsPage'
import { AdminMeetingRsvpsPage } from './pages/admin/AdminMeetingRsvpsPage'
import { ScrollToTop } from './components/ScrollToTop'
import { SmoothScroll } from './components/SmoothScroll'
import { ToastProvider } from './components/ui/Toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <SmoothScroll />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Old CMS/SEO: /get-connected was used in copy; /join-us matches with or without trailing "/" */}
            <Route path="/get-connected" element={<Navigate to="/join-us" replace />} />
            <Route path="/join-us" element={<GetConnectedPage />} />
            <Route path="/upcoming-meetings" element={<UpcomingMeetingsPage />} />
            <Route
              path="/admin/login"
              element={
                <AdminLayout>
                  <AdminLogin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <RequireAuth>
                    <AdminPortalLayout />
                  </RequireAuth>
                </AdminLayout>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="site" element={<AdminSiteContentPage />} />
              <Route path="get-connected/categories" element={<AdminGetConnectedCategoriesPage />} />
              <Route path="get-connected/info" element={<AdminGetConnectedInfoPage />} />
              <Route path="upcoming-meetings" element={<AdminUpcomingMeetingsPage />} />
              <Route path="meeting-rsvps" element={<AdminMeetingRsvpsPage />} />
              <Route path="get-connected" element={<AdminGetConnectedPage />} />
              <Route path="appearance" element={<AdminAppearancePage />} />
              <Route path="seo" element={<AdminSeoPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}
