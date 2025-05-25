import { useProjects } from '../../contexts/ProjectContext';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Clipboard, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import ProjectList from '../../components/ui/ProjectList';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeDashboard = () => {
  // 상단 표시용(user 데이터 활용만)
  const { user } = useAuth();

  const { getUserProjects } = useProjects();
  // user?.id를 활용, 미로그인 상태는 ''로 대체
  const currentUserId = user?.id || '';
  const myProjects = getUserProjects(currentUserId);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = myProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group projects by status
  const pendingProjects = filteredProjects.filter(p => p.status === '대기중');
  const approvedProjects = filteredProjects.filter(p => p.status === '승인됨');
  const rejectedProjects = filteredProjects.filter(p => p.status === '거절됨');

  return (
    <div className="max-w-7xl mx-auto">
      {/* ✅ 아래 이름/로그아웃 버튼 부분은 삭제! */}

      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 대시보드</h1>
          <p className="mt-1 text-sm text-gray-500">
            신청한 프로젝트의 현황을 확인하고 관리할 수 있습니다.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link to="/apply">
            <Button variant="primary" icon={<PlusCircle className="h-4 w-4" />}>
              업무계획 등록
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="flex items-center py-5">
            <div className="bg-blue-100 p-3 rounded-full">
              <Clipboard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">전체 프로젝트</h3>
              <p className="text-2xl font-semibold text-gray-900">{myProjects.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center py-5">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clipboard className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">대기 중</h3>
              <p className="text-2xl font-semibold text-gray-900">{pendingProjects.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center py-5">
            <div className="bg-green-100 p-3 rounded-full">
              <Clipboard className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">승인됨</h3>
              <p className="text-2xl font-semibold text-gray-900">{approvedProjects.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
            placeholder="프로젝트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">내 프로젝트</h2>
        <ProjectList
          projects={filteredProjects}
          emptyMessage="프로젝트가 없습니다. 프로젝트 신청 버튼을 눌러 새 프로젝트를 시작하세요."
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;