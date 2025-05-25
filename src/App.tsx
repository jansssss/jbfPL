import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ChangePassword from './pages/auth/ChangePassword';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ProjectApplication from './pages/employee/ProjectApplication';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProjectApproval from './pages/admin/ProjectApproval';
import EmployeeManagement from './pages/admin/EmployeeManagement';

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

// ⭐ [진단용] (더 이상 사용하지 않음. 필요시만 주석 해제)
// const AuthDebug = () => {
//   const { user, loading, signOut } = useAuth();
//   return (
//     <div style={{ background: "#eee", padding: 8, margin: 8 }}>
//       <div><b>AuthContext 진단:</b></div>
//       <div>loading: {loading ? '로딩중' : '로딩완료'}</div>
//       <div>user: {user ? JSON.stringify(user) : '없음'}</div>
//       {user && (
//         <button
//           style={{
//             marginTop: 8,
//             padding: "6px 12px",
//             background: "#e53935",
//             color: "#fff",
//             border: "none",
//             borderRadius: 6,
//             fontWeight: "bold",
//             cursor: "pointer"
//           }}
//           onClick={() => {
//             signOut();
//           }}
//         >
//           [진단용] 강제 로그아웃(세션삭제)
//         </button>
//       )}
//     </div>
//   );
// };

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        {/* <AuthDebug /> */} {/* ← 진단용 컴포넌트는 이제 주석 처리 또는 삭제! */}
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
            <Route path="/" element={<EmployeeDashboard />} />    {/* 🔥 메인화면 대시보드 */}
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/apply" element={<ProjectApplication />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<EmployeeManagement />} />
            <Route path="/admin/approve/:id" element={<ProjectApproval />} />
          </Route>

          {/* 모든 알 수 없는 경로는 /login 으로 이동 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;