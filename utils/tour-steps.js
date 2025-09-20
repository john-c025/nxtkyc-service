export const steps = [
    {
      tour: 'mainTour',
      steps: [
        {
          icon: '👋',
          title: 'Welcome to Eagle Eye!',
          content: 'Let’s take a quick tour of the dashboard to help you get started.',
          selector: '#dashboard-welcome',
          side: 'right',
          showControls: true,
          showSkip: true,
        },
        {
          icon: '📊',
          title: 'Visual Analytics',
          content: 'This area contains real-time charts and summaries of key metrics.',
          selector: '#visualized-view',
          side: 'bottom',
          showControls: true,
          showSkip: true,
        },
        {
          icon: '📂',
          title: 'IRS Upload Page',
          content: 'Upload and manage borrower masterlists here.',
          selector: '#irs-upload-area',
          side: 'right',
          showControls: true,
          showSkip: true,
          highlight: true,
        },
        {
          icon: '💼',
          title: 'Collector Management',
          content: 'Command center for collectors to monitor field performance.',
          selector: '#collector-cc',
          side: 'right',
          showControls: true,
          showSkip: true,
          highlight: true,
        },
        
        {
          icon: '🎯',
          title: 'You’re all set!',
          content: 'That’s the end of the tour. You can always ask Agila if you need help again.',
          selector: '#dashboard-welcome',
          side: 'top',
          showControls: true,
          showSkip: false,
        },
      ],
    },
  ];
  