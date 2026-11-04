import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export default [
  layout('routes/shell.tsx', [
    // Pre-rendered public pages (see react-router.config.ts)
    index('routes/home.tsx'),
    route('topics', 'routes/topics.tsx'),
    route('topics/:topic', 'routes/topic.tsx'),
    route('topics/:topic/:subtopic', 'routes/subtopic.tsx'),
    // App screens, served from the app shell
    route('today', 'routes/today.tsx'),
    route('practice/:topic/:subtopic', 'routes/practice.tsx'),
  ]),
] satisfies RouteConfig;
