// src/services/sub.service.ts
import { ObjectId } from "bson";
import {
  drop,
  filter,
  find,
  isNil,
  map,
  orderBy,
  partition,
  pick,
  pipe,
  pluck,
  reject,
  size,
  take,
  uniq
} from "lodash/fp.js";
import sift from "sift";
import { toJSONOptions } from "../mrq.config.js";
import { useSession } from "../utils/mongoose.utils.js";
import { httpErrors } from "@fastify/sensible";
import {
  IMPLICIT_DELETE_ALL_NOT_ALLOWED,
  NO_SUBITEM_FOUND,
  SUBITEM_NOT_FOUND
} from "../mrq.errors.js";
async function getByQuery({
  query,
  subarray
}) {
  return pipe(
    filter(sift(query.filter)),
    query.sort.sortFieldsArr.length ? orderBy(query.sort.sortFieldsArr, query.sort.sortOrderArr) : (x) => x,
    drop(query.skip),
    take(query.limit),
    map(query.select.length > 1 ? pick(query.select) : (x) => x)
  )(subarray);
}
async function count({
  query,
  subarray
}) {
  return pipe(filter(sift(query.filter)), size)(subarray);
}
async function distinct({
  query,
  path,
  subarray
}) {
  return pipe(
    filter(sift(query.filter)),
    pluck(path),
    uniq,
    reject(isNil)
  )(subarray);
}
async function create({
  body,
  doc,
  Model,
  req,
  subarray
}) {
  const _prev = doc.toJSON(toJSONOptions);
  const idsMap = body.map((item) => (item._id = item._id ?? new ObjectId(), item)).reduce((acc, v) => ({ ...acc, [v._id]: true }), {});
  for (const item of body) subarray.push(item);
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  const subarraySaved = subarray.map((subitem) => subitem.toJSON(toJSONOptions));
  const query = req.query;
  const shouldReturnAll = query.returnAll === "true";
  if (shouldReturnAll) return subarraySaved;
  return subarraySaved.filter((subitem) => idsMap[subitem._id]);
}
async function updateMany({
  body,
  doc,
  Model,
  req,
  subarray
}) {
  const _prev = doc.toJSON(toJSONOptions);
  const bodyIdsMap = body.reduce(
    (acc, v) => ({ ...acc, [v._id]: true }),
    {}
  );
  const [subitemsToUpdate, subitemsToNotUpdate] = partition(
    (subitem) => bodyIdsMap[subitem._id],
    subarray
  );
  for (const item of body) {
    const subitem = subarray.id(item._id);
    if (!subitem) continue;
    subitem.set(item);
  }
  if (req.routeOptions.url?.endsWith?.("/overwrite"))
    for (const subitem of subitemsToNotUpdate) subitem.deleteOne();
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  const query = req.query;
  const shouldReturnAll = query.returnAll === "true";
  return shouldReturnAll ? subarray.map((subitem) => subitem.toJSON(toJSONOptions)) : subitemsToUpdate.map((subitem) => subitem.toJSON(toJSONOptions));
}
async function deleteByQuery({
  doc,
  query,
  Model,
  req,
  subarray
}) {
  const isDeleteAll = !Object.keys(query.filter).length;
  if (isDeleteAll)
    throw httpErrors.methodNotAllowed(IMPLICIT_DELETE_ALL_NOT_ALLOWED);
  const subarrayToDelete = filter(
    sift(query.filter),
    subarray
  );
  if (subarrayToDelete.length === 0) throw httpErrors.notFound(NO_SUBITEM_FOUND);
  const _prev = doc.toJSON(toJSONOptions);
  for (const subitem of subarrayToDelete) subitem.deleteOne();
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  return subarray.map((subitem) => subitem.toJSON(toJSONOptions));
}
async function getById({
  query,
  subarray,
  subId
}) {
  const subitem = pipe(
    find((subitem2) => subitem2._id.equals(subId)),
    query.select.length > 1 ? pick(query.select) : (x) => x
  )(subarray);
  if (!subitem || !Object.keys(subitem).length)
    throw httpErrors.notFound(SUBITEM_NOT_FOUND);
  return subitem;
}
async function updateById({
  body,
  doc,
  Model,
  req,
  subarray,
  subId
}) {
  const _prev = doc.toJSON(toJSONOptions);
  const subitem = subarray.id(subId);
  if (!subitem) throw httpErrors.notFound(SUBITEM_NOT_FOUND);
  if (req.routeOptions.url?.endsWith?.("/overwrite")) subitem.overwrite(body);
  else subitem.set(body);
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  const query = req.query;
  const shouldReturnAll = query.returnAll === "true";
  return shouldReturnAll ? subarray.map((subitem2) => subitem2.toJSON(toJSONOptions)) : subitem.toJSON(toJSONOptions);
}
async function deleteById({
  doc,
  Model,
  req,
  subarray,
  subId
}) {
  const _prev = doc.toJSON(toJSONOptions);
  const subitem = subarray.id(subId);
  if (!subitem) throw httpErrors.notFound(SUBITEM_NOT_FOUND);
  subitem.deleteOne();
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  return subarray.map((subitem2) => subitem2.toJSON(toJSONOptions));
}
export {
  count,
  create,
  deleteById,
  deleteByQuery,
  distinct,
  getById,
  getByQuery,
  updateById,
  updateMany
};
//# sourceMappingURL=sub.service.js.map
