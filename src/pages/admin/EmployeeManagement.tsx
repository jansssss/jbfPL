import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { InputField, SelectField } from '../../components/ui/FormField';
import { UserPlus, Save, Trash2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  level: number;
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', level: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, level')
        .order('name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (window.showToast) {
        window.showToast('직원 목록을 불러오는데 실패했습니다.', 'error');
      }
    }
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email) {
      if (window.showToast) {
        window.showToast('모든 필드를 입력해주세요.', 'error');
      }
      return;
    }

    setLoading(true);

    try {
      const email = `${newEmployee.email}@jbf.kr`;
      const password = 'tempPass123'; // Temporary password

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Update user level
      if (authData?.user) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ level: newEmployee.level })
          .eq('id', authData.user.id);

        if (updateError) throw updateError;
      }

      if (window.showToast) {
        window.showToast('직원이 추가되었습니다.', 'success');
      }

      setNewEmployee({ name: '', email: '', level: 1 });
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      if (window.showToast) {
        window.showToast('직원 추가에 실패했습니다.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLevel = async (id: string, level: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ level })
        .eq('id', id);

      if (error) throw error;

      setEmployees(employees.map(emp => 
        emp.id === id ? { ...emp, level } : emp
      ));

      if (window.showToast) {
        window.showToast('직원 레벨이 업데이트되었습니다.', 'success');
      }
    } catch (error) {
      console.error('Error updating employee level:', error);
      if (window.showToast) {
        window.showToast('직원 레벨 업데이트에 실패했습니다.', 'error');
      }
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('정말 이 직원을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmployees(employees.filter(emp => emp.id !== id));
      if (window.showToast) {
        window.showToast('직원이 삭제되었습니다.', 'success');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      if (window.showToast) {
        window.showToast('직원 삭제에 실패했습니다.', 'error');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">직원 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          직원을 추가하고 관리할 수 있습니다.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">새 직원 추가</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="이름"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
              placeholder="직원 이름"
            />
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <InputField
                  label="아이디"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="직원 아이디"
                  description="@jbf.kr이 자동으로 추가됩니다"
                />
              </div>
            </div>
            <SelectField
              label="레벨"
              value={newEmployee.level}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, level: Number(e.target.value) }))}
            >
              <option value={1}>레벨 1 (일반 직원)</option>
              <option value={2}>레벨 2 (중간 관리자)</option>
              <option value={3}>레벨 3 (최고 관리자)</option>
            </SelectField>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleAddEmployee}
              isLoading={loading}
              icon={<UserPlus className="h-4 w-4" />}
            >
              추가
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">직원 목록</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    레벨
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SelectField
                        value={employee.level}
                        onChange={(e) => handleUpdateLevel(employee.id, Number(e.target.value))}
                      >
                        <option value={1}>레벨 1 (일반 직원)</option>
                        <option value={2}>레벨 2 (중간 관리자)</option>
                        <option value={3}>레벨 3 (최고 관리자)</option>
                      </SelectField>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        icon={<Trash2 className="h-4 w-4" />}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;