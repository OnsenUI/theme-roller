class Cache {
  constructor() {
    this.cache = {};
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
