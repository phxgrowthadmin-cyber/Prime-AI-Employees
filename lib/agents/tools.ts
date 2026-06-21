import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { IntegrationProvider } from '@prisma/client';

export const gmailSendEmail = tool(
  async (input: { to: string; subject: string; body: string }) => {
    // TODO: Implement Gmail API integration
    return `Email would be sent to ${input.to}: ${input.subject}`;
  },
  {
    name: 'gmail_send_email',
    description: 'Send an email using Gmail',
    schema: z.object({
      to: z.string().email(),
      subject: z.string(),
      body: z.string(),
    }),
  }
);

export const slackMessage = tool(
  async (input: { channel: string; message: string }) => {
    // TODO: Implement Slack API integration
    return `Slack message would be sent to ${input.channel}: ${input.message}`;
  },
  {
    name: 'slack_send_message',
    description: 'Send a message to Slack',
    schema: z.object({
      channel: z.string(),
      message: z.string(),
    }),
  }
);

export const webSearch = tool(
  async (input: { query: string }) => {
    // TODO: Implement Tavily web search
    return `Search results for: ${input.query}`;
  },
  {
    name: 'web_search',
    description: 'Search the web for information',
    schema: z.object({
      query: z.string(),
    }),
  }
);

export function getToolsForIntegrations(
  integrationProviders: IntegrationProvider[]
) {
  const tools = [];

  integrationProviders.forEach((provider) => {
    switch (provider) {
      case 'GOOGLE_WORKSPACE':
        tools.push(gmailSendEmail);
        break;
      case 'SLACK':
        tools.push(slackMessage);
        break;
      // Add more tools as needed
    }
  });

  // Always add web search
  tools.push(webSearch);

  return tools;
}
