// src/index.ts
import { assignModelsHook } from "./hooks/assign-models.hook.mjs";
import { closeConnections } from "./utils/db.utils.mjs";
import { mainRoute } from "./routes/main.route.mjs";
export * from "./mrq.errors.mjs";
export * from "./mrq.interfaces.mjs";
export * from "./mrq.enum.mjs";
export * from "./utils/db.utils.mjs";
var restify = (opts) => async (app) => {
  app.addHook("onRequest", assignModelsHook(app, opts));
  app.addHook(
    "onRoute",
    ({ url, method }) => app.log.info(`Endpoint created: ${url} ${method}`)
  );
  app.addHook("onClose", closeConnections);
  app.register(mainRoute(opts));
};
export {
  restify
};
//# sourceMappingURL=index.js.map
