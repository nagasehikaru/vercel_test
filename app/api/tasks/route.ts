import { NextResponse } from 'next/server';
import { taskStore } from './taskStore';

// GET /api/tasks - get all tasks
export async function GET() {
  return NextResponse.json(taskStore.getAllTasks());
}

// POST /api/tasks - create a new task
export async function POST(request: Request) {
  const data = await request.json();
  
  if (!data.title || typeof data.title !== 'string') {
    return NextResponse.json(
      { error: 'タイトルは必須です' },
      { status: 400 }
    );
  }

  const newTask = taskStore.addTask(data.title);
  return NextResponse.json(newTask, { status: 201 });
}
