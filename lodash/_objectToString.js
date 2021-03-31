const objectProto = Object.prototype;
const nativeObjectToString = objectProto.toString;

function objectToString(value) {
  return nativeObjectToString.call(value);
}

export default objectToString;
