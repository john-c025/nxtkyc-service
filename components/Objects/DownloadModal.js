import React from 'react';
import { ModalOverlay, ModalContent, ModalButton } from './DownloadModalStyled'; // Adjust the path as necessary

const DownloadModal = ({ isOpen, onClose, onDownload }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Select Download Format</h2>
        <ModalButton onClick={() => { 
          console.log('Download as PDF clicked'); 
          onDownload('pdf'); 
          onClose(); 
        }}>
          Download as PDF
        </ModalButton>
        <ModalButton onClick={() => { onDownload('xlsx'); onClose(); }}>Download as XLSX or Excel File</ModalButton>
        <ModalButton onClick={onClose}>Cancel</ModalButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DownloadModal;