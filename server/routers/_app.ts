import { router } from '../trpc';
import { agentsRouter } from './agents';
import { tasksRouter } from './tasks';
import { integrationsRouter } from './integrations';
import { subscriptionRouter } from './subscription';

export const appRouter = router({
  agents: agentsRouter,
  tasks: tasksRouter,
  integrations: integrationsRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
