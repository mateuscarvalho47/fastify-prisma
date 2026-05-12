import { z } from 'zod';
import { registerSchema, loginSchema } from './auth.schema.js';
import { FastifyInstance } from 'fastify';
import { UserRepository } from '../user/user.repository.js';
import { UserService } from '../user/user.service.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

const userResponse = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
});

export async function authRoutes(app: FastifyInstance) {
  const userRepo = new UserRepository(app.prisma);
  const userService = new UserService(userRepo);
  const authService = new AuthService(userRepo);
  const controller = new AuthController(authService, userService);

  app.post('/auth/register', {
    schema: {
      tags: ['auth'],
      summary: 'Registrar usuário',
      body: registerSchema,
      response: { 201: userResponse },
    },
    handler: controller.register,
  });

  app.post('/auth/login', {
    schema: {
      tags: ['auth'],
      summary: 'Login',
      body: loginSchema,
      response: {
        200: z.object({ user: z.object({ id: z.string(), email: z.string() }) }),
      },
    },
    handler: controller.login,
  });

  app.post('/auth/logout', {
    schema: { tags: ['auth'], summary: 'Logout', response: { 204: z.null() } },
    handler: controller.logout,
  });

  app.get('/auth/me', {
    schema: {
      tags: ['auth'],
      summary: 'Usuário atual',
      security: [{ sessionCookie: [] }],
      response: { 200: userResponse },
    },
    handler: controller.me,
  });
}