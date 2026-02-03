function success(data, message = "ok") {
  return { code: 0, message, data };
}
function error(message, code = -1) {
  return { code, message };
}

export { error as e, success as s };
//# sourceMappingURL=response.mjs.map
