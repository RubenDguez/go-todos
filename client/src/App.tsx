import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { get, post, remove, update } from './api';

function App() {
  const todoInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [edit, setEdit] = useState('');
  const [editValue, setEditValue] = useState('');
  const [todos, setTodos] = useState<Array<ITodo>>([]);
  const [error, setError] = useState('');

  const getTodos = async () => {
    const response = await get();
    setTodos(response);
  };

  const handleDismissError = useCallback(() => {
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const todo: ITodo = {
      id: '',
      body: todoInputRef.current?.value ?? '',
      completed: false,
    };

    try {
      await post(todo);
      formRef.current?.reset();
      await getTodos();
    } catch (error) {
      console.error('Error submitting todo:', error);
      setError((error as Error).message);
      return;
    }
  }, []);

  const handleUpdating = useCallback((todo: ITodo) => {
    setEdit(todo.id);
    setEditValue(todo.body);
  }, []);

  const handleCancelUpdate = useCallback(() => {
    setEditValue('');
    setEdit('');
  }, []);

  const handleUpdate = useCallback(
    async (todo: ITodo) => {
      if (editValue.trim() === '')
        throw new Error('Cannot update with empty todo');

      const _todo: ITodo = { ...todo, body: editValue, completed: false };

      try {
        await update(_todo);
        await getTodos();
        handleCancelUpdate();
      } catch (error) {
        console.error('Error submitting todo:', error);
        setError((error as Error).message);
        return;
      }
    },
    [editValue, handleCancelUpdate],
  );

  const handleComplete = useCallback(async (todo: ITodo) => {
    const _todo: ITodo = { ...todo, completed: !todo.completed }
    try {
      await update(_todo);
      await getTodos();
    } catch (error) {
      console.error('Error completing todo:', error);
      setError((error as Error).message);
      return;
    }
  }, []);

  const handleDelete = useCallback(async (todo: ITodo) => {
    try {
      await remove(todo);
      await getTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError((error as Error).message);
      return;
    }
  }, []);

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div style={{ width: '500px', margin: '2rem auto' }}>
      <h3 style={{ fontSize: '1.35rem', fontWeight: 300 }}>
        Go-React Todo App
      </h3>

      {error !== '' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            opacity: '0.7',
            margin: '1rem 0px',
            backgroundColor: 'tomato',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: 'gold',
            fontWeight: 200,
          }}>
          <p style={{ flexGrow: 1 }}>{error}</p>
          <button
            onClick={handleDismissError}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'gold',
              cursor: 'pointer',
            }}>
            ❌
          </button>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <input
            ref={todoInputRef}
            placeholder="Title"
            type="text"
            id="body"
            name="body"
            style={{
              padding: '0.5rem 1rem',
              flexGrow: 1,
              backgroundColor: 'transparent',
              border: '1px dotted gray',
              borderRadius: '8px',
              color: 'inherit',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '70px',
            height: '60px',
            borderRadius: '50%',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: 'skyblue',
          }}>
          Submit
        </button>
      </form>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {todos.length > 0 &&
          todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                gap: '1rem',
                listStyle: 'none',
                border: '1px dotted gray',
                padding: '5px 10px',
                borderRadius: '8px',
              }}>
              {edit !== todo.id && (
                <>
                  <p style={{ flexGrow: 1, textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.body}</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleComplete(todo)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}>
                      {todo.completed ? '👎' : '👍'}
                    </button>
                    <button
                      onClick={() => handleUpdating(todo)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}>
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(todo)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}>
                      🗑️
                    </button>
                  </div>
                </>
              )}
              {edit === todo.id && (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      flexGrow: 1,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'lightgreen',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdate(todo)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}>
                      ✅
                    </button>
                    <button
                      onClick={handleCancelUpdate}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}>
                      ❌
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
