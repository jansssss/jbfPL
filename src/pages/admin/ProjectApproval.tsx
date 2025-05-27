import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SelectField, TextareaField } from '../../components/ui/FormField';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const ProjectApproval = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, updateProject } = useProjects();

  const [project, setProject] = useState<any>(null);
  const [approvedLevel, setApprovedLevel] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const projectData = getProject(id);
      if (projectData) {
        setProject(projectData);
        setApprovedLevel(projectData.level);
      } else {
        if (window.showToast) {
          window.showToast('프로젝트를 찾을 수 없습니다.', 'error');
        }
        navigate('/admin');
      }
    }
  }, [id, getProject, navigate]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setApprovedLevel(e.target.value);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  // 승인
  const handleApprove = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateProject(id, {
        status: '승인됨',
        level: approvedLevel,
        feedback: feedback || '승인되었습니다.',
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

  // 반려
  const handleReject = async () => {
    if (!id || !feedback.trim()) {
      if (window.showToast) {
        window.showToast('반려 사유를 입력해 주세요.', 'error');
      }
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProject(id, {
        status: '거절됨',
        feedback,
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

  if (!project) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">프로젝트 정보를 불러오는 중...</div>
      </div>
    );
  }

  const getLevelVariant = (level: string) => {
    switch (level) {
      case 'S': return 'info';
      case 'A': return 'success';
      case 'B': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          icon={<ChevronLeft className="h-4 w-4" />}
          onClick={() => navigate('/admin')}
        >
          관리자 대시보드로 돌아가기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                신청자: {project.applicant} | 신청일: {project.createdAt}
              </p>
            </div>
            <Badge variant={getLevelVariant(project.level)}>
              {project.level} 등급
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">프로젝트 설명</h3>
              <p className="text-gray-900">{project.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">구성원</h3>
              <p className="text-gray-900">{project.members}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">주요내용 및 추진전략</h3>
            <div className="bg-gray-50 p-4 rounded-md text-gray-900">
              {project.strategy}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">성과평가 목표</h3>
            <div className="bg-gray-50 p-4 rounded-md text-gray-900">
              {project.goal}
            </div>
          </div>
          {project.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">기타 요청사항</h3>
              <div className="bg-gray-50 p-4 rounded-md text-gray-900">
                {project.notes}
              </div>
            </div>
          )}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">승인 결정</h3>
            <SelectField
              label="승인 등급 조정"
              name="level"
              value={approvedLevel}
              onChange={handleLevelChange}
              description="프로젝트의 중요도와 규모에 따라 등급을 조정할 수 있습니다."
            >
              <option value="S">S 등급 (핵심 전략 프로젝트)</option>
              <option value="A">A 등급 (주요 프로젝트)</option>
              <option value="B">B 등급 (일반 프로젝트)</option>
            </SelectField>
            <TextareaField
              label="피드백 또는 반려 사유"
              name="feedback"
              value={feedback}
              onChange={handleFeedbackChange}
              description="승인 시 특별한 메모나, 반려 시 반려 사유를 입력해 주세요."
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <div className="flex space-x-3">
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={isSubmitting && project.status === '거절됨'}
              disabled={isSubmitting && project.status !== '거절됨'}
              icon={<XCircle className="h-4 w-4" />}
            >
              반려
            </Button>
            <Button
              variant="primary"
              onClick={handleApprove}
              isLoading={isSubmitting && project.status === '승인됨'}
              disabled={isSubmitting && project.status !== '승인됨'}
              icon={<CheckCircle className="h-4 w-4" />}
            >
              승인
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectApproval;
