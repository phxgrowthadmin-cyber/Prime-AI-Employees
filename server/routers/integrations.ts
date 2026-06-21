import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { TRPCError } from '@trpc/server';
import { IntegrationProvider } from '@prisma/client';

export const integrationsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const integrations = await prisma.integration.findMany({
      where: { organizationId: ctx.orgId },
      select: {
        id: true,
        provider: true,
        name: true,
        displayName: true,
        isActive: true,
        lastSyncAt: true,
        lastError: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return integrations;
  }),

  create: protectedProcedure
    .input(
      z.object({
        provider: z.nativeEnum(IntegrationProvider),
        name: z.string().min(1).max(100),
        displayName: z.string().max(100).optional(),
        accessToken: z.string().optional(),
        refreshToken: z.string().optional(),
        config: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) throw new TRPCError({ code: 'UNAUTHORIZED' });

      // Check if already connected
      const existing = await prisma.integration.findUnique({
        where: {
          organizationId_provider: {
            organizationId: ctx.orgId,
            provider: input.provider,
          },
        },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `${input.provider} is already connected`,
        });
      }

      const integration = await prisma.integration.create({
        data: {
          organizationId: ctx.orgId,
          provider: input.provider,
          name: input.name,
          displayName: input.displayName || input.name,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          config: input.config ? JSON.stringify(input.config) : null,
          isActive: true,
        },
      });

      return integration;
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const integration = await prisma.integration.findUnique({
        where: { id: input.id },
      });

      if (!integration || integration.organizationId !== ctx.orgId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      // Don't expose tokens to client
      const { accessToken, refreshToken, ...safe } = integration;
      return safe;
    }),

  disconnect: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const integration = await prisma.integration.findUnique({
        where: { id: input.id },
      });

      if (!integration || integration.organizationId !== ctx.orgId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await prisma.integration.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isActive: z.boolean().optional(),
        lastError: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const integration = await prisma.integration.findUnique({
        where: { id: input.id },
      });

      if (!integration || integration.organizationId !== ctx.orgId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const updated = await prisma.integration.update({
        where: { id: input.id },
        data: {
          isActive: input.isActive ?? integration.isActive,
          lastError: input.lastError,
          lastSyncAt: new Date(),
        },
      });

      return updated;
    }),

  getAvailable: protectedProcedure.query(async () => {
    // Return all available integrations for user to connect
    const providers = Object.values(IntegrationProvider);
    return providers.map((provider) => ({
      provider,
      displayName: provider.replace(/_/g, ' '),
      icon: `${provider.toLowerCase()}`,
      description: `Connect to ${provider.replace(/_/g, ' ')}`,
    }));
  }),
});
