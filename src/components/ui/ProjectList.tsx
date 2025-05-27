import { FC, useState, useEffect } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import ProjectCard, { Project } from './ProjectCard';
import Button from './Button';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // ✅ supabase import

interface ProjectListProps {
  projects: Project[];
  isAdmin?: boolean;
  emptyMessage?: string;
}

interface User {
  id: string;
  name: string;
}

const ProjectList: FC<ProjectListProps> = ({ 
  projects, 
  isAdmin = false,
  emptyMessage = '프로젝트가 없습니다.'
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [users, setUsers] = useState<User[]>([]);

  // ✅ users 테이블에서 id, name 조회
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, name');
      if (!error && data) setUsers(data);
    };
    fetchUsers();
  }, []);

  // applicant_id → name 변환
  const getUserName = (id: string) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : id;
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            icon={<LayoutGrid className="h-4 w-4" />}
          >
            카드 보기
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            icon={<List className="h-4 w-4" />}
            className="ml-2"
          >
            목록 보기
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              linkTo={isAdmin ? `/admin/approve/${project.id}` : `/project/${project.id}`}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신청번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  프로젝트명
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    신청자
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등급
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신청일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상세
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project, index) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  {/* 신청번호: 01, 02, ... */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{(index + 1).toString().padStart(2, '0')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getUserName(project.applicant_id)}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{project.level} 등급</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      project.status === '승인됨' ? 'bg-green-100 text-green-800' :
                      project.status === '대기중' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {project.created_at ? project.created_at.split('T')[0] : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={isAdmin ? `/admin/approve/${project.id}` : `/project/${project.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {isAdmin ? '검토하기' : '상세보기'} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
