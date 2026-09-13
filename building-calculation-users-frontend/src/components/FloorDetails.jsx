function FloorDetails({
  form,
  setForm,
  floors,
  loading = false,
}) {
  const selectedFloor = floors?.find(
    (floor) =>
      Number(floor.id) ===
      Number(form.floorTypeId)
  );

  const handleAreaChange = (
    floorId,
    value
  ) => {
    setForm((previous) => ({
      ...previous,

      floorAreas: {
        ...previous.floorAreas,
        [floorId]: value,
      },
    }));
  };

  return (
    <section className="section-card">
      <div className="section-heading">
        <div className="section-number">
          02
        </div>

        <div>
          <h2>Floor Details</h2>

          <p>
            Enter the built-up area for the
            selected floor configuration
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="empty-state">
          <div className="empty-icon">
            ...
          </div>

          <p>
            Loading floor configuration...
          </p>
        </div>
      )}

      {/* No building selected */}
      {!loading &&
        !form.buildingTypeId && (
          <div className="empty-state">
            <div className="empty-icon">
              ↑
            </div>

            <p>
              Select a building type first.
            </p>
          </div>
        )}

      {/* Building selected but no floor */}
      {!loading &&
        form.buildingTypeId &&
        !form.floorTypeId && (
          <div className="empty-state">
            <div className="empty-icon">
              ↑
            </div>

            <p>
              Select a floor configuration
              above to enter the floor area.
            </p>
          </div>
        )}

      {/* Selected floor */}
      {!loading &&
        selectedFloor && (
          <div className="floor-grid">
            <div
              className="floor-input"
              key={selectedFloor.id}
            >
              <div className="floor-label">
                <span className="floor-icon">
                  {selectedFloor.name
                    ?.charAt(0)
                    ?.toUpperCase() || "F"}
                </span>

                <div>
                  <strong>
                    {selectedFloor.name}
                  </strong>

                  <small>
                    Built-up area
                  </small>
                </div>
              </div>

              <div className="input-suffix">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.floorAreas?.[
                      selectedFloor.id
                    ] ?? ""
                  }
                  onChange={(event) =>
                    handleAreaChange(
                      selectedFloor.id,
                      event.target.value
                    )
                  }
                  placeholder="Enter area"
                />

                <span>
                  sqft
                </span>
              </div>
            </div>
          </div>
        )}

      {/* No floor configuration available */}
      {!loading &&
        form.buildingTypeId &&
        floors?.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              !
            </div>

            <p>
              No floor configuration is
              available for the selected
              building type.
            </p>
          </div>
        )}
    </section>
  );
}

export default FloorDetails;