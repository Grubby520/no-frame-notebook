import deburr from "./deburr";
import words from "./words";
import arrayReduce from "./_arrayReduce";

const rsApos = "[\u2019]";
const reApos = new RegExp(rsApos, "g");
function createCompounder(cb) {
  return function (str) {
    return arrayReduce(words(deburr(str).replace(reApos, "")), cb, "");
  };
}

export default createCompounder;
