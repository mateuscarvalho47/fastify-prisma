import type { FastifyReply, FastifyRequest } from 'fastify';
import { parse } from '../../lib/validate.js';
import { UnauthorizedError } from '../../lib/errors.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import type { AuthService } from './auth.service.js';
import type { UserService } from '../user/user.service.js';

export class AuthController {
  constructor(
    private auth: AuthService,
    private userService: UserService,
  ) {}

  register = async (req: FastifyRequest, reply: FastifyReply) => {
    const input = parse(registerSchema, req.body);
    const user = await this.auth.register(input);
    return reply.code(201).send(user);
  };

  login = async (req: FastifyRequest, reply: FastifyReply) => {
    const input = parse(loginSchema, req.body);
    const user = await this.auth.login(input);
    req.session.userId = user.id;
    return reply.send({ user });
  };

  logout = async (req: FastifyRequest, reply: FastifyReply) => {
    await req.session.destroy();
    return reply.code(204).send();
  };

  me = async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.session.userId) throw new UnauthorizedError();
    const user = await this.userService.getById(req.session.userId);
    return user;
  };
}