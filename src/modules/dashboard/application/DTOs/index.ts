import z from 'zod';

const dashboardAnalyticsSchema = z.object({
  accountIds: z.array(z.string()).optional().default([]),
});

type DashboardAnalyticsDTO = z.infer<typeof dashboardAnalyticsSchema>;

export { dashboardAnalyticsSchema, type DashboardAnalyticsDTO };
