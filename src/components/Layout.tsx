import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  User,
  Users,
  Menu, 
  X,
  FilePlus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './ui/Avatar';
import UserProfile from './UserProfile';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      if (window.showToast) {
        window.showToast('로그아웃에 실패했습니다.', 'error');
      }
    }
  };

  // ✅ "관리자전환" 버튼은 level === 3인 경우만 노출
  const canAccessAdmin = user?.level === 3;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link 
                  to={isAdminPath ? "/admin" : "/"} 
                  className="text-blue-600 font-semibold text-lg flex items-center gap-2"
                >
                  <ClipboardList className="h-6 w-6" />
                  <span>jBF project</span>
                </Link>
              </div>
            </div>
            
            <nav className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {canAccessAdmin && (
                isAdminPath ? (
                  <Link 
                    to="/" 
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    직원 모드로 전환
                  </Link>
                ) : (
                  <Link 
                    to="/admin" 
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    관리자 모드로 전환
                  </Link>
                )
              )}
              <span className="font-semibold mr-2">{user?.name} 님</span>
              <button
                onClick={handleSignOut}
                className="bg-blue-600 text-white px-3 py-2 rounded-md font-bold hover:bg-blue-700 ml-1"
              >
                로그아웃
              </button>
            </nav>
            
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {canAccessAdmin && (
                isAdminPath ? (
                  <Link 
                    to="/" 
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    직원 모드로 전환
                  </Link>
                ) : (
                  <Link 
                    to="/admin" 
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    관리자 모드로 전환
                  </Link>
                )
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar initials={user?.name?.charAt(0) || 'U'} />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5" />
                    내 정보
                  </div>
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-3 h-5 w-5" />
                    로그아웃
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <div className="flex flex-1">
        <aside className="hidden sm:flex w-64 flex-col fixed inset-y-0 pt-16 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {isAdminPath ? (
                <>
                  <Link
                    to="/admin"
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === '/admin'
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    프로젝트 관리
                  </Link>
                  <Link
                    to="/admin/employees"
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === '/admin/employees'
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    직원 관리
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === '/'
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    대시보드
                  </Link>
                  <Link
                    to="/apply"
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === '/apply'
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <ClipboardList className="mr-3 h-5 w-5" />
                    프로젝트 등록
                  </Link>
                  <Link
                    to="/work/apply"
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === '/work/apply'
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <FilePlus className="mr-3 h-5 w-5" />
                    내 업무계획 등록
                  </Link>
                </>
              )}
            </nav>
          </div>
        </aside>

        <main className="sm:ml-64 flex-1">
          <div className="py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {isProfileOpen && <UserProfile onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default Layout;
