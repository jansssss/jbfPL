import { FC } from 'react';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: FC<AvatarProps> = ({ initials, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div 
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-blue-600 text-white font-medium`}
    >
      {initials}
    </div>
  );
};

export default Avatar;