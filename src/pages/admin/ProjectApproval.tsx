import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import  Button  from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ProjectApproval: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProject, updateProject } = useProjects();
  const [feedback, setFeedback] = useState('');
  const [approvedLevel, setApprovedLevel] = useState('S');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const project = getProject(id || '');

  useEffect(() => {
    if (!project) return;
    if (project.status === '승인됨' || project.status === '거절됨') {
      setFeedback(project.feedback || '');
      setApprovedLevel(project.level || 'S');
    }
  }, [project]);

  if (!project) {
    return <div className="p-4">프로젝트를 찾을 수 없습니다.</div>;
  }

  const handleApprove = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateProject(id, {
        status: '승인됨',
        level: approvedLevel,
        feedback: feedback || '승인되었습니다.',
        description: project.description || null,
        members: project.members || null,
        strategy: project.strategy || null,
        goal: project.goal || null,
        notes: project.notes || null,
      });
      if (window.showToast) {
        window.showToast('프로젝트가 성공적으로 승인되었습니다.', 'success');
      }
      navigate('/admin');
    } catch (error) {
      console.error('Error approving project', error);
      if (window.showToast) {
        window.showToast('프로젝트 승인 중 오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateProject(id, {
        status: '거절됨',
        feedback: feedback || '보완 후 다시 신청해주세요.',
      });
      if (window.showToast) {
        window.showToast('프로젝트가 반려되었습니다.', 'info');
      }
      navigate('/admin');
    } catch (error) {
      console.error('Error rejecting project', error);
      if (window.showToast) {
        window.showToast('프로젝트 반려 중 오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">프로젝트 승인 / 반려</h1>
      <div className="mb-4">
        <Label>프로젝트명</Label>
        <div className="border p-2 rounded bg-gray-50">{project.name}</div>
      </div>
      <div className="mb-4">
        <Label>프로젝트 설명</Label>
        <div className="border p-2 rounded bg-gray-50 whitespace-pre-line">{project.description}</div>
      </div>
      <div className="mb-4">
        <Label>프로젝트 전략</Label>
        <div className="border p-2 rounded bg-gray-50">{project.strategy}</div>
      </div>
      <div className="mb-4">
        <Label>참여자</Label>
        <div className="border p-2 rounded bg-gray-50">{project.members}</div>
      </div>
      <div className="mb-4">
        <Label>목표</Label>
        <div className="border p-2 rounded bg-gray-50 whitespace-pre-line">{project.goal}</div>
      </div>
      <div className="mb-4">
        <Label>비고</Label>
        <div className="border p-2 rounded bg-gray-50">{project.notes}</div>
      </div>
      <div className="mb-4">
        <Label htmlFor="level">등급 선택</Label>
        <select
          id="level"
          value={approvedLevel}
          onChange={(e) => setApprovedLevel(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="S">S</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </div>
      <div className="mb-4">
        <Label htmlFor="feedback">피드백</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="검토 의견을 입력하세요."
        />
      </div>
      <div className="flex justify-between mt-6">
        <Button onClick={handleReject} disabled={isSubmitting} variant="outline">
          반려하기
        </Button>
        <Button onClick={handleApprove} disabled={isSubmitting}>
          승인하기
        </Button>
      </div>
    </div>
  );
};

export default ProjectApproval;
