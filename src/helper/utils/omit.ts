const omit = <T extends Object, K extends keyof T>(obj: T, excluded: K[]) =>
  Object.keys(obj)
    .filter((key) => !excluded.includes(<K>key))
    .reduce((o, key) => {
      o[key] = obj[key];
      return o;
    }, {});

export default omit;
