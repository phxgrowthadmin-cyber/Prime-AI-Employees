import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const tasksRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Fetch tasks for organization
    return [];
  }),

  create: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Create and execute task
      return { id: 'temp', ...input, status: 'PENDING' };
    }),

  getHistory: protectedProcedure
    .input(z.object({ agentId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      // TODO: Get task history
      return [];
    }),
});
