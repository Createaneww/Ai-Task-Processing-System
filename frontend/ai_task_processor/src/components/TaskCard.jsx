const STATUS_CONFIG = {
  pending: {
    emoji: '🟡',
    label: 'Pending',
    border: 'border-l-yellow-400',
    badge: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
  },
  running: {
    emoji: '🔵',
    label: 'Running',
    border: 'border-l-indigo-400',
    badge: 'bg-indigo-400/10 text-indigo-400 border border-indigo-400/20',
  },
  success: {
    emoji: '🟢',
    label: 'Success',
    border: 'border-l-green-400',
    badge: 'bg-green-400/10 text-green-400 border border-green-400/20',
  },
  failed: {
    emoji: '🔴',
    label: 'Failed',
    border: 'border-l-red-400',
    badge: 'bg-red-400/10 text-red-400 border border-red-400/20',
  },
};

function TaskCard({ task }) {
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div
      className={`bg-gray-900 border border-gray-800 border-l-4 ${cfg.border} rounded-xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-xl transition-transform duration-150`}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Type */}
          <span className="text-xs font-bold uppercase tracking-wider bg-gray-800 border border-gray-700 text-gray-200 px-2 py-0.5 rounded">
            {task.type}
          </span>

          {/* Date */}
          <span className="text-xs text-gray-500">
            {formatDate(task.createdAt)}
          </span>
        </div>

        {/* Status */}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
          {cfg.emoji} {cfg.label}
        </span>
      </div>

      {/* Input */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
          Input
        </p>
        <p className="text-sm text-gray-300 break-words leading-relaxed">
          {task.input}
        </p>
      </div>

      {/* Pending State */}
      {task.status === "pending" && (
        <p className="text-sm text-yellow-400">Waiting in queue...</p>
      )}

      {/* Running State */}
      {task.status === "running" && (
        <p className="text-sm text-indigo-400 animate-pulse">
          Processing...
        </p>
      )}

      {/* Result */}
      {task.status === "success" && task.result !== null && task.result !== undefined && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Result
          </p>
          <p className="text-sm text-green-400 font-medium break-words">
            {task.result}
          </p>
        </div>
      )}

      {/* Failed Logs */}
      {task.status === "failed" && task.logs && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Error Logs
          </p>
          <pre className="text-xs text-red-400 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap font-mono">
            {task.logs}
          </pre>
        </div>
      )}
    </div>
  );
}

export default TaskCard;