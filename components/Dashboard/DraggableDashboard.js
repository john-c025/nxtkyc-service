'use client';

import dynamic from 'next/dynamic';
import styled from '@emotion/styled';
import { CardGrid } from './MainDashboardStyled';
import { useState, useEffect } from 'react';

// Create a static version of the dashboard for non-edit mode and initial render
const StaticDashboard = ({ topRowWidgets, mainContentWidgets, renderWidget }) => (
  <>
    <CardGrid>
      {topRowWidgets.map((widget) => renderWidget(widget))}
    </CardGrid>
    <div className="chart-grid">
      {mainContentWidgets.map((widget) => renderWidget(widget))}
    </div>
  </>
);

// Dynamically import the draggable content with SSR disabled
const DraggableDashboardContent = dynamic(
  () => import('./DraggableDashboardContent'),
  { ssr: false }
);

const DraggableDashboard = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug log to check props
  console.log('DraggableDashboard props:', {
    isEditMode: props.isEditMode,
    isMounted,
    topRowWidgets: props.topRowWidgets?.length,
    mainContentWidgets: props.mainContentWidgets?.length
  });

  // Return static version for non-edit mode or server-side rendering
  if (!props.isEditMode || !isMounted) {
    return <StaticDashboard {...props} />;
  }

  // Return draggable version only when in edit mode and mounted on client
  return <DraggableDashboardContent {...props} />;
};

export default DraggableDashboard; 