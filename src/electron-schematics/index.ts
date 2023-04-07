import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {addPackageJsonDependency, NodeDependency, NodeDependencyType} from 'schematics-utilities';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
/*export function electronSchematics(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}*/
export function electronSchematics(): Rule {

	return (host: Tree, context: SchematicContext) => {
		const dependencies: NodeDependency[] = [
			{type: NodeDependencyType.Dev, version: '^1.6.10', name: '@types/electron'},
			{type: NodeDependencyType.Default, version: '^24.0.0', name: 'electron'},
		];

		dependencies.forEach(dependency => {
			addPackageJsonDependency(host, dependency);
			context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
		});
		context.addTask(new NodePackageInstallTask());
		context.logger.log('info', `🔍 Installing packages...`);
		host.create("main.js", `

const {app, BrowserWindow} = require('electron')
const url = require("url");
const path = require("path");

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL('http://localhost:4200');
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
`);

		context.logger.log('info', `🔍 Created Electron main.js`);

		return host;
	};

}