"use client"
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todoValue: newTodo }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
        setNewTodo('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedTodos = todos.filter((todo) => todo.id !== id);
          setTodos(updatedTodos);
        }
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/');
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  return (
    
    <div>
    <div className="container">
      <h1>Todo list</h1>
      <form onSubmit={handleAddTodo} autoComplete="off">
        <input
          type="text"
          placeholder="Add Todo..."
          name="todoValue"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
      {todos.map((todoValue) => (
        <div key={todoValue.id} className="todo_container">
          <div className="todo_value">{todoValue.todo}</div>
          <div>
            <a
              className={`todo_delete ${todoValue.id}`}
              onClick={() => handleDeleteTodo(todoValue.id)}
            >
              Delete
            </a>
          </div>
        </div>
      ))}
    </div>
    <div className="center h-52 w-52 bg-orange-400 shadow-slate-600 border-indigo-950"></div>

    </div>
  );
};

export default Page;
