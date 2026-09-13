function ActionButtons({
  onClear,
  onCalculate,
  loading = false,
}) {
  return (
    <div className="action-buttons">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onClear}
        disabled={loading}
      >
        <span>↺</span>

        Clear
      </button>

      <button
        type="button"
        className="btn btn-primary"
        onClick={onCalculate}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="button-spinner">
              ⟳
            </span>

            Calculating...
          </>
        ) : (
          <>
            Calculate

            <span>→</span>
          </>
        )}
      </button>
    </div>
  );
}

export default ActionButtons;