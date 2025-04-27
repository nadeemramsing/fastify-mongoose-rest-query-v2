import { Type } from "@sinclair/typebox";
export const HealthResponse = Type.Object({
    status: Type.String(),
});
export default async function (fastify, _opts) {
    fastify.get("/health", async (_request, _reply) => {
        return { status: "ok" };
    });
}
