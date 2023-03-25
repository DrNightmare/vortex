import * as vscode from "vscode";

export class Logger {
  private static instance?: Logger;
  private logOutputChannel: vscode.LogOutputChannel;

  private constructor() {
    this.logOutputChannel = vscode.window.createOutputChannel("Vortex", {
      log: true,
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(message: string): void {
    this.logOutputChannel.appendLine(message);
  }

  public info(message: string): void {
    this.logOutputChannel.info(message);
  }

  public debug(message: string): void {
    this.logOutputChannel.debug(message);
  }

  public error(message: string): void {
    this.logOutputChannel.error(message);
  }
}
