const parseCookies = (req, res, next) => {
  const retObj = {};
  if (req.headers.cookie) {
    req.headers.cookie.split('; ').forEach(cookie => {
      const [name, value] = cookie.split('=');
      retObj[name] = value;
    });
  }

  req.cookies = retObj;
  next();
};

module.exports = parseCookies;