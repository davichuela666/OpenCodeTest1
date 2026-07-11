import { z } from 'zod';

// --- REGISTRO ---

// Esquema de validación para el formulario de registro
export const registerSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['autonomo', 'productora']),
  first_name: z.string().min(1, 'El nombre es obligatorio'),
  last_name: z.string().min(1, 'Los apellidos son obligatorios'),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
  specialty: z.enum(['camara', 'sonido', 'luces', 'otro']).optional(),
}).refine((data) => {
  // Si el rol es 'autonomo', la especialidad es obligatoria
  if (data.role === 'autonomo' && !data.specialty) {
    return false;
  }
  return true;
}, {
  message: "La especialidad es obligatoria para autónomos",
  path: ["specialty"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// --- LOGIN ---

// Esquema de validación para el formulario de login
export const loginSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(1, 'Por favor, introduce tu contraseña'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
