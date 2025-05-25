import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card, { CardHeader, CardContent, CardFooter } from './ui/Card';
import { InputField } from './ui/FormField';
import Button from './ui/Button';
import { Save, X } from 'lucide-react';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile = ({ onClose }: UserProfileProps) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({ name });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      if (window.showToast) {
        window.showToast('프로필 업데이트에 실패했습니다.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">프로필 수정</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="이메일"
              type="email"
              value={user?.email || ''}
              disabled
            />

            <InputField
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </form>
        </CardContent>

        <CardFooter className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            isLoading={loading}
            icon={<Save className="h-4 w-4" />}
          >
            저장
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;