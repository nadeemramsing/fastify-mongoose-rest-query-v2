import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Static } from "@sinclair/typebox";
export declare const HealthResponse: import("@sinclair/typebox").TObject<{
    status: import("@sinclair/typebox").TString;
}>;
export type HealthResponseType = Static<typeof HealthResponse>;
export default function (fastify: FastifyInstance, _opts: FastifyPluginOptions): Promise<void>;
