import { isObjectLike } from "lodash";

const symbolTag = "[object Symbol]";

function isSymbol(value) {
  return (
    typeof value === "symbol" ||
    (isObjectLike(value) && baseGetTag(value) === symbolTag)
  );
}
