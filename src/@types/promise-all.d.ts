declare module 'promise-all' {
  export default function promiseAll<T>(
    promises: Record<string, Promise<T>>
  ): Promise<Record<string, T>>
}
