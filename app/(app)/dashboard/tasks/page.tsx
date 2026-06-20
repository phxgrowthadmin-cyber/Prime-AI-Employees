export default function TasksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Task History</h1>
        <p className="text-text-secondary">Monitor and manage agent task executions</p>
      </div>

      <div className="glass p-12 rounded-lg text-center py-20">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold mb-2">No tasks yet</h2>
        <p className="text-text-secondary">
          Create an agent and assign it a task to see history here
        </p>
      </div>
    </div>
  );
}
