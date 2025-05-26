"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タスクを取得する関数
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('タスクの取得に失敗しました', err);
      setError('タスクの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // タスクを追加する関数
  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      const response = await axios.post('/api/tasks', { title: newTaskTitle.trim() });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('タスクの追加に失敗しました', err);
      setError('タスクの追加に失敗しました');
    }
  };

  // タスクの完了状態を更新する関数
  const toggleTaskCompletion = async (task: Task) => {
    try {
      const response = await axios.put(`/api/tasks/${task.id}`, {
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (err) {
      console.error('タスクの更新に失敗しました', err);
      setError('タスクの更新に失敗しました');
    }
  };

  // タスクを削除する関数
  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('タスクの削除に失敗しました', err);
      setError('タスクの削除に失敗しました');
    }
  };

  // コンポーネントがマウントされたときにタスクを取得
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={25}
            priority
          />
          <h1 className="text-2xl font-bold">TODOリスト</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
            {error}
          </div>
        )}

        {/* タスク追加フォーム */}
        <div className="flex mb-6">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            追加
          </button>
        </div>

        {/* タスクリスト */}
        {loading ? (
          <div className="text-center py-4">
            <p>読込中...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 border rounded bg-gray-50">
            <p className="text-gray-600">タスクがありません。新しいタスクを追加しましょう。</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task)}
                    className="h-5 w-5 mr-3"
                  />
                  <span className={task.completed ? "line-through text-gray-500" : ""}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      
      <footer className="mt-12 pt-6 border-t flex justify-center">
        <div className="flex items-center gap-2">
          <Image
            className="dark:invert"
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
          <span>Powered by Next.js on Vercel</span>
        </div>
      </footer>
    </div>
  );
}
