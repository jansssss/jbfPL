import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { WorkProvider } from './contexts/WorkContext';         // ✅ [신규] WorkProvider import

import Layout from './components/Layout';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ChangePassword from './pages/auth/ChangePassword';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ProjectApplication from './pages/employee/ProjectApplication';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProjectApproval from './pages/admin/ProjectApproval';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import ProjectDetail from './pages/employee/ProjectDetail';
// ✅ [신규] WorkApplication import
import WorkApplication from './pages/employee/WorkApplication';

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user && !location.pathname.includes('/login') && !location.pathname.includes('/signup')) {
    return <Navigate to="/login" replace />;
  }

  if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <WorkProvider> {/* ✅ WorkProvider로 전체 감싸기 */}
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={
              <ProtectedRoute>
                <SignUp />
              </ProtectedRoute>
            } />

            {/* Protected routes (로그인 시에만 접근 가능) */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<EmployeeDashboard />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/apply" element={<ProjectApplication />} />
              {/* ✅ [신규] 업무계획 등록 경로 */}
              <Route path="/work/apply" element={<WorkApplication />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<EmployeeManagement />} />
              <Route path="/admin/approve/:id" element={<ProjectApproval />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
            </Route>

            {/* 모든 알 수 없는 경로는 /login 으로 이동 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </WorkProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
