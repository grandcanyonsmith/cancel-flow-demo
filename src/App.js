"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_1 = require("react");
var CancelFlow_1 = require("./CancelFlow/CancelFlow");
function App() {
    return (<div className="min-h-screen bg-zinc-100 p-8 dark:bg-zinc-950">
      <h1 className="mb-8 text-3xl font-bold text-center">Manage Subscription</h1>
      <CancelFlow_1.CancelFlow />
    </div>);
}
