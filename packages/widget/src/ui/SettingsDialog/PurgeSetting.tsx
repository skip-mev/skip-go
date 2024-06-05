export function PurgeSetting() {
  return (
    <div className="flex items-center space-x-2 p-2">
      <h3>Purge Settings</h3>
      <div className="flex-grow" />
      <div className="flex w-full max-w-32 flex-col items-stretch gap-1 text-sm">
        <button
          className="w-full rounded-lg border border-transparent bg-red-500 px-2 py-1 font-semibold text-white transition hover:bg-red-600"
          onClick={purge}
        >
          Purge
        </button>
      </div>
    </div>
  );
}

function purge() {
  if (window.confirm('Are you sure you want to purge all settings?')) {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.reload();
  }
}
