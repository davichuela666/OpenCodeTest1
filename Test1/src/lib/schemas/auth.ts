import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['freelancer', 'production_company']),
  first_name: z.string().min(1, 'Este campo es obligatorio'),
  last_name: z.string().optional(),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
  specialty: z.enum(['camera', 'sound', 'lighting', 'other']).optional(),
  tax_id: z.string().optional(),
  contact_name: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'freelancer') {
    if (!data.specialty) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La especialidad es obligatoria para autónomos',
        path: ['specialty'],
      });
    }
  }
  if (data.role === 'production_company') {
    if (!data.tax_id || data.tax_id.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El CIF es obligatorio',
        path: ['tax_id'],
      });
    }
    if (!data.contact_name || data.contact_name.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El nombre del contacto principal es obligatorio',
        path: ['contact_name'],
      });
    }
  }
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(1, 'Por favor, introduce tu contraseña'),
  role: z.enum(['freelancer', 'production_company']),
});

export type LoginFormData = z.infer<typeof loginSchema>;
