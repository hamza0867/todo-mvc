

import * as React from "react";
import * as ReactDOMRe from "reason-react/src/ReactDOMRe.js";
import * as App$ViteReasonReactStarter from "./App.bs.js";

import 'todomvc-common/base.css'
;

import 'todomvc-app-css/index.css'
;

ReactDOMRe.renderToElementWithId(React.createElement(App$ViteReasonReactStarter.make, { }), "root");

export {
  
}
/*  Not a pure module */
