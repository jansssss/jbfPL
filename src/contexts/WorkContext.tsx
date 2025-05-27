// src/contexts/WorkContext.tsx

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

// 실제 Work 타입 정의는 supabase work 테이블과 일치
export interface Work {
  id: string;
  name: string;
  description: string;
  strategy: string;
  goal: string;
  level: string;
  notes: string;
  status: string;
  applicant_id: string;
  created_at?: string;
  updated_at?: string;
}

interface WorkContextType {
  works: Work[];
  addWork: (work: Omit<Work, 'id' | 'created_at' | 'applicant_id' | 'updated_at'>) => Promise<void>;
  updateWork: (id: string, updates: Partial<Work>) => Promise<void>;
  getWork: (id: string) => Work | undefined;
  getUserWorks: (userId: string) => Work[];
  getPendingWorks: () => Work[];
}

const WorkContext = createContext<WorkContextType | undefined>(undefined);

export const WorkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [works, setWorks] = useState<Work[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWorks();
    }
    // eslint-disable-next-line
  }, [user]);

  // 전체 업무 불러오기
  const fetchWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('work') // 테이블명 주의!
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorks(data || []);
    } catch (error) {
      console.error('Error fetching works:', error);
      if (window.showToast) {
        window.showToast('업무계획 목록을 불러오는데 실패했습니다.', 'error');
      }
    }
  };

  // 업무 추가 (user.id를 자동으로 applicant_id로 저장)
  const addWork = async (
    work: Omit<Work, 'id' | 'created_at' | 'applicant_id' | 'updated_at'>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('work')
        .insert([{
          ...work,
          applicant_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      setWorks(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding work:', error);
      throw error;
    }
  };

  // 업무 수정
  const updateWork = async (id: string, updates: Partial<Work>) => {
    try {
      const { data, error } = await supabase
        .from('work')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setWorks(prev =>
        prev.map(work =>
          work.id === id ? { ...work, ...data } : work
        )
      );
    } catch (error) {
      console.error('Error updating work:', error);
      throw error;
    }
  };

  // 단일 업무 조회
  const getWork = (id: string) => {
    return works.find((w) => w.id === id);
  };

  // 유저별 업무 목록
  const getUserWorks = (userId: string) => {
    return works.filter((w) => w.applicant_id === userId);
  };

  // 대기중 업무계획
  const getPendingWorks = () => {
    return works.filter((w) => w.status === '대기중');
  };

  return (
    <WorkContext.Provider
      value={{
        works,
        addWork,
        updateWork,
        getWork,
        getUserWorks,
        getPendingWorks,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
};

export const useWork = () => {
  const context = useContext(WorkContext);
  if (context === undefined) {
    throw new Error('useWork must be used within a WorkProvider');
  }
  return context;
};
