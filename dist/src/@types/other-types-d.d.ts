declare module 'promise-all' {
    export default function promiseAll<T>(promises: Record<string, Promise<T>>): Promise<Record<string, T>>;
}
declare module 'mongodb-query-parser' {
    function parseFilter(filter: string): any;
    function parseSort(sort: string): any;
    function parseProject(project: string): any;
}
