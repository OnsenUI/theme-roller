class Cache {
  constructor() {
    this.cache = {};
  }

  has(id) {
    return Object.hasOwnProperty.call(this.cache, id);
  }

  get(id) {
    return this.cache[id];
  }

  set(id, value) {
    this.cache[id] = value;
    return value;
  }
}

export default new Cache();
