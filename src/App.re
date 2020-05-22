open Belt;

let rec any = (xs, predicate) =>
  switch (xs) {
  | [] => false
  | [y, ...ys] =>
    if (predicate(y)) {
      true;
    } else {
      any(ys, predicate);
    }
  };

type todo = {
  title: string,
  completed: bool,
  id: int,
};

type todosFilter =
  | Active
  | Completed
  | All;

type state = {
  nextId: int,
  inputField: string,
  todos: list(todo),
  filter: todosFilter,
};

type action =
  | UpdateFilter(todosFilter)
  | ClearCompleted
  | DeleteTodo(int)
  | AddTodo
  | UpdateInputField(string)
  | CompleteAll
  | ToggleTodo(int)
  | UpdateTodo(int, todo);

let reducer = (state, action) =>
  switch (action) {
  | UpdateFilter(filter) => {...state, filter}
  | ClearCompleted => {
      ...state,
      todos: state.todos->List.keep(todo => !todo.completed),
    }
  | DeleteTodo(id) => {
      ...state,
      todos: state.todos->List.keep(todo => todo.id != id),
    }
  | AddTodo => {
      ...state,
      inputField: "",
      nextId: state.nextId + 1,
      todos:
        List.concat(
          state.todos,
          [
            {id: state.nextId + 1, completed: false, title: state.inputField},
          ],
        ),
    }
  | UpdateInputField(inputField) => {...state, inputField}
  | CompleteAll => {
      ...state,
      todos: {
        let completed = any(state.todos, todo => !todo.completed);
        state.todos->List.map(todo => {...todo, completed});
      },
    }
  | ToggleTodo(id) => {
      ...state,
      todos: {
        state.todos
        ->List.map(todo =>
            if (id == todo.id) {
              {...todo, completed: !todo.completed};
            } else {
              todo;
            }
          );
      },
    }
  | UpdateTodo(id, todo) => {
      ...state,
      todos: {
        state.todos
        ->List.map(newTodo =>
            if (id == newTodo.id) {
              todo;
            } else {
              newTodo;
            }
          );
      },
    }
  };

let initialState = {nextId: 0, inputField: "", todos: [], filter: All};

module Todo = {
  [@react.component]
  let make = (~todo: todo, ~dispatch) => {
    let (editing, setEditing) = React.useState(() => false);
    <li
      className={
        (todo.completed ? "completed " : "") ++ (editing ? "editing" : "")
      }>
      <div className="view">
        <input
          className="toggle"
          type_="checkbox"
          checked={todo.completed}
          onChange={_ => dispatch(ToggleTodo(todo.id))}
        />
        <label onDoubleClick={_ => setEditing(_ => true)}>
          {React.string(todo.title)}
        </label>
        <button
          className="destroy"
          onClick={_ => dispatch(DeleteTodo(todo.id))}
        />
      </div>
      {if (editing) {
         <input
           autoFocus=true
           className="edit"
           value={todo.title}
           onChange={e => {
             let title = ReactEvent.Form.target(e)##value;
             dispatch(UpdateTodo(todo.id, {...todo, title}));
           }}
           onKeyUp={e => {
             let key = ReactEvent.Keyboard.key(e);
             if (key == "Enter") {
               setEditing(_ => false);
             } else {
               ();
             };
           }}
           onBlur={_ => setEditing(_ => false)}
         />;
       } else {
         React.null;
       }}
    </li>;
  };
};

[@react.component]
let make = () => {
  let ({inputField, todos, filter}, dispatch) =
    React.useReducer(reducer, initialState);
  let todosLength = todos->List.length;
  let showMain = todosLength > 0;
  let (remainingTodos, completedTodos) =
    todos->List.partition(todo => !todo.completed);
  let remainingTodosLength = remainingTodos->List.length;
  let allComplete = remainingTodosLength == 0;
  let url = ReasonReactRouter.useUrl();
  let visibleTodos =
    switch (filter) {
    | All => todos
    | Active => remainingTodos
    | Completed => completedTodos
    };
  React.useEffect1(
    () => {
      switch (url.hash) {
      | "/" => dispatch(UpdateFilter(All))
      | "/active" => dispatch(UpdateFilter(Active))
      | "/completed" => dispatch(UpdateFilter(Completed))
      | _ => ReasonReactRouter.push("#/")
      };
      None;
    },
    [|url.hash|],
  );
  <>
    <section className="todoapp">
      <header className="header">
        <h1> {React.string("todos")} </h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus=true
          value=inputField
          onChange={e => {
            let inputField = ReactEvent.Form.target(e)##value;
            dispatch(UpdateInputField(inputField));
          }}
          onKeyUp={e => {
            let key = ReactEvent.Keyboard.key(e);
            if (key == "Enter" && String.trim(inputField) != "") {
              dispatch(AddTodo);
            } else {
              ();
            };
          }}
        />
      </header>
      {if (showMain) {
         <>
           /*<!-- This section should be hidden by default and shown when there are todos -->*/
           <section className="main">
             <input
               id="toggle-all"
               className="toggle-all"
               type_="checkbox"
               onChange={_ => dispatch(CompleteAll)}
               checked=allComplete
             />
             <label htmlFor="toggle-all">
               {React.string("Mark all as complete")}
             </label>
             <ul className="todo-list">
               /*<!-- List items should get the className `editing` when editing and `completed` when marked as completed -->*/

                 {visibleTodos
                  ->List.map(todo =>
                      <Todo dispatch todo key={string_of_int(todo.id)} />
                    )
                  ->List.toArray
                  ->React.array}
               </ul>
           </section>
           /*<!-- This footer should hidden by default and shown when there are todos -->*/
           <footer className="footer">
             /*<!-- This should be `0 items left` by default -->*/

               <span className="todo-count">
                 <strong> {React.int(remainingTodosLength)} </strong>
                 {React.string(
                    " item"
                    ++ (remainingTodosLength == 1 ? "" : "s")
                    ++ " left",
                  )}
               </span>
               /*<!-- Remove this if you don't implement routing -->*/
               <ul className="filters">
                 <li>
                   <a className="selected" href="#/">
                     {React.string("All")}
                   </a>
                 </li>
                 <li> <a href="#/active"> {React.string("Active")} </a> </li>
                 <li>
                   <a href="#/completed"> {React.string("Completed")} </a>
                 </li>
               </ul>
               /*<!-- Hidden if no completed items are left ↓ -->*/
               {if (!allComplete) {
                  <button
                    className="clear-completed"
                    onClick={_ => dispatch(ClearCompleted)}>
                    {React.string("Clear completed")}
                  </button>;
                } else {
                  React.null;
                }}
             </footer>
         </>;
       } else {
         React.null;
       }}
    </section>
    <footer className="info">
      <p> {React.string("Double-click to edit a todo")} </p>
      /*<!-- Remove the below line ↓ -->*/
      <p>
        {React.string("Template by ")}
        <a href="http://sindresorhus.com">
          {React.string("Sindre Sorhus")}
        </a>
      </p>
      /*<!-- Change this out with your name and url ↓ -->*/
      <p>
        {React.string("Created by ")}
        <a href="https://github.com/hamza0867">
          {React.string("hamza0867")}
        </a>
      </p>
      <p>
        {React.string("Part of ")}
        <a href="http://todomvc.com"> {React.string("TodoMVC")} </a>
      </p>
    </footer>
  </>;
};
