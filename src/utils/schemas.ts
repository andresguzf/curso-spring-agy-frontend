import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria'),
});

export const registerSchema = z.object({
  email: z.email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  roles: z.string().optional(),
});

export const customerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener entre 2 and 50 caracteres')
    .max(50, 'El nombre debe tener entre 2 and 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener entre 2 and 50 caracteres')
    .max(50, 'El apellido debe tener entre 2 and 50 caracteres'),
  email: z.email('Formato de correo electrónico inválido'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const userCreateSchema = z.object({
  email: z.email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  roles: z.string().optional(),
});

export const userUpdateSchema = z.object({
  email: z.email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    }),
  roles: z.string().optional(),
});
