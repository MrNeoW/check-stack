import React from 'react';
import { Employee } from '../types';

interface EmployeeTableProps {
  employees: Employee[];
  onEmployeeClick: (userId: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEmployeeClick }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Employee #</th>
            <th style={headerStyle}>First Name</th>
            <th style={headerStyle}>Last Name</th>
            <th style={headerStyle}>Salutation</th>
            <th style={headerStyle}>Profile Colour</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr 
              key={employee.employeeNumber}
              style={{
                backgroundColor: employee.profileColor === "Default"? '#e6e6fa' : employee.profileColor,
                cursor: 'pointer'
              }}
              onClick={() => onEmployeeClick(employee.userId)}
            >
              <td style={cellStyle}>{employee.employeeNumber}</td>
              <td style={cellStyle}>{employee.name}</td>
              <td style={cellStyle}>{employee.lastName}</td>
              <td style={cellStyle}>{employee.salutation}</td>
              <td style={cellStyle}>{employee.profileColor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  backgroundColor: '#f0f0f0',
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  fontWeight: 'normal',
  color: '#000000'
};

const cellStyle: React.CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
  color: '#000000'
};

export default EmployeeTable; 