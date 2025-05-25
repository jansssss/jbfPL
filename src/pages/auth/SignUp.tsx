import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { InputField } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { UserPlus } from 'lucide-react';

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');            // 👈 이름 상태 추가
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!userId || !name || !password || !confirmPassword) { // 👈 이름도 체크
      setError('모든 필드를 입력해주세요.');
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(userId)) {
      setError('아이디는 영문자와 숫자만 사용할 수 있습니다.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const email = `${userId}@jbf.kr`;
    setLoading(true);

    try {
      // ⭐ 이름(name)까지 signUp에 전달
      await signUp(email, password, name);

      if (window.showToast) {
        window.showToast('회원가입이 완료되었습니다. 로그인해주세요.', 'success');
      }
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold text-gray-900">회원가입</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            jBF 프로젝트 관리 시스템
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
                role="alert"
              >
                {error}
              </div>
            )}
            <InputField
              label="아이디"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              autoComplete="username"
              description="영문자와 숫자만 사용 가능합니다. @jbf.kr이 자동으로 추가됩니다."
            />
            {userId && (
              <p className="mt-1 text-sm text-gray-500">
                이메일: {userId}@jbf.kr
              </p>
            )}
            <InputField
              label="이름"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              description="실명을 입력하세요."
            />
            <InputField
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              description="최소 6자 이상 입력해주세요."
            />
            <InputField
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              icon={<UserPlus className="h-4 w-4" />}
            >
              회원가입
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;