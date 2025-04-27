// src/hooks/assign-models.hook.ts
import { getDB } from "../utils/db.utils..js";
var assignModelsHook = (app, opts) => {
  if (!app.hasRequestDecorator("models")) {
    app.decorateRequest("models", null);
  }
  if (!app.hasRequestDecorator("x-client-mongodb-path")) {
    app.decorateRequest("x-client-mongodb-path", "");
  }
  return async (req, rep) => {
    req.mongoose_conn = await getDB(
      app,
      req["x-client-mongodb-path"],
      opts.schemas
    );
  };
};
export {
  assignModelsHook
};
//# sourceMappingURL=assign-models.hook.js.map
