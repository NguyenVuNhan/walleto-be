const pick = <T extends Object, K extends keyof T>(obj: T, allowed: K[]) =>
  Object.keys(obj)
    .filter((key) => allowed.includes(<K>key))
    .reduce((o, key) => {
      o[key] = obj[key];
      return o;
    }, {});

export default pick;
