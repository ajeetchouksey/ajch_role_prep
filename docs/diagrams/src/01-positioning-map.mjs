import { diagram, quadrant } from '../../../scripts/diagram-kit.mjs';

export default diagram({
  title: 'Positioning map',
  subtitle: 'Role Prep targets the deep, practised corner that only human coaching fills today',
  description: 'Quadrant map of practice realism against AI-role depth. Question lists, courses, chatbots, Aced, Final Round AI and Yoodli sit in the thin or passive quadrants; human mock interviews and the Role Prep target sit in the deep, practised top-right corner.',
  width: 1040,
  height: 512,
  legend: [
    { kind: 'step', label: 'Role Prep target' },
    { kind: 'risk', label: 'Human coaching, from $179 a session' },
    { kind: 'plain', label: 'Other ways to prepare' },
  ],
  items: [
    quadrant({
      x: 48, y: 8, w: 984, h: 448,
      xAxis: ['Reading only', 'Spoken and scored'],
      yAxis: ['Thin AI-role depth', 'Deep AI-role depth'],
      quadrants: [
        { label: 'Deep but passive' },
        { label: 'Deep and practised', kind: 'step' },
        { label: 'Thin and passive' },
        { label: 'Practised but thin' },
      ],
      points: [
        { x: 0.12, y: 0.30, label: 'Question lists and blogs' },
        { x: 0.15, y: 0.62, label: 'Courses and videos' },
        { x: 0.45, y: 0.35, label: 'General chatbot', labelSide: 'left' },
        { x: 0.70, y: 0.25, label: 'Aced' },
        { x: 0.75, y: 0.38, label: 'Final Round AI' },
        { x: 0.72, y: 0.12, label: 'Yoodli' },
        { x: 0.90, y: 0.76, label: 'Human mock interviews', kind: 'risk', labelSide: 'left' },
        { x: 0.85, y: 0.88, label: 'Role Prep target', kind: 'step', highlight: true, labelSide: 'left' },
      ],
    }),
  ],
});
