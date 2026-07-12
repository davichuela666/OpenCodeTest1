import { z } from 'zod';

export const profileSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
  country: z.string(),
  bio: z.string().optional(),
  experience_years: z.string().optional(),
  portfolio_urls: z.string().optional(),
  social_instagram: z.string().optional(),
  social_youtube: z.string().optional(),
  social_linkedin: z.string().optional(),
  social_vimeo: z.string().optional(),
  notes: z.string().optional(),
  availability_status: z.enum(['available', 'busy', 'working', 'vacation']),
  hourly_rate: z.string().optional(),
  daily_rate: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
