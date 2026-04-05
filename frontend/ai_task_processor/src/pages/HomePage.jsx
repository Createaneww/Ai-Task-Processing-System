import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import api from '../services/api';

const TASK_TYPES = ['uppercase', 'reverse', 'wordcount'];

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [creating, setCreating] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // Form state
  const [input, setInput] = useState('');
  const [type, setType] = useState(TASK_TYPES[0]);

  /**
   * Fetch all tasks for the logged-in user
   */
  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data || []);
      setFetchError('');
    } catch (err) {
      const msg =
        err.response?.data?.error || 'Failed to load tasks. Retrying…';
      setFetchError(msg);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  // Initial fetch + polling every 4 seconds
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 4000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  /**
   * Create a new task
   */
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setCreating(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      await api.post('/tasks', { input: input.trim(), type });
      setInput('');
      setCreateSuccess('Task created! Processing will begin shortly.');
      // Immediately refresh
      await fetchTasks();
      setTimeout(() => setCreateSuccess(''), 3500);
    } catch (err) {
      const msg =
        err.response?.data?.error || 'Failed to create task. Please try again.';
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* ── Task Creation Form ─────────────────────────────────────── */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <span>✨</span> Create New Task
          </h2>

          <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
            {/* Input textarea */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="task-input"
                className="text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Input Text
              </label>
              <textarea
                id="task-input"
                rows={3}
                placeholder="Enter text to process…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition"
              />
            </div>

            {/* Task type + submit */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex flex-col gap-1.5 flex-1">
                <label
                  htmlFor="task-type"
                  className="text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Task Type
                </label>
                <select
                  id="task-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
                >
                  {TASK_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="create-task-btn"
                type="submit"
                disabled={creating || !input.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors sm:self-end"
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating…
                  </span>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>

            {/* Feedback messages */}
            {createError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {createError}
              </p>
            )}
            {createSuccess && (
              <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                {createSuccess}
              </p>
            )}
          </form>
        </section>

        {/* ── Task List ──────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>📋</span> Your Tasks
              {tasks.length > 0 && (
                <span className="text-xs font-normal text-gray-500 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-full">
                  {tasks.length}
                </span>
              )}
            </h2>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Auto-refreshing
            </span>
          </div>

          {/* Fetch error */}
          {fetchError && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              {fetchError}
            </p>
          )}

          {/* Loader */}
          {loadingTasks ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-gray-700 border-t-indigo-400 rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-900 border border-gray-800 border-dashed rounded-2xl">
              <span className="text-4xl mb-3">📭</span>
              <p className="text-gray-400 font-medium">No tasks yet</p>
              <p className="text-gray-600 text-sm mt-1">
                Create your first task above to get started.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default HomePage;
