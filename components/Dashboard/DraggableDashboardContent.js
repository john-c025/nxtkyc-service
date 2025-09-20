'use client';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from '@emotion/styled';
import { CardGrid } from './MainDashboardStyled';

const DraggableWidget = styled.div`
  background: ${props => props.isEditMode ? 'transparent' : (props.darkMode ? '#2a2a2a' : '#ffffff')};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: ${props => props.isEditMode ? 'grab' : 'default'};
  position: relative;
  overflow: hidden;
  touch-action: none;

  &:hover {
    transform: ${props => props.isEditMode ? 'translateY(-4px) scale(1.05) rotate(1deg)' : 'scale(1.05)'};
    box-shadow: ${props => props.isEditMode ? '0 10px 20px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.2)'};
  }

  &[data-dragging="true"] {
    transform: scale(1.1) rotate(2deg);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    z-index: 20;
  }
`;

// Sortable widget component
const SortableWidget = ({ id, widget, renderWidget, isEditMode, darkMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    background: isEditMode 
      ? (darkMode ? 'rgba(255, 132, 11, 0.1)' : 'rgba(249, 115, 22, 0.1)')
      : (darkMode ? '#2a2a2a' : '#ffffff'),
    border: isEditMode ? '2px dashed rgba(255, 132, 11, 0.5)' : 'none'
  };

  return (
    <DraggableWidget
      ref={setNodeRef}
      style={style}
      isEditMode={isEditMode}
      darkMode={darkMode}
      data-dragging={isDragging}
      {...attributes}
      {...listeners}
    >
      {renderWidget(widget)}
    </DraggableWidget>
  );
};

const DraggableDashboardContent = ({
  topRowWidgets,
  mainContentWidgets,
  renderWidget,
  onDragEnd,
  isEditMode,
  darkMode
}) => {
  // Debug logs to check widget IDs
  console.log('Top row widgets:', topRowWidgets.map(widget => ({
    id: widget.id || widget.type || widget,
    type: widget.type,
    width: widget.width
  })));
  console.log('Main content widgets:', mainContentWidgets.map(widget => ({
    id: widget.id || widget.type || widget,
    type: widget.type,
    width: widget.width
  })));

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id) {
      // Determine which list is being modified
      const isTopRow = topRowWidgets.some(widget => 
        (widget.id || widget.type || widget) === active.id
      );
      
      const oldIndex = isTopRow 
        ? topRowWidgets.findIndex(widget => (widget.id || widget.type || widget) === active.id)
        : mainContentWidgets.findIndex(widget => (widget.id || widget.type || widget) === active.id);
      
      const newIndex = isTopRow
        ? topRowWidgets.findIndex(widget => (widget.id || widget.type || widget) === over.id)
        : mainContentWidgets.findIndex(widget => (widget.id || widget.type || widget) === over.id);
      
      // Create a copy of the appropriate array
      const items = isTopRow ? [...topRowWidgets] : [...mainContentWidgets];
      
      // Reorder the array
      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      
      // Call the parent's onDragEnd with the appropriate data
      onDragEnd({
        source: { 
          droppableId: isTopRow ? 'topRow' : 'mainContent',
          index: oldIndex
        },
        destination: {
          droppableId: isTopRow ? 'topRow' : 'mainContent',
          index: newIndex
        }
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* Top Row - Horizontal Sortable */}
      <SortableContext
        items={topRowWidgets.map(widget => widget.id || widget.type || widget)}
        strategy={horizontalListSortingStrategy}
      >
        <CardGrid>
          {topRowWidgets.map((widget, index) => {
            const widgetId = widget.id || widget.type || widget;
            return (
              <SortableWidget
                key={widgetId}
                id={widgetId}
                widget={widget}
                renderWidget={renderWidget}
                isEditMode={isEditMode}
                darkMode={darkMode}
              />
            );
          })}
        </CardGrid>
      </SortableContext>

      {/* Main Content - Vertical Sortable */}
      <SortableContext
        items={mainContentWidgets.map(widget => widget.id || widget.type || widget)}
        strategy={rectSortingStrategy}
      >
        <div className="chart-grid">
          {mainContentWidgets.map((widget, index) => {
            const widgetId = widget.id || widget.type || widget;
            return (
              <SortableWidget
                key={widgetId}
                id={widgetId}
                widget={widget}
                renderWidget={renderWidget}
                isEditMode={isEditMode}
                darkMode={darkMode}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableDashboardContent; 