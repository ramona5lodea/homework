import React, { useRef, useState, useEffect } from "react";
import Card from "./components/card/Card";
import Input from "./components/input/Input";
import TodoItem from "./components/todo-item/TodoItem";
import TextArea from "./components/input/TextArea";
import Button from "./components/button/Button";
import "./App.css";
import Modal from "./components/modal/Modal";

const TODOS_MOCK = [
  {
    id: "1",
    title: "Todo 1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. At id illo repellendus non maiores in pariatur aliquam iure fugit amet!",
    completed: false,
  },
  {
    id: "2",
    title: "Todo 2",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit!",
    completed: false,
  },
  {
    id: "3",
    title: "Todo 3",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit!",
    completed: true,
  },
  {
    id: "4",
    title: "Todo 4",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit!",
    completed: true,
  },
];

function App() {
  const [todoList, setTodoList] = useState(TODOS_MOCK);
  const [isOpen, setIsOpen] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const [validation, setValidation] = useState({
    title: "",
    description: "",
    isValid: true
  })
  const formEl = useRef(null);

  const handleUpsertTodo = (e) => {
    e.preventDefault();

    setTodoList((prevValue) =>
      todoId
        ? prevValue.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  title: e.target.elements.title.value,
                  description: e.target.elements.description.value,
                }
              : todo
          )
        : [
            ...prevValue,
            {
              id: `${todoList.length + 1}`,
              title: e.target.elements.title.value,
              description: e.target.elements.description.value,
              completed: false,
            },
          ]
    );
    setIsOpen(false);
    e.target.reset();
  };

  const handleOnCompleted = (id, value) => {
    setTodoList((prevValue) =>
      prevValue.map((todo) =>
        todo.id === id ? { ...todo, completed: value } : todo
      )
    );
  };

  const handleOnEdit = (id) => {
    const toDo = todoList.find((todo) => todo.id === id);
    if (toDo) {
      formEl.current.elements.title.value = toDo.title;
      formEl.current.elements.description.value = toDo.description;
      setTodoId(toDo.id);
      setIsOpen(true);
    }
  };

  const handleOnClose = () => {
    formEl.current.elements.title.value = "";
    formEl.current.elements.description.value = "";
    setTodoId(null);
    setIsOpen(false);
  };

  const handleOnDelete = (id) => {
    setTodoList((prevValue) => prevValue.filter((todo) => todo.id !== id));
  };

  const handleOpenAddModal = () => {
    setTodoId(null);
    setIsOpen(true);
  };

  const modalModeLabel = todoId ? "Edit" : "Create";

  const displayItem = (todo) => (
    <TodoItem
      onEdit={handleOnEdit}
      onDelete={handleOnDelete}
      onCompleted={handleOnCompleted}
      id={todo.id}
      key={todo.id}
      title={todo.title}
      description={todo.description}
      completed={todo.completed}
    />
  );

  return (
    <div className="App">
      <div className="app-container">
        {/* 
            This is your Create Card component.
          */}
        <Modal isOpen={isOpen} onClose={handleOnClose}>
          <h2>{modalModeLabel}Todo</h2>
          <form ref={formEl} onSubmit={handleUpsertTodo}>
            <Input
              name="title"
              placeholder="Title"
              type="text"
              required
              minLength={3}
              maxLength={50}
            />
            <TextArea
              name="description"
              placeholder="Description"
              required
              minLength={3}
              maxLength={100}
            />
            <Button type="submit">{modalModeLabel}</Button>
          </form>
        </Modal>

        {/* 
          My Todos
        */}
        <Card>
          <h1>My todos</h1>
          <Button onClick={handleOpenAddModal}>Add +</Button>
          <div className="list-container">
            {/* <TodoItem completed={false} /> */}
            {todoList.filter((todo) => !todo.completed).map(displayItem)}
          </div>

          <div className="separator"></div>

          <h2>Completed</h2>
          <div className="list-container">
            {todoList.filter((todo) => todo.completed).map(displayItem)}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
