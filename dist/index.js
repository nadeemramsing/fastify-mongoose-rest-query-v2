// src/index.ts
import { assignModelsHook } from "./hooks/assign-models.hook.js";
import { closeConnections } from "./utils/db.utils.js";
import { mainRoute } from "./routes/main.route.js";
export * from "./mrq.errors.js";
export * from "./mrq.interfaces.js";
export * from "./mrq.enum.js";
export * from "./utils/db.utils.js";
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
