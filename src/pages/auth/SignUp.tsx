import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { UserPlus } from 'lucide-react';

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const centers = {
    '경영기획본부': ['전략기획실', '경영혁신실'],
    '바이오의약본부': ['첨단바이오연구실', '스마트품질관리실', '바이오의약생산센터', '세포치료생산센터', '바이오의약본부지원실'],
    '그린바이오본부': ['천연자원연구실', 'AI융합지원실', '천연센터', '식품센터', '친환경센터', '나노센터'],
    '해양바이오본부': ['해양융합연구실', '해양테크센터', '해양바이오지원실'],
    '감사실': ['감사실']
  };

  const [center, setCenter] = useState('');
  const [team, setTeam] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!center || (centers[center]?.length && !team)) {
      setError('소속과 부서를 선택해주세요.');
      return false;
    }
    if (!userId || !name || !password || !confirmPassword) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    const email = `${userId}@jbf.kr`;
    setLoading(true);

    try {
      // ⭐ 이름(name), 소속(center), 부서(team)까지 signUp에 전달
      await signUp(email, password, name, center, team);

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
          <p className="mt-2 text-center text-sm text-gray-600">jBF 프로젝트 관리 시스템</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">{error}</div>
            )}

            <div>
              <label className="block font-medium text-gray-700 mb-1">소속(본부)</label>
              <select
                value={center}
                onChange={(e) => { setCenter(e.target.value); setTeam(''); }}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">선택하세요</option>
                {Object.keys(centers).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {center && centers[center].length > 0 && (
              <div>
                <label className="block font-medium text-gray-700 mb-1">부서(실/센터)</label>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">선택하세요</option>
                  {centers[center].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-medium text-gray-700 mb-1">아이디</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="영문자와 숫자만 입력하세요"
              />
              {userId && (
                <p className="mt-1 text-sm text-gray-500">이메일: {userId}@jbf.kr</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="실명을 입력하세요"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="최소 6자 이상 입력해주세요"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

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
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">로그인</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
