import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Static, Type } from "@sinclair/typebox";

export const HealthResponse = Type.Object({
  status: Type.String(),
});

export type HealthResponseType = Static<typeof HealthResponse>;

export default async function (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
): Promise<void> {
  fastify.get<{ Reply: HealthResponseType }>(
    "/health",
    async (_request, _reply) => {
      return { status: "ok" };
    }
  );
}
