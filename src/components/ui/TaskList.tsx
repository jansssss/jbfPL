import { FC, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import Button from './Button';

export interface Task {
  id: string;
  title: string;
  status: string;
  description: string;
  created_at: string;
}

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
}

const TaskList: FC<TaskListProps> = ({ tasks, emptyMessage = '업무계획이 없습니다.' }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (tasks.length === 0) {
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
          {tasks.map((task) => (
            <div key={task.id} className="bg-white shadow rounded-lg p-6 mb-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold truncate">{task.title}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  task.status === '완료'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-1">{task.description}</div>
              <div className="text-xs text-gray-400 mb-2">
                작성일: {task.created_at}
              </div>
              <div className="flex items-center">
                <a href={`/my-tasks/${task.id}`} className="ml-auto text-blue-600 hover:text-blue-900 text-xs font-medium">
                  상세보기 →
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  설명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상세
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      task.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a 
                      href={`/my-tasks/${task.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      상세보기 →
                    </a>
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

export default TaskList;
