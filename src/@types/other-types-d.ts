declare module 'promise-all' {
  export default function promiseAll<T>(
    promises: Record<string, Promise<T>>
  ): Promise<Record<string, T>>
}

declare module 'mongodb-query-parser' {
  export function parseFilter(filter: string): any
  export function parseSort(sort: string): any
  export function parseProject(project: string): any
}
