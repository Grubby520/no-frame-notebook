import isObjectLike from "./isObjectLike";
import baseGetTag from "./_objectToString";

const symbolTag = "[object Symbol]";

function isSymbol(value) {
  return (
    typeof value === "symbol" ||
    (isObjectLike(value) && baseGetTag(value) === symbolTag)
  );
}
