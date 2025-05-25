import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { InputField } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 이메일 변환
      const email = userId.includes('@') ? userId : `${userId}@jbf.kr`;
      await signIn(email, password);

      if (window.showToast) {
        window.showToast('로그인에 성공했습니다.', 'success');
      }
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold text-gray-900">로그인</h2>
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

            <div>
              <InputField
                label="아이디"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                autoComplete="username"
                description="전체 이메일 또는 아이디만 입력하세요. (예: user 또는 user@jbf.kr)"
              />
              {userId && !userId.includes('@') && (
                <p className="mt-1 text-sm text-gray-500">
                  이메일: {userId}@jbf.kr
                </p>
              )}
            </div>

            <InputField
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              icon={<LogIn className="h-4 w-4" />}
            >
              로그인
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;