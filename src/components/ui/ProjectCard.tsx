import { FC } from 'react';
import { Link } from 'react-router-dom';
import Card, { CardContent, CardFooter } from './Card';
import Badge from './Badge';
import { FileText, Calendar } from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  applicant: string;
  level: string;
  status: string;
  createdAt?: string;
  description?: string;
}

interface ProjectCardProps {
  project: Project;
  linkTo: string;
  isAdmin?: boolean;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, linkTo, isAdmin = false }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case '승인됨':
        return 'success';
      case '대기중':
        return 'warning';
      case '거절됨':
        return 'error';
      default:
        return 'default';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'S':
        return 'info';
      case 'A':
        return 'success';
      case 'B':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-gray-900 truncate">
            {project.name}
          </h3>
          <Badge variant={getLevelBadge(project.level)}>{project.level} 등급</Badge>
        </div>
        
        {project.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
        )}
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FileText className="h-4 w-4 mr-1" />
          {isAdmin ? (
            <span>신청자: {project.applicant}</span>
          ) : (
            <span>신청번호: {project.id}</span>
          )}
        </div>
        
        {project.createdAt && (
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>신청일: {project.createdAt}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center bg-gray-50 py-3">
        <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
        <Link 
          to={linkTo} 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isAdmin ? '검토하기' : '상세보기'} →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;