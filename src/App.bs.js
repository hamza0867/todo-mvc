

import * as Block from "bs-platform/lib/es6/block.js";
import * as Curry from "bs-platform/lib/es6/curry.js";
import * as React from "react";
import * as $$String from "bs-platform/lib/es6/string.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";
import * as ReasonReactRouter from "reason-react/src/ReasonReactRouter.js";

function any(_xs, predicate) {
  while(true) {
    var xs = _xs;
    if (!xs) {
      return false;
    }
    if (Curry._1(predicate, xs[0])) {
      return true;
    }
    _xs = xs[1];
    continue ;
  };
}

function reducer(state, action) {
  if (typeof action === "number") {
    switch (action) {
      case /* ClearCompleted */0 :
          return {
                  nextId: state.nextId,
                  inputField: state.inputField,
                  todos: Belt_List.keep(state.todos, (function (todo) {
                          return !todo.completed;
                        })),
                  filter: state.filter
                };
      case /* AddTodo */1 :
          return {
                  nextId: state.nextId + 1 | 0,
                  inputField: "",
                  todos: Belt_List.concat(state.todos, /* :: */[
                        {
                          title: state.inputField,
                          completed: false,
                          id: state.nextId + 1 | 0
                        },
                        /* [] */0
                      ]),
                  filter: state.filter
                };
      case /* CompleteAll */2 :
          var completed = any(state.todos, (function (todo) {
                  return !todo.completed;
                }));
          return {
                  nextId: state.nextId,
                  inputField: state.inputField,
                  todos: Belt_List.map(state.todos, (function (todo) {
                          return {
                                  title: todo.title,
                                  completed: completed,
                                  id: todo.id
                                };
                        })),
                  filter: state.filter
                };
      
    }
  } else {
    switch (action.tag | 0) {
      case /* UpdateFilter */0 :
          return {
                  nextId: state.nextId,
                  inputField: state.inputField,
                  todos: state.todos,
                  filter: action[0]
                };
      case /* DeleteTodo */1 :
          var id = action[0];
          return {
                  nextId: state.nextId,
                  inputField: state.inputField,
                  todos: Belt_List.keep(state.todos, (function (todo) {
                          return todo.id !== id;
                        })),
                  filter: state.filter
                };
      case /* UpdateInputField */2 :
          return {
                  nextId: state.nextId,
                  inputField: action[0],
                  todos: state.todos,
                  filter: state.filter
                };
      case /* ToggleTodo */3 :
          var id$1 = action[0];
          return {
                  nextId: state.nextId,
                  inputField: state.inputField,
                  todos: Belt_List.map(state.todos, (function (todo) {
                          if (id$1 === todo.id) {
                            return {
                                    title: todo.title,
                                    completed: !todo.completed,
                                    id: todo.id
                                  };
                          } else {
                            return todo;
                          }
                        })),
                  filter: state.filter
                };
      case /* UpdateTodo */4 :
          var todo = action[1];
          var id$2 = action[0];
          return {
                  nextId: state.nextId,
                  inputField: state.inputField,
                  todos: Belt_List.map(state.todos, (function (newTodo) {
                          if (id$2 === newTodo.id) {
                            return todo;
                          } else {
                            return newTodo;
                          }
                        })),
                  filter: state.filter
                };
      
    }
  }
}

var initialState = {
  nextId: 0,
  inputField: "",
  todos: /* [] */0,
  filter: /* All */2
};

function App$Todo(Props) {
  var todo = Props.todo;
  var dispatch = Props.dispatch;
  var match = React.useState((function () {
          return false;
        }));
  var setEditing = match[1];
  var editing = match[0];
  return React.createElement("li", {
              className: (
                todo.completed ? "completed " : ""
              ) + (
                editing ? "editing" : ""
              )
            }, React.createElement("div", {
                  className: "view"
                }, React.createElement("input", {
                      className: "toggle",
                      checked: todo.completed,
                      type: "checkbox",
                      onChange: (function (param) {
                          return Curry._1(dispatch, /* ToggleTodo */Block.__(3, [todo.id]));
                        })
                    }), React.createElement("label", {
                      onDoubleClick: (function (param) {
                          return Curry._1(setEditing, (function (param) {
                                        return true;
                                      }));
                        })
                    }, todo.title), React.createElement("button", {
                      className: "destroy",
                      onClick: (function (param) {
                          return Curry._1(dispatch, /* DeleteTodo */Block.__(1, [todo.id]));
                        })
                    })), editing ? React.createElement("input", {
                    className: "edit",
                    autoFocus: true,
                    value: todo.title,
                    onKeyUp: (function (e) {
                        var key = e.key;
                        if (key === "Enter") {
                          return Curry._1(setEditing, (function (param) {
                                        return false;
                                      }));
                        }
                        
                      }),
                    onBlur: (function (param) {
                        return Curry._1(setEditing, (function (param) {
                                      return false;
                                    }));
                      }),
                    onChange: (function (e) {
                        var title = e.target.value;
                        return Curry._1(dispatch, /* UpdateTodo */Block.__(4, [
                                      todo.id,
                                      {
                                        title: title,
                                        completed: todo.completed,
                                        id: todo.id
                                      }
                                    ]));
                      })
                  }) : null);
}

