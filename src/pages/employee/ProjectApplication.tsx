import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import { InputField, TextareaField, SelectField } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

const applicationSteps = [
  {
    title: '프로젝트 기본 정보',
    description: '프로젝트의 기본적인 정보를 입력해 주세요.'
  },
  {
    title: '프로젝트 세부 내용',
    description: '프로젝트의 세부 내용과 목표를 설명해 주세요.'
  },
  {
    title: '요청 사항 및 등급',
    description: '프로젝트 등급과 추가 요청 사항을 선택해 주세요.'
  }
];

const ProjectApplication = () => {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    members: '',
    strategy: '',
    goal: '',
    level: 'A',
    notes: '',
    status: '대기중', // 반드시 필요 (not null)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) newErrors.name = '프로젝트명을 입력해 주세요.';
      if (!form.description.trim()) newErrors.description = '간략한 설명을 입력해 주세요.';
      if (!form.members.trim()) newErrors.members = '구성원 정보를 입력해 주세요.';
    } else if (step === 1) {
      if (!form.strategy.trim()) newErrors.strategy = '추진 전략을 입력해 주세요.';
      if (!form.goal.trim()) newErrors.goal = '목표를 입력해 주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name] && value.trim()) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < applicationSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  // ⭐⭐ 여기가 가장 중요! - addProject 호출 시 applicant_id, id, created_at 등은 절대 전달하지 말 것 ⭐⭐
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
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

  const renderStepIndicators = () => (
    <div className="flex items-center justify-center mb-8">
      {applicationSteps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium 
              ${
                index < currentStep
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : index === currentStep
                  ? 'border-blue-600 text-blue-600'
                  : 'border-gray-300 text-gray-300'
              }
            `}
          >
            {index + 1}
          </div>
          {index < applicationSteps.length - 1 && (
            <div
              className={`w-12 h-1 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

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
            새 프로젝트를 신청하려면 아래 양식을 작성해 주세요.
          </p>
        </CardHeader>
        <CardContent>
          {renderStepIndicators()}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              {applicationSteps[currentStep].title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {applicationSteps[currentStep].description}
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <InputField
                  label="프로젝트명"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  error={errors.name}
                  placeholder="프로젝트의 이름을 입력하세요"
                />
                <TextareaField
                  label="프로젝트 간략 설명"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  error={errors.description}
                  placeholder="프로젝트에 대한 간략한 설명을 입력하세요"
                  rows={2}
                />
                <InputField
                  label="구성원"
                  name="members"
                  value={form.members}
                  onChange={handleChange}
                  required
                  error={errors.members}
                  placeholder="프로젝트에 참여하는 구성원들의 이름을 입력하세요 (예: 김직원, 이연구원)"
                />
              </div>
            )}
            {/* Step 2: Project Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <TextareaField
                  label="주요내용 및 추진전략"
                  name="strategy"
                  value={form.strategy}
                  onChange={handleChange}
                  required
                  error={errors.strategy}
                  placeholder="프로젝트의 주요 내용과 추진 전략을 상세히 기술해 주세요"
                  rows={5}
                />
                <TextareaField
                  label="성과평가 목표"
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  required
                  error={errors.goal}
                  placeholder="프로젝트의 성과를 평가할 수 있는 구체적인 목표를 기술해 주세요"
                  rows={3}
                />
              </div>
            )}
            {/* Step 3: Level and Additional Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <SelectField
                  label="프로젝트 등급"
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  required
                  description="프로젝트의 중요도와 규모에 따라 등급을 선택해 주세요"
                >
                  <option value="S">S 등급 (핵심 전략 프로젝트)</option>
                  <option value="A">A 등급 (주요 프로젝트)</option>
                  <option value="B">B 등급 (일반 프로젝트)</option>
                </SelectField>
                <TextareaField
                  label="기타 요청사항"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="추가적인 요청사항이나 참고사항이 있으면 입력해 주세요"
                  rows={3}
                />
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            이전
          </Button>
          {currentStep < applicationSteps.length - 1 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNextStep}
              icon={<ChevronRight className="h-4 w-4" />}
            >
              다음
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              icon={<Save className="h-4 w-4" />}
            >
              제출하기
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectApplication;