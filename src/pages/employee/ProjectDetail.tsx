// src/pages/employee/ProjectDetail.tsx
import { useParams } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, getProject } = useProjects();
  const project = getProject(id);

  const index = projects.findIndex(p => p.id === id);
  const displayId = index !== -1 ? (index + 1).toString().padStart(2, '0') : '-';

  const [applicantName, setApplicantName] = useState('');
  useEffect(() => {
    const fetchName = async () => {
      if (project?.applicant_id) {
        const { data } = await supabase
          .from('users')
          .select('name')
          .eq('id', project.applicant_id)
          .single();
        setApplicantName(data?.name || project.applicant_id);
      }
    };
    fetchName();
  }, [project]);

  if (!project) {
    return <div className="p-6">존재하지 않는 프로젝트입니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">{project.name}</h2>

      <div className="space-y-2 text-gray-700">
        <p><span className="font-semibold">신청번호:</span> {displayId}</p>
        <p><span className="font-semibold">신청자:</span> {applicantName}</p>
        <p><span className="font-semibold">등급:</span> {project.level}</p>
        <p><span className="font-semibold">상태:</span> {project.status}</p>
        <p><span className="font-semibold">신청일:</span> {new Date(project.created_at).toLocaleString()}</p>
        <p><span className="font-semibold">수행기간:</span> {project.start_date} ~ {project.end_date}</p>
        <p><span className="font-semibold">구성인원:</span> {project.members}</p>
      </div>

      <div className="mt-8 space-y-6 text-gray-800">
        <div>
          <h3 className="font-semibold text-lg mb-1">프로젝트 설명</h3>
          <p className="bg-gray-50 p-3 rounded border">{project.description}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">프로젝트 배경 및 목적</h3>
          <p className="bg-gray-50 p-3 rounded border">{project.background}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">주요내용 및 추진전략</h3>
          <p className="bg-gray-50 p-3 rounded border">{project.strategy}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">기대 성과</h3>
          <p className="bg-gray-50 p-3 rounded border">{project.goal}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">조직/기관에의 기여</h3>
          <p className="bg-gray-50 p-3 rounded border">{project.contribution}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">자율성 및 혁신성 요소</h3>
          <p className="bg-gray-50 p-3 rounded border">{project.innovation}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">기타 특이사항</h3>
          <p className="bg-gray-50 p-3 rounded border">{project.notes}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
