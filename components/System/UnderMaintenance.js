'use client';

import React from 'react';
import {
  MaintenanceContainer,
  MaintenanceTitle,
  MaintenanceMessage,
  GraphicImage,
  BackToHomeButton
} from './UnderMaintenanceStyled';

const UnderMaintenance = () => {
  return (
    <MaintenanceContainer>
      <MaintenanceTitle>We'll Be Back Soon!</MaintenanceTitle>
      <MaintenanceMessage>
        Our website is currently undergoing maintenance. We appreciate your patience and understanding.
      </MaintenanceMessage>
      <GraphicImage src="/path/to/your/maintenance-graphic.svg" alt="Under Maintenance" />
      <BackToHomeButton href="/">Back to Home</BackToHomeButton>
    </MaintenanceContainer>
  );
};

export default UnderMaintenance;