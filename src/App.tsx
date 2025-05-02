import React, { useState, useEffect } from 'react';
import './App.css';
import LoadingSpinner from './components/LoadingSpinner';
import EmployeeTable from './components/EmployeeTable';
import EmployeeInfoModal from './components/EmployeeInfoModal';
import { Employee, EmployeeDetails } from './types';
import { api } from './services/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'update' | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await api.getEmployees();
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeClick = async (userId: string) => {
    try {
      setLoading(true);
      const response = await api.getEmployee(userId);
      setSelectedEmployee(response.data);
      setModalMode('update');
    } catch (err) {
      setError('Failed to fetch employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setModalMode(null);
  };

  const handleSaveEmployee = async (employee: EmployeeDetails) => {
    try {
      if (modalMode === 'create') {
        await api.post('/api/employees', employee);
      } else if (modalMode === 'update') {
        await api.put(`/api/employees/${employee.userId}`, employee);
      }
      // Refresh list, close modal, etc.
      await fetchEmployees();
      handleCloseModal();
      
    } catch (err) {
      setError('Failed to save employee');
    }
  };

  const handleAddEmployee = async () => {
    // Find the highest employee number and increment
    let nextEmployeeNumber = '1';
    if (employees.length > 0) {
      // Filter to numeric employee numbers, get max, add 1
      const maxNum = Math.max(
        ...employees
          .map(emp => parseInt(emp.employeeNumber, 10))
          .filter(num => !isNaN(num))
      );
      nextEmployeeNumber = (maxNum + 1).toString();
    }
    // Create a blank EmployeeDetails object
    const newEmployee: EmployeeDetails = {
      id: -1, // Temporary ID for new employee
      employeeNumber: nextEmployeeNumber,
      firstName: '',
      name: '',
      lastName: '',
      salutation: 'Mr.',
      profileColor: 'Default',
      fullName: '',
      gender: 'Male',
      gsalary: 0,
      userId: "",
    };
    setSelectedEmployee(newEmployee);
    setModalMode('create');
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
        width: '100%'
      }}>
        <h1 style={{ margin: '0 0 20px 0', fontWeight: 'normal' }}>Current Employees</h1>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            position: 'absolute',
            right: 0,
            top: 0
          }}
          onClick={handleAddEmployee}
        >
          Add Employee
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <EmployeeTable 
          employees={employees} 
          onEmployeeClick={handleEmployeeClick}
        />
      )}

      <EmployeeInfoModal
        employee={selectedEmployee}
        mode={modalMode}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}

export default App;