"use client";
import React, { useState } from 'react';
import { 
  AddRecordContainer, 
  TableModal, 
  TableModalContent, 
  ModalForm, 
  Button 
} from './AddRecordModalStyled';

const AddRecordModal = ({ isOpen, onClose, onAdd, isDarkMode }) => {
  if (!isOpen) return null;

  const [newRecord, setNewRecord] = useState({
    pn_number: '',
    refno: '',
    borrower_name: '',
    field_collector: '',
    contact_no: '',
    address: '',
    area: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newRecord);
    onClose();
  };

  return (
    <TableModal onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <TableModalContent isDarkMode={isDarkMode}>
        <AddRecordContainer isDarkMode={isDarkMode}>
          <div className="modal-header">
            <h3>Add New Record</h3>
            <button className="close-button" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ModalForm isDarkMode={isDarkMode} onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="required">PN Number</label>
                <input
                  type="text"
                  name="pn_number"
                  value={newRecord.pn_number}
                  onChange={handleChange}
                  required
                  placeholder="Enter PN number"
                />
              </div>
              <div className="form-group">
                <label className="required">Reference Number</label>
                <input
                  type="text"
                  name="refno"
                  value={newRecord.refno}
                  onChange={handleChange}
                  required
                  placeholder="Enter reference number"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="required">Borrower Name</label>
                <input
                  type="text"
                  name="borrower_name"
                  value={newRecord.borrower_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter borrower name"
                />
              </div>
              <div className="form-group">
                <label className="required">Field Collector</label>
                <input
                  type="text"
                  name="field_collector"
                  value={newRecord.field_collector}
                  onChange={handleChange}
                  required
                  placeholder="Enter field collector name"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contact_no"
                  value={newRecord.contact_no}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                />
              </div>
              <div className="form-group">
                <label>Area</label>
                <input
                  type="text"
                  name="area"
                  value={newRecord.area}
                  onChange={handleChange}
                  placeholder="Enter area"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={newRecord.address}
                onChange={handleChange}
                placeholder="Enter complete address"
              />
            </div>
          </ModalForm>
          <div className="modal-footer">
            <Button variant="secondary" type="button" onClick={onClose} isDarkMode={isDarkMode}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Add Record</Button>
          </div>
        </AddRecordContainer>
      </TableModalContent>
    </TableModal>
  );
};

export default AddRecordModal; 