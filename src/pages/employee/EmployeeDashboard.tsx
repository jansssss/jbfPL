import { useProjects } from '../../contexts/ProjectContext';
import { useWork } from '../../contexts/WorkContext';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Clipboard, PlusCircle, Search, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import ProjectList from '../../components/ui/ProjectList';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { getUserProjects } = useProjects();
  const { getUserWorks } = useWork();

  const currentUserId = user?.id || '';
  const myProjects = getUserProjects(currentUserId);
  const myWorks = getUserWorks(currentUserId);

  const [searchQuery, setSearchQuery] = useState('');
  const [workView, setWorkView] = useState<'card' | 'list'>('card');
  const [projectView, setProjectView] = useState<'card' | 'list'>('card');

  // 프로젝트명 검색
  const filteredProjects = myProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 프로젝트 상태별 분류
  const pendingProjects = filteredProjects.filter(p => p.status === '대기중');
  const approvedProjects = filteredProjects.filter(p => p.status === '승인됨');

  // 업무계획 카드/목록뷰 컴포넌트
  const WorkCardList = () => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {myWorks.map(work => (
        <Card key={work.id}>
          <CardContent className="flex flex-col gap-2 py-4 px-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{work.name}</span>
                <span className="ml-2 text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">{work.level} 등급</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  work.status === '진행중'
                    ? 'bg-yellow-100 text-yellow-800'
                    : work.status === '대기중'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {work.status}
              </span>
            </div>
            <div className="text-gray-500">{work.description}</div>
            <div className="text-gray-400 text-xs">작성일: {work.created_at?.slice(0, 10)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const WorkListTable = () => (
    <div className="overflow-x-auto border rounded-lg bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-bold">업무명</th>
            <th className="px-4 py-2 text-left">주요내용</th>
            <th className="px-4 py-2">등급</th>
            <th className="px-4 py-2">상태</th>
            <th className="px-4 py-2">작성일</th>
          </tr>
        </thead>
        <tbody>
          {myWorks.map(work => (
            <tr key={work.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-semibold">{work.name}</td>
              <td className="px-4 py-2 text-gray-500">{work.description}</td>
              <td className="px-4 py-2 text-blue-600 font-bold">{work.level}</td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    work.status === '진행중'
                      ? 'bg-yellow-100 text-yellow-800'
                      : work.status === '대기중'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {work.status}
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-400">{work.created_at?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* 상단 */}
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
              PL 등록
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

      {/* 내 프로젝트 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-gray-900">내 프로젝트</h2>
          {/* 카드/목록 보기 버튼 삭제됨 */}
        </div>
        <ProjectList
          projects={filteredProjects}
          emptyMessage="프로젝트가 없습니다. 프로젝트 신청 버튼을 눌러 새 프로젝트를 시작하세요."
          view={projectView}
        />
      </div>

      {/* 내 업무계획 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-gray-900">내 업무계획</h2>
          <div>
            <Button
              size="sm"
              variant={workView === 'card' ? 'primary' : 'outline'}
              onClick={() => setWorkView('card')}
              className="mr-2"
              icon={<LayoutGrid className="h-4 w-4" />}
            >카드 보기</Button>
            <Button
              size="sm"
              variant={workView === 'list' ? 'primary' : 'outline'}
              onClick={() => setWorkView('list')}
              icon={<List className="h-4 w-4" />}
            >목록 보기</Button>
          </div>
        </div>
        {myWorks.length === 0 ? (
          <div className="text-gray-500">등록된 업무계획이 없습니다.</div>
        ) : workView === 'card' ? (
          <WorkCardList />
        ) : (
          <WorkListTable />
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
