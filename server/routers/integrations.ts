import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const integrationsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Fetch integrations for organization
    return [];
  }),

  connect: protectedProcedure
    .input(
      z.object({
        provider: z.string(),
        config: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Initialize OAuth flow or token storage
      return { provider: input.provider, isConnected: false };
    }),

  disconnect: protectedProcedure
    .input(z.object({ integrationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Disconnect integration
      return { id: input.integrationId };
    }),
});
