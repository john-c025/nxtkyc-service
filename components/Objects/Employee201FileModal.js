'use client';

import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { colors } from '../Dashboard/MainDashboardStyled';

// Styled components for the modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${colors.background.primary};
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${colors.shadow.xl};
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid ${colors.border.light};
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: ${colors.text.tertiary};
    margin: 0;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem 2rem;
`;

const RequirementSection = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const RequirementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const RequirementCard = styled.div`
  border: 1px solid ${colors.border.light};
  border-radius: 8px;
  padding: 1rem;
  background: ${colors.background.secondary};
  
  .requirement-header {
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 0.75rem;
    
    .requirement-name {
      font-weight: 500;
      color: ${colors.text.primary};
      font-size: 0.875rem;
    }
    
    .requirement-status {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      
      &.uploaded {
        background: ${colors.success[100]};
        color: ${colors.success[700]};
      }
      
      &.missing {
        background: ${colors.error[100]};
        color: ${colors.error[700]};
      }
    }
  }
  
  .upload-area {
    border: 2px dashed ${colors.border.medium};
    border-radius: 6px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover, &.dragover {
      border-color: ${colors.primary[400]};
      background: ${colors.primary[50]};
    }
    
    .upload-icon {
      width: 32px;
      height: 32px;
      margin: 0 auto 0.5rem;
      background: ${colors.primary[100]};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .upload-text {
      font-size: 0.75rem;
      color: ${colors.text.tertiary};
    }
  }
  
  .file-preview {
    background: ${colors.background.tertiary};
    border-radius: 6px;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    .file-icon {
      width: 32px;
      height: 32px;
      background: ${colors.primary[100]};
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
    }
    
    .file-info {
      flex: 1;
      
      .file-name {
        font-size: 0.75rem;
        font-weight: 500;
        color: ${colors.text.primary};
      }
      
      .file-size {
        font-size: 0.6875rem;
        color: ${colors.text.tertiary};
      }
    }
    
    .file-actions {
      display: flex;
      gap: 0.5rem;
      
      button {
        padding: 0.25rem 0.5rem;
        border: 1px solid ${colors.border.medium};
        border-radius: 4px;
        background: ${colors.background.primary};
        color: ${colors.text.secondary};
        font-size: 0.6875rem;
        cursor: pointer;
        
        &:hover {
          background: ${colors.background.tertiary};
        }
        
        &.remove {
          color: ${colors.error[600]};
          border-color: ${colors.error[300]};
          
          &:hover {
            background: ${colors.error[50]};
          }
        }
      }
    }
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 2rem 2rem;
  border-top: 1px solid ${colors.border.light};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  &.primary {
    background: ${colors.primary[500]};
    color: white;
    border: none;
    
    &:hover {
      background: ${colors.primary[600]};
    }
    
    &:disabled {
      background: ${colors.primary[300]};
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: ${colors.background.secondary};
    color: ${colors.text.secondary};
    border: 1px solid ${colors.border.medium};
    
    &:hover {
      background: ${colors.background.tertiary};
    }
  }
`;

// Requirements data structure
const REQUIREMENT_TYPES = {
  recruitment: {
    title: 'Recruitment Requirements',
    icon: '👥',
    requirements: [
      'SSS ID or E1 Form',
      'SSS Verification Slip',
      'TIN ID or BIR form 1902',
      'Philhealth ID or Member\'s Data Record (MDR)',
      'Pag-ibig ID or HDMF number',
      'NBI Clearance',
      'Driver\'s License (for field collector)',
      'Motorcycle ORCR (for field collector)',
      '4 copies of Birth Certificate',
      'Marriage Certificate (NSO – Authenticated)',
      'Birth Certificate of Dependents / Beneficiaries',
      'Transcript of Record or Diploma',
      'Certificate of Employment (COE)',
      '2x2 Picture',
      '1x1 Picture',
      'Chest X-Ray',
      'CBC (Complete Blood Count)',
      'Urinalysis',
      'Fecalysis',
      'Drug Test',
      'Hepa B Test (HBsAg)',
      'Physical Exam (with FIT TO WORK; Class A,B or C Remarks)',
      'Training Agreement',
      'Company ID',
      'Pre-employment Declaration',
      'Non-disclosure Agreement',
      'Application Form',
      'Recruitment Tracking Form',
      'Applicants Waiver'
    ]
  },
  accountManagement: {
    title: 'Account Management Requirements',
    icon: '📋',
    requirements: [
      'Probationary Contract',
      'Performance Appraisal Form',
      'Performance Appraisal Notification',
      'Promotion Memo',
      'Movement Memo',
      'End of Probationary Contract',
      'Separation Pay Computation',
      'Clearance'
    ]
  },
  training: {
    title: 'Training Requirements',
    icon: '📚',
    requirements: [
      'Training Certificates',
      'Training Bonds',
      'New Employee Orientation Form'
    ]
  },
  employeeRelations: {
    title: 'Employee Relations Requirements',
    icon: '⚖️',
    requirements: [
      'COC Acknowledgment Form',
      'Incident Report (with attachments)',
      'Notice to Explain',
      'Return to Work Order and Notice to Explain',
      'Notice of Preventive Suspension and Notice to Explain',
      'Notice of Administrative Hearing',
      'Notice of Disciplinary Action',
      'Notice of Dismissal',
      'Result of Investigation',
      'Appeal DOLE / NLRC',
      'Notice of Conference',
      'Minutes of DOLE / NLRC Conference'
    ]
  }
};

const Employee201FileModal = ({ isOpen, onClose, employeeId, employeeName }) => {
  const [files, setFiles] = useState({});
  const [dragover, setDragover] = useState(null);
  const fileInputRefs = useRef({});

  const handleFileSelect = (requirementType, requirementName, selectedFiles) => {
    const file = selectedFiles[0];
    if (file) {
      const fileKey = `${requirementType}-${requirementName}`;
      setFiles(prev => ({
        ...prev,
        [fileKey]: file
      }));
    }
  };

  const handleFileRemove = (requirementType, requirementName) => {
    const fileKey = `${requirementType}-${requirementName}`;
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fileKey];
      return newFiles;
    });
  };

  const handleDrop = (e, requirementType, requirementName) => {
    e.preventDefault();
    setDragover(null);
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(requirementType, requirementName, droppedFiles);
  };

  const handleSave = async () => {
    try {
      // Here you would implement the file upload logic
      console.log('Uploading files for employee:', employeeId);
      console.log('Files to upload:', files);
      
      // Example API call:
      // const formData = new FormData();
      // Object.entries(files).forEach(([key, file]) => {
      //   formData.append(key, file);
      // });
      // formData.append('employeeId', employeeId);
      // 
      // const response = await axiosInstance.post(`${API_ENDPOINTS.UPLOAD_EMPLOYEE_REQUIREMENTS}`, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      
      alert('Employee requirements uploaded successfully!');
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <h2>Employee 201 File Requirements</h2>
          <p>Upload required documents for {employeeName}</p>
        </ModalHeader>

        <ModalBody>
          {Object.entries(REQUIREMENT_TYPES).map(([typeKey, typeData]) => (
            <RequirementSection key={typeKey}>
              <h3>
                <span style={{ fontSize: '1.2rem' }}>{typeData.icon}</span>
                {typeData.title}
              </h3>
              
              <RequirementGrid>
                {typeData.requirements.map((requirement) => {
                  const fileKey = `${typeKey}-${requirement}`;
                  const uploadedFile = files[fileKey];
                  
                  return (
                    <RequirementCard key={requirement}>
                      <div className="requirement-header">
                        <div className="requirement-name">{requirement}</div>
                        <div className={`requirement-status ${uploadedFile ? 'uploaded' : 'missing'}`}>
                          {uploadedFile ? 'Uploaded' : 'Missing'}
                        </div>
                      </div>
                      
                      {uploadedFile ? (
                        <div className="file-preview">
                          <div className="file-icon">📄</div>
                          <div className="file-info">
                            <div className="file-name">{uploadedFile.name}</div>
                            <div className="file-size">{formatFileSize(uploadedFile.size)}</div>
                          </div>
                          <div className="file-actions">
                            <button
                              className="remove"
                              onClick={() => handleFileRemove(typeKey, requirement)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`upload-area ${dragover === fileKey ? 'dragover' : ''}`}
                          onClick={() => fileInputRefs.current[fileKey]?.click()}
                          onDrop={(e) => handleDrop(e, typeKey, requirement)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragover(fileKey);
                          }}
                          onDragLeave={() => setDragover(null)}
                        >
                          <div className="upload-icon">📎</div>
                          <div className="upload-text">
                            Click to upload or drag & drop
                          </div>
                          <input
                            ref={el => fileInputRefs.current[fileKey] = el}
                            type="file"
                            style={{ display: 'none' }}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileSelect(typeKey, requirement, e.target.files)}
                          />
                        </div>
                      )}
                    </RequirementCard>
                  );
                })}
              </RequirementGrid>
            </RequirementSection>
          ))}
        </ModalBody>

        <ModalFooter>
          <Button className="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className="primary" onClick={handleSave}>
            Save Requirements
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Employee201FileModal;
