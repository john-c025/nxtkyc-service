'use client';

import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import { FaChartLine, FaChartBar, FaChartPie, FaTable, FaCog, FaTimes } from 'react-icons/fa';

const ConfigModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.darkMode ? '#1a1a1a' : '#ffffff'};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const WidgetList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const WidgetItem = styled.div`
  padding: 1rem;
  background: ${props => props.darkMode ? '#2a2a2a' : '#f5f5f5'};
  border-radius: 8px;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.darkMode ? '#3a3a3a' : '#e5e5e5'};
  }
`;

const SelectedWidgets = styled.div`
  margin-top: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &.save {
    background: #4CAF50;
    color: white;

    &:hover {
      background: #45a049;
    }
  }

  &.cancel {
    background: ${props => props.darkMode ? '#3a3a3a' : '#e5e5e5'};
    color: ${props => props.darkMode ? '#ffffff' : '#333333'};

    &:hover {
      background: ${props => props.darkMode ? '#4a4a4a' : '#d5d5d5'};
    }
  }
`;

const DashboardConfig = ({ isOpen, onClose, onSave, darkMode }) => {
  const [selectedWidgets, setSelectedWidgets] = useState([]);

  const availableWidgets = [
    { id: 'performance', name: 'Performance Metrics', icon: <FaChartLine /> },
    { id: 'analytics', name: 'Analytics Overview', icon: <FaChartBar /> },
    { id: 'distribution', name: 'Data Distribution', icon: <FaChartPie /> },
    { id: 'reports', name: 'Reports Table', icon: <FaTable /> },
    { id: 'settings', name: 'Settings', icon: <FaCog /> },
  ];

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Handle reordering within selected widgets
    if (source.droppableId === 'selected' && destination.droppableId === 'selected') {
      const newWidgets = Array.from(selectedWidgets);
      const [removed] = newWidgets.splice(source.index, 1);
      newWidgets.splice(destination.index, 0, removed);
      setSelectedWidgets(newWidgets);
    }

    // Handle adding from available to selected
    if (source.droppableId === 'available' && destination.droppableId === 'selected') {
      const widget = availableWidgets[source.index];
      const newWidgets = Array.from(selectedWidgets);
      newWidgets.splice(destination.index, 0, widget);
      setSelectedWidgets(newWidgets);
    }
  }, [selectedWidgets]);

  const handleSave = () => {
    onSave(selectedWidgets);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ConfigModal darkMode={darkMode}>
      <h2>Configure Dashboard</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div>
          <h3>Available Widgets</h3>
          <Droppable droppableId="available">
            {(provided) => (
              <WidgetList
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {availableWidgets.map((widget, index) => (
                  <Draggable
                    key={widget.id}
                    draggableId={`config-${widget.id}`}
                    index={index}
                  >
                    {(provided) => (
                      <WidgetItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        darkMode={darkMode}
                      >
                        {widget.icon}
                        {widget.name}
                      </WidgetItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </WidgetList>
            )}
          </Droppable>
        </div>

        <SelectedWidgets>
          <h3>Selected Widgets</h3>
          <Droppable droppableId="selected">
            {(provided) => (
              <WidgetList
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {selectedWidgets.map((widget, index) => (
                  <Draggable
                    key={widget.id}
                    draggableId={`config-${widget.id}`}
                    index={index}
                  >
                    {(provided) => (
                      <WidgetItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        darkMode={darkMode}
                      >
                        {widget.icon}
                        {widget.name}
                      </WidgetItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </WidgetList>
            )}
          </Droppable>
        </SelectedWidgets>
      </DragDropContext>

      <ButtonGroup>
        <Button className="cancel" onClick={onClose} darkMode={darkMode}>
          Cancel
        </Button>
        <Button className="save" onClick={handleSave}>
          Save Configuration
        </Button>
      </ButtonGroup>
    </ConfigModal>
  );
};

export default DashboardConfig; 