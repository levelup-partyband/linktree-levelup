export const pub = (path: string): string =>
  import.meta.env.BASE_URL + path.replace(/^\//, '');
