import { useParams } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, getProject } = useProjects();
  const project = getProject(id);

  // ✅ [1] 신청번호(01부터 시작) 계산
  const index = projects.findIndex(p => p.id === id);
  const displayId = index !== -1 ? (index + 1).toString().padStart(2, '0') : '-';

  // ✅ [2] 신청자 이름 불러오기
  const [applicantName, setApplicantName] = useState('');
  useEffect(() => {
    const fetchName = async () => {
      if (project?.applicant_id) {
        const { data, error } = await supabase
          .from('users')
          .select('name')
          .eq('id', project.applicant_id)
          .single();
        if (data?.name) setApplicantName(data.name);
        else setApplicantName(project.applicant_id); // fallback
      }
    };
    fetchName();
  }, [project]);

  if (!project) {
    return <div style={{ padding: 24 }}>존재하지 않는 프로젝트입니다.</div>;
  }

  return (
    <div style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>{project.name}</h2>
      <div style={{ marginBottom: 12 }}>
        <strong>신청번호:</strong> {displayId}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>신청자:</strong> {applicantName}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>등급:</strong> {project.level}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>상태:</strong> {project.status}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>신청일:</strong> {project.created_at}
      </div>
      <div>
        <strong>프로젝트 설명:</strong>
        <p>{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectDetail;
