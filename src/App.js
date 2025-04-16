import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setTasks(storedTasks);
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('history', JSON.stringify(history));
  }, [tasks, history]);

  const addTask = () => {
    if (task.trim() === '') return;
    const newTask = {
      id: Date.now(),
      name: task,
      completed: false,
      date: new Date().toLocaleString(),
    };
    if (editId) {
      const oldTask = tasks.find(t => t.id === editId);
      setTasks(tasks.map(t => (t.id === editId ? { ...t, name: task } : t)));
      setHistory([
        { action: 'Updated', name: oldTask.name, updatedTo: task, date: new Date().toLocaleString() },
        ...history,
      ]);
      setEditId(null);
    } else {
      setTasks([newTask, ...tasks]);
      setHistory([{ action: 'Added', name: task, date: newTask.date }, ...history]);
    }
    setTask('');
  };

  const deleteTask = id => {
    const deletedTask = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    setHistory([{ action: 'Deleted', name: deletedTask.name, date: new Date().toLocaleString() }, ...history]);
  };

  const toggleComplete = id => {
    setTasks(
      tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
    const toggledTask = tasks.find(t => t.id === id);
    setHistory([
      { action: toggledTask.completed ? 'Marked Incomplete' : 'Marked Complete', name: toggledTask.name, date: new Date().toLocaleString() },
      ...history,
    ]);
  };

  const editTask = id => {
    const taskToEdit = tasks.find(t => t.id === id);
    setTask(taskToEdit.name);
    setEditId(id);
  };

  const filteredTasks =
    filter === 'Completed'
      ? tasks.filter(t => t.completed)
      : filter === 'Active'
      ? tasks.filter(t => !t.completed)
      : tasks;

  return (
    <div className="app">
      <h1>TODO LIST</h1>
      <div className="top-controls">
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Add Task"
        />
        <button onClick={addTask}>{editId ? 'Update' : 'Add Task'}</button>
        <select onChange={e => setFilter(e.target.value)} value={filter}>
          <option>All</option>
          <option>Active</option>
          <option>Completed</option>
        </select>
      </div>
      <div className="task-list">
        {filteredTasks.map(t => (
          <div className={`task ${t.completed ? 'completed' : ''}`} key={t.id}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleComplete(t.id)}
            />
            <div className="task-info">
              <span>{t.name}</span>
              <small>{t.date}</small>
            </div>
            <div className="actions">
              <button onClick={() => deleteTask(t.id)}>🗑</button>
              <button onClick={() => editTask(t.id)}>✏️</button>
            </div>
          </div>
        ))}
      </div>
      <div className="history">
        <h2>History</h2>
        <ul>
          {history.map((h, index) => (
            <li key={index}>
              {h.action}: <strong>{h.name}</strong>
              {h.updatedTo && <> → <strong>{h.updatedTo}</strong></>}
              <br /><small>{h.date}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
