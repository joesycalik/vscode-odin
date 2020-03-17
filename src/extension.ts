import * as vscode from 'vscode';
import { userInfo } from 'os';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {

	console.log('decorator sample is activated');

	let timeout: NodeJS.Timer | undefined = undefined;

	const DecoType = vscode.window.createTextEditorDecorationType({
		light: {
			color: '#73D0FF'
		},
		dark: {
			color: '#73D0FF'
		}
	});

	let activeEditor = vscode.window.activeTextEditor;
	var userTypes = Array<String>();

	// TODO: Revisit - Very hacky at the moment
	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const regEx = /(\w+)\s*[:]\s*[:]\s*(struct|enum|distinct|union)/g; // Pattern -> TYPE :: struct | enum | distinct | union
		const text = activeEditor.document.getText();
		const userDefTypes: vscode.DecorationOptions[] = [];
		let match;
		while (match = regEx.exec(text)) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[1].length);
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'User Defined Type **' + match[1] + '**' };
			
			userDefTypes.push(decoration);
			userTypes.push(match[1]);
		}
		for (var i = userTypes.length; i > 0; i--){
			let str = userTypes.pop();
			let regExpType1 = new RegExp('[:]\\s*('+str+')[,]', "g"); // Pattern -> : TYPE,
			let regExpType2 = new RegExp('[(|\\[]\\s*('+str+')[)|\\]]', "g"); // Pattern -> (TYPE) | [TYPE]
			let regExpType3 = new RegExp('\\[.*\\]('+str+')', "g"); // Pattern -> [*]TYPE
			let regExpType4 = new RegExp('[:]\\s*('+str+')\\s*[=]', "g"); // Pattern -> : TYPE = 
			let regExTypes = Array<RegExp>();
			regExTypes.push(regExpType1);
			regExTypes.push(regExpType2);
			regExTypes.push(regExpType3);
			regExTypes.push(regExpType4);

			for (var j = regExTypes.length; j > 0; j--){
				let match;
				let reg = regExTypes.pop();
				if (reg){
					while (match = reg.exec(text)) {
						let mIndex = match.index;
						let tokenLength = match[1].length;
						let m1Index = match[0].indexOf(match[1]);
						const startPos = activeEditor.document.positionAt(mIndex + m1Index);
						const endPos = activeEditor.document.positionAt(mIndex + (m1Index + tokenLength));
						const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'User Defined Type **' + match[1] + '**' };
						userDefTypes.push(decoration);
						
					}
				}
			}
			
		}
		activeEditor.setDecorations(DecoType, userDefTypes);
	}

	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

}