import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: any; // 실제 타입 맞게 지정
  index: number;
  linkTo: string;
  isAdmin?: boolean;
}

const ProjectCard = ({ project, index, linkTo, isAdmin }: ProjectCardProps) => {
  // const 신청번호 = (index + 1).toString().padStart(2, '0'); // 기존 순번 표시는 주석처리
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold truncate">{project.name}</span>
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{project.level} 등급</span>
      </div>
      <div className="text-sm text-gray-500 mb-1">{project.description}</div>
      <div className="text-xs text-gray-400 mb-2">
        신청번호: {project.no} {/* ✅ 신청번호 실제 값 사용 */}
        {/* 신청번호: {신청번호}  기존 코드(주석) */}
      </div>
      <div className="flex items-center">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          project.status === '대기중' ? 'bg-yellow-100 text-yellow-800' :
          project.status === '승인됨' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {project.status}
        </span>
        <Link
          to={linkTo}
          className="ml-auto text-blue-600 hover:text-blue-900 text-xs font-medium"
        >
          {isAdmin ? '검토하기' : '상세보기'} →
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
