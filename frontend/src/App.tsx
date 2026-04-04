import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'

import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import ResetPassword from '@/pages/Auth/ResetPassword'
import ExamPage from '@/pages/Exam/ExamPage'
import ExamResultPage from '@/pages/Exam/ExamResult'
import AdList from '@/pages/Ads/AdList'
import AdDetail from '@/pages/Ads/AdDetail'
import AdForm from '@/pages/Ads/AdForm'
import ProfilePage from '@/pages/Profile/ProfilePage'
import NotFound from '@/pages/NotFound/NotFound'
import AboutPage from '@/pages/Info/AboutPage'
import FAQPage from '@/pages/Info/FAQPage'

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Protected */}
          <Route path="/ads" element={<PublicOnly><AdList /></PublicOnly>} />
          <Route path="/ads/create" element={<PublicOnly><AdForm /></PublicOnly>} />
          <Route path="/ads/:adId" element={<PublicOnly><AdDetail /></PublicOnly>} />
          <Route path="/ads/:adId/edit" element={<PublicOnly><AdForm /></PublicOnly>} />
          <Route path="/exam" element={<PublicOnly><ExamPage /></PublicOnly>} />
          <Route path="/exam/result" element={<PublicOnly><ExamResultPage /></PublicOnly>} />
          <Route path="/profile/:userId" element={<PublicOnly><ProfilePage /></PublicOnly>} />

          {/* Fallbacks */}
          <Route path="/" element={<Navigate to="/ads" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}