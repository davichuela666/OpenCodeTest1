import { z } from 'zod';

const activityEnum = z.enum(['Film', 'Television', 'Streaming Platform', 'Sports', 'Events', 'Other']);
const projectStatusEnum = z.enum(['Planned', 'In Progress', 'Completed', 'Archived']);
const vacancyStatusEnum = z.enum(['Planned', 'Assigned', 'Archived']);
const specialtyEnum = z.enum(['camera', 'sound', 'lighting', 'other']);

export const projectFormSchema = z.object({
  name: z.string().min(1, 'El nombre del proyecto es obligatorio'),
  start_date: z.string().min(1, 'La fecha de inicio es obligatoria'),
  end_date: z.string().optional(),
  activity: activityEnum,
  status: projectStatusEnum,
  contact_id: z.string().uuid().optional().nullable(),
});

export const vacancyFormSchema = z.object({
  name: z.string().min(1, 'El nombre de la vacante es obligatorio'),
  specialty: specialtyEnum,
  rate: z.string().min(1, 'La tarifa es obligatoria'),
  start_date: z.string().min(1, 'La fecha de inicio es obligatoria'),
  end_date: z.string().min(1, 'La fecha de fin es obligatoria'),
  status: vacancyStatusEnum,
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
export type VacancyFormData = z.infer<typeof vacancyFormSchema>;
