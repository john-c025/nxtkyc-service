'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from '@emotion/styled';

export const SortableWidget = ({ id, children, isEditMode, isDarkMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <DraggableItem
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      isEditMode={isEditMode}
      isDarkMode={isDarkMode}
      {...attributes}
      {...listeners}
    >
      {children}
    </DraggableItem>
  );
};

const DraggableItem = styled.div`
  transition: transform 0.2s ease;
  position: relative;
  
  ${props => props.isEditMode && `
    cursor: move;
    
    &:hover {
      transform: translateY(-2px);
    }
  `}

  ${props => props.isDragging && `
    transform: scale(1.02) !important;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  `}

  &::before {
    content: '⋮⋮';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    opacity: ${props => props.isEditMode ? 0.7 : 0};
    transition: opacity 0.2s ease;
    color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
    z-index: 10;
  }
`; 