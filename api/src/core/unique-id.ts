import { TypeID, typeid } from "typeid-js";

export const PREFIXES = {
  user: "usr",
  thread: "thr",
  message: "msg",
  upload: "upl",
  attachment: "att",
  limit: "lim",
  plan: "pln",
  subscription: "sub",
  product: "prd",
  price: "prc",
  newSubscription: "nws",
  customer: "cst",
  feedbacks: "fdb",
  terms: "trm",
} as const;

export function generateUniqueId(prefixKey: keyof typeof PREFIXES) {
  const prefix = PREFIXES[prefixKey];

  return typeid(prefix).toString();
}

export function parseUniqueId(id: string): {
  prefix: string;
  id: string;
} {
  const typeId = TypeID.fromString(id);

  return {
    prefix: typeId.getType(),
    id: typeId.getSuffix(),
  };
}
