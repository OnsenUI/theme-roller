class Cache {
  constructor() {
    this.cache = {};
  }

  has(id) {
    return Object.hasOwnProperty.call(this.cache, id) || window.localStorage.getItem(id) !== null;
  }

  get(id) {
    return this.cache[id] || window.localStorage.getItem(id);
  }

  set(id, value, persist = false) {
    if (persist) {
      window.localStorage.setItem(id, value);
    } else {
      this.cache[id] = value;
    }
    return value;
  }

  remove(id) {
    window.localStorage.removeItem(id);
    delete this.cache[id];
  }
}

export default new Cache();
