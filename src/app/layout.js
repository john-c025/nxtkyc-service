// src/app/layout.js

import { Inter } from 'next/font/google';
import { NextStepProvider, NextStep } from 'nextstepjs';
import { steps } from '../../utils/tour-steps';

import './globals.css';
import ClientLayout from './layout-client';
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "../../context/ThemeContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CORE HR EMS Portal',
  description: 'CORE HR Employee Management System',
  icons: {
    icon: '/assets/logo-only.png',
    shortcut: '/assets/logo-only.png',
    apple: '/assets/logo-only.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
      
      
      </meta> 
      <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('loading');
                window.addEventListener('load', () => {
                  document.documentElement.classList.remove('loading');
                });
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <NextUIProvider>
            <NextStepProvider>
              <NextStep steps={steps}>
                <ClientLayout>
                  {children}
                </ClientLayout>
              </NextStep>
            </NextStepProvider>
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
