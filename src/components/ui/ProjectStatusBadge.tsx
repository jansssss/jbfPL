import React from 'react';

interface ProjectStatusBadgeProps {
  status: string;
  className?: string;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case '승인됨':
        return 'bg-green-100 text-green-800';
      case '대기중':
        return 'bg-yellow-100 text-yellow-800';
      case '거절됨':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles()} ${className}`}
    >
      {status}
    </span>
  );
};

export default ProjectStatusBadge;