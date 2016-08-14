
declare module 'fs' {
    var fs: FileSystem;
    export = fs;
}

declare module 'system' {
    interface System2 extends System
    {
        stdin: any;
        stdout: any;
    }
    var sys: System2;
    export = sys;
}