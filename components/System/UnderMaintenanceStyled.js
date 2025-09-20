import styled from '@emotion/styled';

export const MaintenanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom, #1a1a1a, #262626); /* Correctly applied linear gradient */
  color: #e2e8f0; /* Light text color */
  text-align: center;
  padding: 2rem;
  position: relative;
`;

export const MaintenanceTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const MaintenanceMessage = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

export const GraphicImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 2rem;
`;

export const BackToHomeButton = styled.a`
  padding: 0.75rem 1.5rem;
  background-color: #ff840b; /* Accent color */
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e67e22; /* Darker shade on hover */
  }
`;