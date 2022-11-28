class IndexedMap<K, V> extends Map<K, V> {
  /**
   * Get the key of a record by its index.
   *
   * @example ```ts
   * const map = new IndexedMap<string, number>();
   * map.set('a', 1);
   * map.set('b', 3);
   * map.set('c', 3);
   * map.set('b', 2);
   * console.log(map.getKeyByIndex(1); // 'b'
   * ```
   */
  getKeyByIndex(index: number): K | undefined {
    return [...this.keys()][index];
  }

  /**
   * Get the index of a record by its key.
   *
   * @example ```ts
   * const map = new IndexedMap<string, number>();
   * map.set('a', 1);
   * map.set('b', 3);
   * map.set('c', 3);
   * map.set('b', 2);
   * console.log(map.getIndexByKey('b')); // 1
   * ```
   */
  getIndexByKey(key: K): number | undefined {
    return [...this.keys()].findIndex((el) => el === key);
  }

  /**
   * Get the value of a record by its index.
   *
   * @example ```ts
   * const map = new IndexedMap<string, number>();
   * map.set('a', 1);
   * map.set('b', 3);
   * map.set('c', 3);
   * map.set('b', 2);
   * console.log(map.getValueByIndex(1)); // 2
   * ```
   */
  getValueByIndex(index: number): V | undefined {
    return [...this.values()][index];
  }

  /**
   * Get the value of a record by its index.
   *
   * @example ```ts
   * const map = new IndexedMap<string, number>();
   * map.set('a', 1);
   * map.set('b', 3);
   * map.set('c', 3);
   * console.log(map.setValueByIndex(1, 2)); // IndexedMap {'a' => 1, 'b' => 2, 'c' => 3}
   * ```
   */
  setValueByIndex(index: number, value: V): this {
    const key = this.getKeyByIndex(index);
    if (key) {
      return this.set(key, value);
    }
    return this;
  }
}

export default IndexedMap;
