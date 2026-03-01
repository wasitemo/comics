const sanitizeBody = (body) => {
  if (!body) {
    return body;
  }

  const cloned = { ...body };

  if (cloned.password) {
    cloned.password = "*******";
  }

  if (cloned.token) {
    cloned.token = "********";
  }

  return cloned;
};
