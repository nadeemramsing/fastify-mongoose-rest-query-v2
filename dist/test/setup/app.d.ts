import { FastifyInstance } from 'fastify';
declare const defaultOptions: {
    logger: boolean;
    ignoreTrailingSlash: boolean;
};
declare function buildApp(options: Partial<typeof defaultOptions> | undefined, uri: string): Promise<FastifyInstance<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>>;
export { buildApp };
