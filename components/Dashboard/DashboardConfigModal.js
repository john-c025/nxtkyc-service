import styled from '@emotion/styled';
import { useState } from 'react';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${props => props.isDarkMode 
    ? 'rgba(0, 0, 0, 0.7)' 
    : 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const WidgetList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const WidgetItem = styled.div`
  padding: 1rem;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 132, 11, 0.1)' 
    : 'rgba(249, 115, 22, 0.05)'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.isSelected 
    ? (props.isDarkMode ? '#ff840b' : '#f97316')
    : 'transparent'};

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 132, 11, 0.15)' 
      : 'rgba(249, 115, 22, 0.1)'};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: ${props => props.primary 
    ? (props.isDarkMode ? '#ff840b' : '#f97316')
    : 'transparent'};
  color: ${props => props.primary 
    ? '#ffffff' 
    : (props.isDarkMode ? '#ff840b' : '#f97316')};
  border: 2px solid ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export default function DashboardConfigModal({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  currentConfig,
  onSave,
  availableWidgets 
}) {
  const [selectedWidgets, setSelectedWidgets] = useState(
    currentConfig.map(widget => widget.id)
  );

  const toggleWidget = (widgetId) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleSave = () => {
    const newConfig = availableWidgets.filter(
      widget => selectedWidgets.includes(widget.id)
    );
    onSave(newConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isDarkMode={isDarkMode} onClick={onClose}>
      <ModalContent 
        isDarkMode={isDarkMode} 
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ 
          color: isDarkMode ? '#fdba74' : '#ff840b',
          marginBottom: '1.5rem'
        }}>
          Configure Dashboard
        </h2>
        
        <p style={{ 
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          marginBottom: '1rem'
        }}>
          Select the widgets you want to display on your dashboard:
        </p>

        <WidgetList>
          {availableWidgets.map(widget => (
            <WidgetItem
              key={widget.id}
              isDarkMode={isDarkMode}
              isSelected={selectedWidgets.includes(widget.id)}
              onClick={() => toggleWidget(widget.id)}
            >
              <div style={{ 
                color: isDarkMode ? '#fdba74' : '#ff840b'
              }}>
                {widget.icon}
              </div>
              <div>
                <h4 style={{ 
                  color: isDarkMode ? '#ffffff' : '#111827',
                  marginBottom: '0.25rem'
                }}>
                  {widget.title}
                </h4>
                <p style={{ 
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  {widget.description}
                </p>
              </div>
            </WidgetItem>
          ))}
        </WidgetList>

        <ButtonGroup>
          <Button isDarkMode={isDarkMode} onClick={onClose}>
            Cancel
          </Button>
          <Button isDarkMode={isDarkMode} primary onClick={handleSave}>
            Save Changes
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
} 