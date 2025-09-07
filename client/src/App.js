import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('addTask', (tasks) => addTask(tasks));
    socket.on('removeTask', (id) => removeTask(id, false));
    socket.on('updateData', (tasks) => setTasks(tasks));

    return () => {
      socket.disconnect();
    };
  }, []);

  const removeTask = (id, shouldEmit) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));

    if (shouldEmit) {
      socket.emit('removeTask', id);
    }
  };

  const addTask = (task) => {
    const newTask = { id: crypto.randomUUID(), name: task };
    setTasks((tasks) => [...tasks, newTask]);
    socket.emit('addTask', newTask);
  };

  const submitForm = (e) => {
    e.preventDefault();

    addTask(taskName);

    setTaskName('');
  };

  return (
    <div className='App'>
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className='tasks-section' id='tasks-section'>
        <h2>Tasks</h2>

        <ul className='tasks-section__list' id='tasks-list'>
          {tasks.map((task) => (
            <li className='task' key={task.id}>
              {task.name}{' '}
              <button
                onClick={() => removeTask(task.id, true)}
                className='btn btn--red'
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id='add-task-form' onSubmit={submitForm}>
          <input
            className='text-input'
            autoComplete='off'
            type='text'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder='Type your description'
            id='task-name'
          />
          <button className='btn' type='submit'>
            Add
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;
