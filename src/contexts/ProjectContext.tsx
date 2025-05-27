import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

// 실제 Project 타입 정의는 lib/supabase 혹은 여기에서 프로젝트 스키마와 일치하게 정의
export interface Project {
  id: string;
  no: number; // 👈 이 줄 추가! (no 컬럼이 숫자라면 number, 문자열이면 string
  name: string;
  description: string;
  members: string;
  strategy: string;
  goal: string;
  level: string;
  notes: string;
  status: string;
  applicant_id: string;
  created_at?: string;
  updated_at?: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'applicant_id' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  getUserProjects: (userId: string) => Project[];
  getPendingProjects: () => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  // 프로젝트 전체 불러오기
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (window.showToast) {
        window.showToast('프로젝트 목록을 불러오는데 실패했습니다.', 'error');
      }
    }
  };

  // 프로젝트 추가 (user.id를 자동으로 applicant_id로 저장)
  const addProject = async (
    project: Omit<Project, 'id' | 'created_at' | 'applicant_id' | 'updated_at'>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...project,
          applicant_id: user.id, // 🔥 로그인 유저 id 자동입력
        }])
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  // 프로젝트 수정
  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev =>
        prev.map(project =>
          project.id === id ? { ...project, ...data } : project
        )
      );
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  // 단일 프로젝트 조회
  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  // 유저별 프로젝트 목록
  const getUserProjects = (userId: string) => {
    return projects.filter((p) => p.applicant_id === userId);
  };

  // 대기중 프로젝트
  const getPendingProjects = () => {
    return projects.filter((p) => p.status === '대기중');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        getProject,
        getUserProjects,
        getPendingProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
