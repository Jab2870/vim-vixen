import Key from './Key';

export default class KeySequence {
  constructor(
    public readonly keys: Key[],
  ) {
  }

  push(key: Key): number {
    return this.keys.push(key);
  }

  length(): number {
    return this.keys.length;
  }

  startsWith(o: KeySequence): boolean {
    if (this.keys.length < o.keys.length) {
      return false;
    }
    for (let i = 0; i < o.keys.length; ++i) {
      if (!this.keys[i].equals(o.keys[i])) {
        return false;
      }
    }
    return true;
  }

  static fromMapKeys(keys: string): KeySequence {
    const fromMapKeysRecursive = (
      remaining: string, mappedKeys: Key[],
    ): Key[] => {
      if (remaining.length === 0) {
        return mappedKeys;
      }

      let nextPos = 1;
      if (remaining.startsWith('<')) {
        let ltPos = remaining.indexOf('>');
        if (ltPos > 0) {
          nextPos = ltPos + 1;
        }
      }

      return fromMapKeysRecursive(
        remaining.slice(nextPos),
        mappedKeys.concat([Key.fromMapKey(remaining.slice(0, nextPos))])
      );
    };

    let data = fromMapKeysRecursive(keys, []);
    return new KeySequence(data);
  }
}
