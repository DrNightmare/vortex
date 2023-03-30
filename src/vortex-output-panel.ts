import * as vscode from "vscode";

export class VortexOutputPanel {
  private static instance: VortexOutputPanel;
  private panel: vscode.WebviewPanel;

  private constructor() {
    this.panel = vscode.window.createWebviewPanel(
      "vortexOutput",
      "Vortex",
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );
  }

  private getInitHtml() {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vortex</title>
    </head>
    
    <body>
        <h2>Vortex output</h2>
        <span id='main-content' style="white-space: pre-wrap"></span>
        <script>
            const mainContent = document.getElementById('main-content');
            // Handle the message inside the webview
            window.addEventListener('message', event => {
    
                const message = event.data; // The JSON data our extension sent
    
                switch (message.command) {
                    case 'set':
                        mainContent.textContent = message.data;
                        break;
                    case 'append':
                        mainContent.textContent += message.data;
                        break;
                }
            });
        </script>
    </body>
    
    </html>`;
  }

  public static getInstance(): VortexOutputPanel {
    if (!VortexOutputPanel.instance) {
      VortexOutputPanel.instance = new VortexOutputPanel();
    }
    VortexOutputPanel.instance.panel.webview.html =
      VortexOutputPanel.instance.getInitHtml();
    return VortexOutputPanel.instance;
  }

  public static setContent(content: string) {
    this.getInstance();
    this.instance.panel.webview.postMessage({ command: "set", data: content });
  }

  public static appendContent(content: string) {
    this.getInstance();
    this.instance.panel.webview.postMessage({
      command: "update",
      data: content,
    });
  }
}
