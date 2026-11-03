import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z
    .string()
    .email("Format d'email invalide")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Format d'email invalide")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire"),
});