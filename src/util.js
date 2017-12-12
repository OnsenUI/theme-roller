export default {
  toLabel: string => string
    .replace(/-/g, ' ')
    .toLowerCase()
    .replace('color', '')
    .trim()
    .replace(/^([a-z])/, m => m.toUpperCase()),

  toId: string => string
    .replace(/\s+/, '-')
    .toLowerCase(),
};
