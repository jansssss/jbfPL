import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import { InputField, TextareaField, SelectField } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Save, ChevronLeft } from 'lucide-react';

const ProjectApplication = () => {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    members: '',
    strategy: '',
    goal: '',
    level: 'A',
    notes: '',
    status: '대기중',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name] && value.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = '프로젝트명을 입력해 주세요.';
    if (!form.description.trim()) newErrors.description = '간략한 설명을 입력해 주세요.';
    if (!form.members.trim()) newErrors.members = '구성원 정보를 입력해 주세요.';
    if (!form.strategy.trim()) newErrors.strategy = '추진 전략을 입력해 주세요.';
    if (!form.goal.trim()) newErrors.goal = '성과목표를 입력해 주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await addProject({
        name: form.name,
        description: form.description,
        members: form.members,
        strategy: form.strategy,
        goal: form.goal,
        level: form.level,
        notes: form.notes,
        status: form.status,
      });

      if (window.showToast) {
        window.showToast('프로젝트가 성공적으로 신청되었습니다. 관리자 승인을 기다려주세요.', 'success');
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting project', error);
      if (window.showToast) {
        window.showToast('프로젝트 신청 중 오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          icon={<ChevronLeft className="h-4 w-4" />}
          onClick={() => navigate('/')}
        >
          대시보드로 돌아가기
        </Button>
      </div>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 신청</h1>
          <p className="text-sm text-gray-500 mt-1">
            모든 항목을 작성한 후 한 번에 제출할 수 있습니다.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="프로젝트명"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              error={errors.name}
              placeholder="예: AI 기반 백신 개발 프로젝트"
            />
            <TextareaField
              label="간략 설명"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              error={errors.description}
              rows={2}
              placeholder="프로젝트의 개요 또는 목적을 간단히 작성"
            />
            <InputField
              label="구성원"
              name="members"
              value={form.members}
              onChange={handleChange}
              required
              error={errors.members}
              placeholder="참여 인원 예: 김연구원, 이팀장"
            />
            <TextareaField
              label="주요내용 및 추진전략"
              name="strategy"
              value={form.strategy}
              onChange={handleChange}
              required
              error={errors.strategy}
              rows={4}
              placeholder="프로젝트를 어떻게 추진할 것인지 상세히 작성"
            />
            <TextareaField
              label="성과평가지표 및 목표"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              required
              error={errors.goal}
              rows={3}
              placeholder="정량적 목표, KPI 등 작성"
            />
            <SelectField
              label="예상성과등급"
              name="level"
              value={form.level}
              onChange={handleChange}
              required
              description="예상되는 프로젝트 성과 수준"
            >
              <option value="S">S 등급 (핵심 전략 프로젝트)</option>
              <option value="A">A 등급 (주요 프로젝트)</option>
              <option value="B">B 등급 (일반 프로젝트)</option>
            </SelectField>
            <TextareaField
              label="기타"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="참고사항 또는 추가 요청사항"
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                icon={<Save className="h-4 w-4" />}
              >
                제출하기
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default ProjectApplication;
