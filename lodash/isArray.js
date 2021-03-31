import _objectToString from "./_objectToString";
const arrayTag = "[object Array]";

const isArray = Array.isArray;

if (!isArray) {
  isArray = function (value) {
    return _objectToString(value) === arrayTag;
  };
}

export default isArray;