var Todo = {
  make: App$Todo
};

function App(Props) {
  var match = React.useReducer(reducer, initialState);
  var dispatch = match[1];
  var match$1 = match[0];
  var todos = match$1.todos;
  var inputField = match$1.inputField;
  var todosLength = Belt_List.length(todos);
  var showMain = todosLength > 0;
  var match$2 = Belt_List.partition(todos, (function (todo) {
          return !todo.completed;
        }));
  var remainingTodos = match$2[0];
  var remainingTodosLength = Belt_List.length(remainingTodos);
  var allComplete = remainingTodosLength === 0;
  var url = ReasonReactRouter.useUrl(undefined, undefined);
  var visibleTodos;
  switch (match$1.filter) {
    case /* Active */0 :
        visibleTodos = remainingTodos;
        break;
    case /* Completed */1 :
        visibleTodos = match$2[1];
        break;
    case /* All */2 :
        visibleTodos = todos;
        break;
    
  }
  React.useEffect((function () {
          var match = url.hash;
          switch (match) {
            case "/" :
                Curry._1(dispatch, /* UpdateFilter */Block.__(0, [/* All */2]));
                break;
            case "/active" :
                Curry._1(dispatch, /* UpdateFilter */Block.__(0, [/* Active */0]));
                break;
            case "/completed" :
                Curry._1(dispatch, /* UpdateFilter */Block.__(0, [/* Completed */1]));
                break;
            default:
              ReasonReactRouter.push("#/");
          }
          
        }), [url.hash]);
  return React.createElement(React.Fragment, undefined, React.createElement("section", {
                  className: "todoapp"
                }, React.createElement("header", {
                      className: "header"
                    }, React.createElement("h1", undefined, "todos"), React.createElement("input", {
                          className: "new-todo",
                          autoFocus: true,
                          placeholder: "What needs to be done?",
                          value: inputField,
                          onKeyUp: (function (e) {
                              var key = e.key;
                              if (key === "Enter" && $$String.trim(inputField) !== "") {
                                return Curry._1(dispatch, /* AddTodo */1);
                              }
                              
                            }),
                          onChange: (function (e) {
                              var inputField = e.target.value;
                              return Curry._1(dispatch, /* UpdateInputField */Block.__(2, [inputField]));
                            })
                        })), showMain ? React.createElement(React.Fragment, undefined, React.createElement("section", {
                            className: "main"
                          }, React.createElement("input", {
                                className: "toggle-all",
                                id: "toggle-all",
                                checked: allComplete,
                                type: "checkbox",
                                onChange: (function (param) {
                                    return Curry._1(dispatch, /* CompleteAll */2);
                                  })
                              }), React.createElement("label", {
                                htmlFor: "toggle-all"
                              }, "Mark all as complete"), React.createElement("ul", {
                                className: "todo-list"
                              }, Belt_List.toArray(Belt_List.map(visibleTodos, (function (todo) {
                                          return React.createElement(App$Todo, {
                                                      todo: todo,
                                                      dispatch: dispatch,
                                                      key: String(todo.id)
                                                    });
                                        }))))), React.createElement("footer", {
                            className: "footer"
                          }, React.createElement("span", {
                                className: "todo-count"
                              }, React.createElement("strong", undefined, remainingTodosLength), " item" + ((
                                  remainingTodosLength === 1 ? "" : "s"
                                ) + " left")), React.createElement("ul", {
                                className: "filters"
                              }, React.createElement("li", undefined, React.createElement("a", {
                                        className: "selected",
                                        href: "#/"
                                      }, "All")), React.createElement("li", undefined, React.createElement("a", {
                                        href: "#/active"
                                      }, "Active")), React.createElement("li", undefined, React.createElement("a", {
                                        href: "#/completed"
                                      }, "Completed"))), allComplete ? null : React.createElement("button", {
                                  className: "clear-completed",
                                  onClick: (function (param) {
                                      return Curry._1(dispatch, /* ClearCompleted */0);
                                    })
                                }, "Clear completed"))) : null), React.createElement("footer", {
                  className: "info"
                }, React.createElement("p", undefined, "Double-click to edit a todo"), React.createElement("p", undefined, "Template by ", React.createElement("a", {
                          href: "http://sindresorhus.com"
                        }, "Sindre Sorhus")), React.createElement("p", undefined, "Created by ", React.createElement("a", {
                          href: "https://github.com/hamza0867"
                        }, "hamza0867")), React.createElement("p", undefined, "Part of ", React.createElement("a", {
                          href: "http://todomvc.com"
                        }, "TodoMVC"))));
}

var make = App;

export {
  any ,
  reducer ,
  initialState ,
  Todo ,
  make ,
  
}
/* react Not a pure module */
