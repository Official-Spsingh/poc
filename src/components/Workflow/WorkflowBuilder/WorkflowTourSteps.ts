import { TourStep } from '../../Common/GuidedTour';

export const tourSteps: TourStep[] = [
  { targetId: '', title: "Welcome to Studio", content: "Let's take a quick tour of the building blocks of your workflow automation.", position: 'center' },
  { targetId: 'tour-selector', title: "Flow Navigator", content: "Switch between different workflows or create a new one instantly from here.", position: 'bottomLeft' },
  { targetId: 'tour-versions', title: "Safe Harbor", content: "Keep track of changes and revert to previous versions with ease. Never lose a work-in-progress.", position: 'bottomRight' },
  { targetId: 'tour-command-center', title: "Design Hub", content: "Access your component palette, AI assistant, and layout utilities. Everything you need to build is right here.", position: 'rightTop' },
  { targetId: 'tour-canvas', title: "The Playground", content: "Drag and drop components here to build your logic. Use the right-click menu for quick actions on nodes.", position: 'center' },
  { targetId: 'tour-zoom', title: "Bird's Eye View", content: "Navigate complex flows easily with these zoom and focus controls.", position: 'top' },
  { targetId: 'tour-run-reset', title: "Execution Control", content: "Instantly run your flow to test logic and catch errors in real-time.", position: 'bottomRight' },
  { targetId: 'tour-deploy', title: "Go Live", content: "When you're ready, deploy your workflow as a production-ready application.", position: 'bottomRight' }
];
