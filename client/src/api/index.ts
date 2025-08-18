export async function get(): Promise<Array<ITodo>> {
  const result = await fetch('http://localhost:3000/api/');
  if (!result.ok) console.error('Error fetching data:', result.statusText);

  const data: Array<ITodo> = await result.json();
  return data;
}

export async function post(todo: ITodo): Promise<ITodo> {
  if (todo === undefined) throw new Error('Cannot post undefined todo');
  if (todo.body === '') throw new Error('Cannot post empty todo');

  try {
    const result = await fetch('http://localhost:3000/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });

    if (!result.ok) {
      console.error('Error posting todo:', result.statusText);
      throw new Error('Failed to post todo');
    }

    return result.json() as Promise<ITodo>;
  } catch (error) {
    console.error('Error posting todo:', error);
    throw error;
  }
}

export async function update(todo: ITodo) {
  if (todo === undefined) throw new Error('Cannot update undefined todo');
  if (todo.body === '') throw new Error('Cannot update empty todo');
  try {
    const result = await fetch('http://localhost:3000/api/' + todo.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });

    if (!result.ok) {
      console.error('Error updating todo:', result.statusText);
      throw new Error('Failed to update todo');
    }

    return result.json();
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

export async function remove(todo: ITodo) {
  if (todo === undefined) throw new Error('Cannot delete undefined todo');
  try {
    const result = await fetch('http://localhost:3000/api/' + todo.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!result.ok) {
      console.error('Error deleting todo:', result.statusText);
      throw new Error('Failed to delete todo');
    }

    return result.json();
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}
