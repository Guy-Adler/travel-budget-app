class IndexedMap<K, V> extends Map<K, V> {
  getKeyByIndex(index: number): K | undefined {
    return [...this.keys()][index];
  }

  getIndexByKey(key: K): number | undefined {
    return [...this.keys()].findIndex((el) => el === key);
  }

  getValueByIndex(index: number): V | undefined {
    return [...this.values()][index];
  }

  setValueByIndex(index: number, value: V): void {
    const key = this.getKeyByIndex(index);
    if (key) {
      this.set(key, value);
    }
  }
}

export default IndexedMap;
