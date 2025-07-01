import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface Project {
  id: string;
  no: number;
  name: string;
  description: string;
  members: string;
  strategy: string;
  goal: string;
  level: string;
  notes: string;
  status: string;
  feedback: string;
  applicant_id: string;
  created_at?: string;
  updated_at?: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'applicant_id' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  getProject: (id: string) => Promise<Project | undefined>; // ✅ 반환 타입 변경 (비동기화)
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

  const fetchProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      // ✅ 관리자면 전체 조회, 아니면 본인 프로젝트만
      if (user?.level < 3) {
        query = query.eq('applicant_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (window.showToast) {
        window.showToast('프로젝트 목록을 불러오는데 실패했습니다.', 'error');
      }
    }
  };

  const addProject = async (
    project: Omit<Project, 'id' | 'created_at' | 'applicant_id' | 'updated_at'>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, applicant_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle(); // ✅ 여러 조건에 대응

      if (error) throw error;

      setProjects(prev =>
        prev.map(project => (project.id === id ? { ...project, ...data } : project))
      );
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  // ✅ local에 없으면 Supabase에서 직접 조회
  const getProject = async (id: string): Promise<Project | undefined> => {
    const local = projects.find(p => p.id === id);
    if (local) return local;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase getProject error:', error);
      return undefined;
    }

    return data || undefined;
  };

  const getUserProjects = (userId: string) => {
    return projects.filter((p) => p.applicant_id === userId);
  };

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
