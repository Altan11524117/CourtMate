import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'

/** Route-level code splitting: avoids loading Zod (v4) and other heavy pages on /login — SES/wallet lockdown can break Zod internals when those modules initialize. */
const Login = lazy(() => import('@/pages/Auth/Login'))
const Register = lazy(() => import('@/pages/Auth/Register'))
const ResetPassword = lazy(() => import('@/pages/Auth/ResetPassword'))
const ExamPage = lazy(() => import('@/pages/Exam/ExamPage'))
const ExamResultPage = lazy(() => import('@/pages/Exam/ExamResult'))
const AdList = lazy(() => import('@/pages/Ads/AdList'))
const AdDetail = lazy(() => import('@/pages/Ads/AdDetail'))
const AdForm = lazy(() => import('@/pages/Ads/AdForm'))
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'))
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))
const AboutPage = lazy(() => import('@/pages/Info/AboutPage'))
const FAQPage = lazy(() => import('@/pages/Info/FAQPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

const Protected = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const PublicOnly = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/ads" replace />
}

const PageFallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0f0a',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'var(--font-body, system-ui, sans-serif)',
    fontSize: '14px',
  }}>
    Loading…
  </div>
)

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Protected */}
            <Route path="/ads" element={<Protected><AdList /></Protected>} />
            <Route path="/ads/create" element={<Protected><AdForm /></Protected>} />
            <Route path="/ads/:adId" element={<Protected><AdDetail /></Protected>} />
            <Route path="/ads/:adId/edit" element={<Protected><AdForm /></Protected>} />
            <Route path="/exam" element={<Protected><ExamPage /></Protected>} />
            <Route path="/exam/result" element={<Protected><ExamResultPage /></Protected>} />
            <Route path="/profile/:userId" element={<Protected><ProfilePage /></Protected>} />

            {/* Fallbacks */}
            <Route path="/" element={<Navigate to="/ads" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
