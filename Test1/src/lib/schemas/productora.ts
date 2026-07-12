import { z } from 'zod';

const activityEnum = z.enum(['Film', 'Television', 'Streaming Platform', 'Sports', 'Events', 'Other']);
const contactTypeEnum = z.enum(['Primary', 'Secondary', 'Other']);

export const companyProfileSchema = z.object({
  first_name: z.string().min(1, 'El nombre de la productora es obligatorio'),
  tax_id: z.string().min(1, 'El CIF es obligatorio'),
  activities: z.array(activityEnum).min(1, 'Selecciona al menos una actividad'),
});

export const contactFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('El email no es válido'),
  phone: z.string().optional(),
  office_hours_start: z.string().optional(),
  office_hours_end: z.string().optional(),
  type: contactTypeEnum,
});

export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
