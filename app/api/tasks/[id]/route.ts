import { NextResponse } from 'next/server';
import { taskStore } from '../taskStore';

// GET /api/tasks/[id] - get a specific task
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id: taskId } = await context.params;
  const task = taskStore.getTaskById(taskId);

  if (!task) {
    return NextResponse.json(
      { error: 'タスクが見つかりません' },
      { status: 404 }
    );
  }

  return NextResponse.json(task);
}

// PUT /api/tasks/[id] - update a specific task
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id: taskId } = await context.params;
  const data = await request.json();
  
  const updatedTask = taskStore.updateTask(taskId, data);

  if (!updatedTask) {
    return NextResponse.json(
      { error: 'タスクが見つかりません' },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedTask);
}

// DELETE /api/tasks/[id] - delete a specific task
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id: taskId } = await context.params;
  const deletedTask = taskStore.deleteTask(taskId);

  if (!deletedTask) {
    return NextResponse.json(
      { error: 'タスクが見つかりません' },
      { status: 404 }
    );
  }

  return NextResponse.json(deletedTask);
}
