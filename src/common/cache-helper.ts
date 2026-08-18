/**
 * CacheHelper is a utility class that caches groups of values under a single cache key.
 */

interface MultiCacheValue {
  [x: string]: object | string | ArrayBuffer | Blob
}

interface MultiCacheEntry {
  type: 'arrayBuffer' | 'blob' | 'literal',
  url?: string,
  value?: object | string
}

export class CacheHelper {
  constructor (public cache: Cache) {}

  setMulti(url: string, values: MultiCacheValue) {
    const description: {[key: string]: MultiCacheEntry} = {};

    for (const key in values) {
      const value = values[key];
      const valueUrl = `${url}__${key}__`;
      if (value instanceof ArrayBuffer) {
        this.cache.put(valueUrl, new Response(value));
        description[key] = { type: 'arrayBuffer', url: valueUrl };
      } else if (value instanceof Blob) {
        this.cache.put(valueUrl, new Response(value));
        description[key] = { type: 'blob', url: valueUrl };
      } else {
        description[key] = { type: 'literal', value };
      }
    }

    this.cache.put(url, new Response(JSON.stringify(description)));
  }

  async getMulti(url: string): Promise<MultiCacheValue|null> {
    const response = await this.cache.match(url);
    if (!response) { return null; }

    const description = await response.json();
    const values: MultiCacheValue = {};

    for (const key in description) {
      const entry: MultiCacheEntry = description[key];

      if (entry.type == 'literal') {
        values[key] = entry.value!;
      } else {
        const valueResponse = await this.cache.match(entry.url!);
        if (!valueResponse) {
          // This indicates something has gotten corrupted, as we don't have
          // the full cache values available any more. Clear the entry.
          // TODO: Clear all value entries too.
          this.cache.delete(url);
          return null;
        }

        values[key] = await valueResponse[entry.type]();
      }
    }

    return values;
  }
}