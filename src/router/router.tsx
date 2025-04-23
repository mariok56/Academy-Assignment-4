import React from 'react'
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import LoginPage from '../components/pages/Login'
import DashboardPage from '../components/pages/DashboardPage'
import AddUserPage from '../components/pages/AddUserPage'
import EditUserPage from '../components/pages/EditUserPage'
import AuthLayout from '../layouts/AuthLayout'

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        path: "dashboard/new",
        element: <AddUserPage />
      },
      {
        path: "dashboard/edit/:id",
        element: <EditUserPage />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
])