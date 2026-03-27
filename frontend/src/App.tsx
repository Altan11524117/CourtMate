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
      </BrowserRouter>
    </QueryClientProvider>
  )
}