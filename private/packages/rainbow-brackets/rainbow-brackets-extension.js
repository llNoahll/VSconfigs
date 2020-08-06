/*
 * author: 2gua.
 */
'use strict';
var vscode = require('vscode');
function activate(context) {
    var BracketsColor = ["#4f97d7", "#bc6ec5", "#2d9574", "#67b11d", "#b1951d", "#4f97d7", "#bc6ec5", "#2d9574", "9cb6ad"];
    var BracketsDecorationTypes = [];
    for (var index in BracketsColor) {
        BracketsDecorationTypes.push(vscode.window.createTextEditorDecorationType({
            color: BracketsColor[index]
        }));
    }
    var isolatedRightBracketsDecorationTypes = vscode.window.createTextEditorDecorationType({
        color: "#e2041b"
    });
    var activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        rainbowBrackets();
    }
    vscode.window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            rainbowBrackets();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document) {
            rainbowBrackets();
        }
    }, null, context.subscriptions);
    function rainbowBrackets() {
        if (!activeEditor) {
            return;
        }
        var text = activeEditor.document.getText();
        var regEx = /[\(\)\[\]\{\}]/g;
        var match;
        var BracketsColorCount = 0;
        var leftRoundBracketsStack = [];
        var leftSquareBracketsStack = [];
        var leftSquigglyBracketsStack = [];
        var BracketsDecorationTypeMap = {};
        for (var index in BracketsDecorationTypes) {
            BracketsDecorationTypeMap[index] = [];
        }
        ;
        var rightBracketsDecorationTypes = [];
        var roundCalculate;
        var squareCalculate;
        var squigglyCalculate;
        while (match = regEx.exec(text)) {
            var startPos = activeEditor.document.positionAt(match.index);
            var endPos = activeEditor.document.positionAt(match.index + 1);
            var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: null };
            switch (match[0]) {
                case '(':
                    roundCalculate = BracketsColorCount;
                    leftRoundBracketsStack.push(roundCalculate);
                    BracketsColorCount++;
                    if (BracketsColorCount >= BracketsColor.length) {
                        BracketsColorCount = 0;
                    }
                    BracketsDecorationTypeMap[roundCalculate].push(decoration);
                    break;
                case ')':
                    if (leftRoundBracketsStack.length > 0) {
                        roundCalculate = leftRoundBracketsStack.pop();
                        BracketsColorCount = roundCalculate;
                        BracketsDecorationTypeMap[roundCalculate].push(decoration);
                    }
                    else {
                        rightBracketsDecorationTypes.push(decoration);
                    }
                    break;
                case '[':
                    squareCalculate = BracketsColorCount;
                    leftSquareBracketsStack.push(squareCalculate);
                    BracketsColorCount++;
                    if (BracketsColorCount >= BracketsColor.length) {
                        BracketsColorCount = 0;
                    }
                    BracketsDecorationTypeMap[squareCalculate].push(decoration);
                    break;
                case ']':
                    if (leftSquareBracketsStack.length > 0) {
                        squareCalculate = leftSquareBracketsStack.pop();
                        BracketsColorCount = squareCalculate;
                        BracketsDecorationTypeMap[squareCalculate].push(decoration);
                    }
                    else {
                        rightBracketsDecorationTypes.push(decoration);
                    }
                    break;
                case '{':
                    squigglyCalculate = BracketsColorCount;
                    leftSquigglyBracketsStack.push(squigglyCalculate);
                    BracketsColorCount++;
                    if (BracketsColorCount >= BracketsColor.length) {
                        BracketsColorCount = 0;
                    }
                    BracketsDecorationTypeMap[squigglyCalculate].push(decoration);
                    break;
                case '}':
                    if (leftSquigglyBracketsStack.length > 0) {
                        squigglyCalculate = leftSquigglyBracketsStack.pop();
                        BracketsColorCount = squigglyCalculate;
                        BracketsDecorationTypeMap[squigglyCalculate].push(decoration);
                    }
                    else {
                        rightBracketsDecorationTypes.push(decoration);
                    }
                    break;
                default:
            }
        }
        for (var index in BracketsDecorationTypes) {
            activeEditor.setDecorations(BracketsDecorationTypes[index], BracketsDecorationTypeMap[index]);
        }
        activeEditor.setDecorations(isolatedRightBracketsDecorationTypes, rightBracketsDecorationTypes);
    }
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map