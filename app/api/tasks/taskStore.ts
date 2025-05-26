// 共有タスクストアの実装
// 実際のアプリケーションではデータベースを使用することをお勧めします

// タスクの型定義
export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

// シングルトンタスクストアクラス
class TaskStore {
  private tasks: Task[] = [
    { id: '1', title: 'Next.jsを学ぶ', completed: false },
    { id: '2', title: 'APIルートを作成する', completed: true },
    { id: '3', title: 'Vercelにデプロイする', completed: false },
  ];

  // 全てのタスクを取得
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // 特定のIDのタスクを取得
  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  // 新しいタスクを追加
  addTask(title: string): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  // タスクを更新
  updateTask(id: string, updates: Partial<Task>): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    return this.tasks[taskIndex];
  }

  // タスクを削除
  deleteTask(id: string): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    const deletedTask = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);
    return deletedTask;
  }
}

// グローバルインスタンスを作成してエクスポート
// Next.jsの開発モードではホットリロードによりこのファイルが複数回評価される可能性がありますが、
// プロダクション環境では単一のインスタンスになります
export const taskStore = new TaskStore();
