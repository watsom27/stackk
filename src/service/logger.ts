export class Logger {
    public static log(...args: any[]): void {
        window.console.log(...args);
    }

    public static error(...args: any[]): void {
        window.console.error(...args);
    }
}
