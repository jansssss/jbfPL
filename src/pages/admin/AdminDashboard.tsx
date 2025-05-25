import { useProjects } from '../../contexts/ProjectContext';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import { Clipboard, Search } from 'lucide-react';
import { useState } from 'react';
import ProjectList from '../../components/ui/ProjectList';

const AdminDashboard = () => {
  const { projects, getPendingProjects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get pending projects for quick access
  const pendingProjects = getPendingProjects();
  
  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.applicant.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group projects by status
  const approvedProjects = filteredProjects.filter(p => p.status === '승인됨');
  const rejectedProjects = filteredProjects.filter(p => p.status === '거절됨');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="mt-1 text-sm text-gray-500">
          모든 프로젝트 신청을 검토하고 승인할 수 있습니다.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
        <Card>
          <CardContent className="flex items-center py-5">
            <div className="bg-gray-100 p-3 rounded-full">
              <Clipboard className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">전체 프로젝트</h3>
              <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
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
        
        <Card>
          <CardContent className="flex items-center py-5">
            <div className="bg-red-100 p-3 rounded-full">
              <Clipboard className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">거절됨</h3>
              <p className="text-2xl font-semibold text-gray-900">{rejectedProjects.length}</p>
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
            placeholder="프로젝트 또는 신청자 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Pending Projects */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">승인 대기 중인 프로젝트</h2>
        <ProjectList
          projects={pendingProjects.filter(project => 
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.applicant.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          isAdmin={true}
          emptyMessage="승인 대기 중인 프로젝트가 없습니다."
        />
      </div>

      {/* All Projects */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">모든 프로젝트</h2>
        <ProjectList
          projects={filteredProjects}
          isAdmin={true}
          emptyMessage="검색 결과가 없습니다."
        />
      </div>
    </div>
  );
};

export default AdminDashboard;