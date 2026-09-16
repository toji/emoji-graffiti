/**
 * Provides a simple way to get values from the query string if they're present
 * and use a default value if not.
 *
 * Example:
 * For the URL http://example.com/index.html?particleCount=1000
 *
 * QueryArgs.getInt("particleCount", 100); // URL overrides, returns 1000
 * QueryArgs.getInt("particleSize", 10); // Not in URL, returns default of 10
 */

let searchParams: URLSearchParams | undefined = undefined;
function clearArgsCache() {
  // Force re-parsing on next access
  searchParams = undefined;
}
window.addEventListener('popstate', clearArgsCache);
window.addEventListener('hashchange', clearArgsCache);

function ensureArgsCached() {
  if (!searchParams) {
    searchParams = new URLSearchParams(window.location.search);
  }
}

export class QueryArgs {
  static hasQueryArgs(): boolean {
    ensureArgsCached();
    return searchParams!.size != 0;
  }

  static getString(name: string, defaultValue?: string): string {
    ensureArgsCached();
    return searchParams!.get(name) ?? (defaultValue ?? '');
  }

  static getInt(name: string, defaultValue?: number): number {
    ensureArgsCached();
    return searchParams!.has(name) ? parseInt(searchParams!.get(name)!, 10) : defaultValue ?? 0;
  }

  static getFloat(name: string, defaultValue?: number): number {
    ensureArgsCached();
    return searchParams!.has(name) ? parseFloat(searchParams!.get(name)!) : defaultValue ?? 0.0;
  }

  static getBool(name: string, defaultValue?: boolean): boolean {
    ensureArgsCached();
    return searchParams!.has(name) ? parseInt(searchParams!.get(name)!, 10) != 0 : defaultValue ?? false;
  }
}
