import React, { useState, useEffect } from 'react';
import { EmployeeDetails } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface EmployeeInfoModalProps {
  employee: EmployeeDetails | null;
  mode: 'create' | 'update' | null;
  onClose: () => void;
  onSave: (employee: EmployeeDetails) => void;
}

const EmployeeInfoModal: React.FC<EmployeeInfoModalProps> = ({ employee, onClose, onSave }) => {
  const [localEmployee, setLocalEmployee] = useState<EmployeeDetails | null>(employee);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalEmployee(employee);
  }, [employee]);

  if (!localEmployee) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let filteredValue = value;
    if (name === 'name') {
      // Allow only letters and spaces, and capitalize each word
      filteredValue = value.replace(/[^A-Za-z ]/g, '');
      filteredValue = filteredValue.replace(/\b\w/g, (char: string) => char.toUpperCase()).replace(/\B\w/g, (char: string) => char.toLowerCase());
    }
    if (name === 'lastName') {
      // Allow only letters and spaces, and capitalize each word
      filteredValue = value.replace(/[^A-Za-z ]/g, '');
      filteredValue = filteredValue.replace(/\b\w/g, (char: string) => char.toUpperCase()).replace(/\B\w/g, (char: string) => char.toLowerCase());
    }
    setLocalEmployee(prev => {
      if (!prev) return prev;
      let updated = {
        ...prev,
        [name]: type === 'number' ? Number(filteredValue) : filteredValue
      };
      // Keep firstName and name in sync
      if (name === 'name') {
        updated.firstName = filteredValue;
      }
      if (name === 'firstName') {
        updated.name = filteredValue;
      }
      // Update fullName when name or lastName changes
      if (name === 'name' || name === 'lastName') {
        updated.fullName = (name === 'name' ? filteredValue : updated.name) + ' ' + (name === 'lastName' ? filteredValue : updated.lastName);
      }
      if (name === 'salutation') {
        if (filteredValue === 'Mr.') {
          updated.gender = 'Male';
        } else if (filteredValue === 'Ms.' || filteredValue === 'Mrs.') {
          updated.gender = 'Female';
        } else if (filteredValue === 'Mx.') {
          updated.gender = 'Unspecified';
        }
      }
      return updated;
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalEmployee(prev => prev ? {
      ...prev,
      [name]: value
    } : prev);
  };

  // Map profileColor to button color
  const getSaveButtonStyle = () => {
    let backgroundColor = '#007bff'; // Default blue
    switch (localEmployee.profileColor) {
      case 'Green':
        backgroundColor = 'green';
        break;
      case 'Blue':
        backgroundColor = 'blue';
        break;
      case 'Red':
        backgroundColor = 'red';
        break;
      case 'Default':
        backgroundColor = '#e6e6fa';
        break;
      default:
        backgroundColor = '#007bff';
    }
    return {
      ...saveButtonStyle,
      backgroundColor,
    };
  };

  // Helper to format numbers with spaces
  function formatNumberWithSpaces(value: number | string) {
    if (value === '' || value === null || value === undefined) return '';
    const num = typeof value === 'number' ? value : parseInt(value.toString().replace(/\s/g, ''), 10);
    if (isNaN(num)) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Custom handler for salary input
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, '');
    const num = parseInt(raw, 10);
    setLocalEmployee(prev => prev ? {
      ...prev,
      gsalary: isNaN(num) ? 0 : num
    } : prev);
  };

  return (
    <div style={bottomSheetOverlayStyle}>
      <div style={bottomSheetModalStyle}>
        {saving && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
          }}>
            <LoadingSpinner />
          </div>
        )}
        <div style={headerStyle}>
          <h2 style={{ margin: 0, flex: 1, textAlign: 'center' }}>Employee Information</h2>
        </div>
        <div style={formGridStyle}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={inputGroupRowStyle}>
              <label style={labelStyle}>First Name(s) *</label>
              <input 
                type="text" 
                name="name"
                value={localEmployee.name}
                style={inputStyle}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
            <div style={inputGroupRowStyle}>
              <label style={labelStyle}>Last Name *</label>
              <input 
                type="text" 
                name="lastName"
                value={localEmployee.lastName}
                style={inputStyle}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
            <div style={inputGroupRowStyle}>
              <label style={labelStyle}>Salutation *</label>
              <select
                name="salutation"
                value={localEmployee.salutation}
                style={inputStyle}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="Dr.">Dr.</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Mx.">Mx.</option>
              </select>
            </div>
            <div style={inputGroupRowStyle}>
              <label style={labelStyle}>Gender *</label>
              <div style={radioGroupStyle}>
                <label>
                  <input 
                    type="radio" 
                    name="gender"
                    value="Male"
                    checked={localEmployee.gender === 'Male'}
                    onChange={handleRadioChange}
                    disabled={saving}
                  />
                  Male
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="gender"
                    value="Female"
                    checked={localEmployee.gender === 'Female'}
                    onChange={handleRadioChange}
                    disabled={saving}
                  />
                  Female
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="gender"
                    value="Unspecified"
                    checked={localEmployee.gender === 'Unspecified'}
                    onChange={handleRadioChange}
                    disabled={saving}
                  />
                  Unspecified
                </label>
              </div>
            </div>
            <div style={inputGroupRowStyle}>
              <label style={labelStyle}>Employee # *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input 
                  type="text" 
                  name="employeeNumber"
                  value={localEmployee.employeeNumber}
                  style={inputStyle}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={inputGroupRowStyle}>
              <label style={labelStyle}>Full Name</label>
              <input 
                type="text" 
                name="fullName"
                value={localEmployee.fullName}
                style={inputStyle}
                readOnly
              />
            </div>
            <div style={inputGroupRowStyle}>
              <label style={labelStyle}>Gross Salary $PY</label>
              <input 
                type="text" 
                name="gsalary"
                value={formatNumberWithSpaces(localEmployee.gsalary)}
                style={inputStyle}
                onChange={handleSalaryChange}
                disabled={saving}
              />
            </div>
            <div style={inputGroupRowStyle}>
              <label style={labelStyle}>Employee Profile Colour</label>
              <div style={colorOptionsStyle}>
                <label>
                  <input 
                    type="radio" 
                    name="profileColor"
                    value="Green"
                    checked={localEmployee.profileColor === 'Green'}
                    onChange={handleRadioChange}
                    disabled={saving}
                  />
                  Green
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="profileColor"
                    value="Blue"
                    checked={localEmployee.profileColor === 'Blue'}
                    onChange={handleRadioChange}
                    disabled={saving}
                  />
                  Blue
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="profileColor"
                    value="Red"
                    checked={localEmployee.profileColor === 'Red'}
                    onChange={handleRadioChange}
                    disabled={saving}
                  />
                  Red
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="profileColor"
                    value="Default"
                    checked={localEmployee.profileColor === 'Default'}
                    onChange={handleRadioChange}
                    disabled={saving}
                  />
                  Default
                </label>
              </div>
              <div style={{ marginTop: 4 }}>
              </div>
            </div>
          </div>
        </div>
        <div style={footerStyleBottomSheet}>
          <button style={cancelButtonStyle} onClick={onClose} disabled={saving}>Cancel</button>
          <button
            style={getSaveButtonStyle()}
            onClick={async () => {
              if (localEmployee) {
                setSaving(true);
                await onSave(localEmployee);
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            {saving ? <LoadingSpinner /> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '800px',
  maxWidth: '90%',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px'
};

const inputGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '5px'
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px'
};

const radioGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px'
};

const colorOptionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px'
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '20px'
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer'
};

const saveButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

// Add new styles for bottom sheet and grid
const bottomSheetOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  top: 'auto',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  zIndex: 1000
};

const bottomSheetModalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '24px 32px 16px 32px',
  borderRadius: '16px 16px 0 0',
  width: '100%',
  maxWidth: '1200px',
  boxShadow: '0 -2px 16px rgba(0,0,0,0.15)',
  position: 'relative',
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '32px',
  marginBottom: '24px',
};

const footerStyleBottomSheet: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '10px',
  marginTop: '12px',
  borderTop: '1px solid #eee',
  paddingTop: '12px',
};

// Add new row style for input groups and label style
const inputGroupRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  marginBottom: 0,
};

const labelStyle: React.CSSProperties = {
  minWidth: '160px',
  textAlign: 'right',
  fontWeight: 500,
};

export default EmployeeInfoModal; 