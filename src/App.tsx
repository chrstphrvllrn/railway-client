import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTasks = async (): Promise<void> => {
    try {
      const res = await axios.get<Task[]>(API);
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async (): Promise<void> => {
    if (!title.trim()) return;

    try {
      await axios.post<Task>(API, { title });
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (): Promise<void> => {
    if (!editingId || !title.trim()) return;

    try {
      await axios.put<Task>(`${API}/${editingId}`, { title });
      setTitle("");
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (task: Task): void => {
    setEditingId(task._id);
    setTitle(task.title);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-96">
        <h1 className="text-2xl font-bold mb-4">CRUD App (TS)</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 flex-1 rounded-lg"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            placeholder="Enter task"
          />

          {editingId ? (
            <button
              onClick={updateTask}
              className="bg-black text-white px-4 rounded-lg"
            >
              Update
            </button>
          ) : (
            <button
              onClick={createTask}
              className="bg-black text-white px-4 rounded-lg"
            >
              Add
            </button>
          )}
        </div>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center border p-2 rounded-lg"
            >
              <span>{task.title}</span>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(task)}
                  className="text-blue-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;