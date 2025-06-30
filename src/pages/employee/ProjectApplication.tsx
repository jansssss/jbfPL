// src/pages/employee/ProjectApplication.tsx
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
    start_date: '',
    end_date: '',
    background: '',
    contribution: '',
    innovation: '',
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
    if (!form.start_date || !form.end_date) newErrors.start_date = '수행 기간을 입력해 주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await addProject({ ...form });

      if (window.showToast) {
        window.showToast('프로젝트가 성공적으로 신청되었습니다.', 'success');
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting project', error);
      if (window.showToast) {
        window.showToast('오류가 발생했습니다.', 'error');
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
          <h1 className="text-2xl font-bold">PL(프로젝트 리더) 신청</h1>
          <p className="text-sm text-gray-500 mt-1">신청 양식을 작성해 주세요.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="프로젝트명" name="name" value={form.name} onChange={handleChange} required error={errors.name} />
            <TextareaField label="간략 설명" name="description" value={form.description} onChange={handleChange} required error={errors.description} />
            <InputField label="구성원" name="members" value={form.members} onChange={handleChange} required error={errors.members} />
            <div className="flex space-x-4">
              <InputField label="시작일" name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
              <InputField label="종료일" name="end_date" type="date" value={form.end_date} onChange={handleChange} required />
            </div>
            <TextareaField label="프로젝트 배경 및 목적" name="background" value={form.background} onChange={handleChange} />
            <TextareaField label="주요내용 및 추진전략" name="strategy" value={form.strategy} onChange={handleChange} required error={errors.strategy} />
            <TextareaField label="기대 성과" name="goal" value={form.goal} onChange={handleChange} required error={errors.goal} />
            <TextareaField label="조직/기관에의 기여" name="contribution" value={form.contribution} onChange={handleChange} />
            <TextareaField label="자율성 및 혁신성 요소" name="innovation" value={form.innovation} onChange={handleChange} />
            <SelectField label="예상 성과등급" name="level" value={form.level} onChange={handleChange} required>
              <option value="S">S 등급</option>
              <option value="A">A 등급</option>
              <option value="B">B 등급</option>
            </SelectField>
            <TextareaField label="기타" name="notes" value={form.notes} onChange={handleChange} />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" isLoading={isSubmitting} icon={<Save className="h-4 w-4" />}>
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
