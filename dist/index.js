import { assignModelsHook } from "./hooks/assign-models.hook";
import { closeConnections } from "./utils/db.utils";
import { mainRoute } from "./routes/main.route";
export * from "./mrq.errors";
export * from "./mrq.interfaces";
export * from "./mrq.enum";
export * from "./utils/db.utils";
const restify = (opts) => async (app) => {
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
