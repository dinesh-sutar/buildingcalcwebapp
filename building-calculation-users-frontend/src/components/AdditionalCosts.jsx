function AdditionalCosts({ form, setForm }) {
  const handleBoundaryToggle = () => {
    setForm((previous) => ({
      ...previous,
      includeBoundary: !previous.includeBoundary,
      boundaryCost: previous.includeBoundary
        ? ""
        : previous.boundaryCost,
    }));
  };

  const handleParkingToggle = () => {
    setForm((previous) => ({
      ...previous,
      includeParking: !previous.includeParking,
      parkingCost: previous.includeParking
        ? ""
        : previous.parkingCost,
    }));
  };

  const handleBoundaryCostChange = (event) => {
    setForm((previous) => ({
      ...previous,
      boundaryCost: event.target.value,
    }));
  };

  const handleParkingCostChange = (event) => {
    setForm((previous) => ({
      ...previous,
      parkingCost: event.target.value,
    }));
  };

  return (
    <section className="section-card">
      <div className="section-heading">
        <div className="section-number">
          03
        </div>

        <div>
          <h2>Additional Costs</h2>

          <p>
            Add optional costs to the property
            valuation
          </p>
        </div>
      </div>

      <div className="additional-grid">
        {/* Boundary Cost */}
        <div
          className={`optional-cost ${
            form.includeBoundary ? "active" : ""
          }`}
        >
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.includeBoundary}
              onChange={handleBoundaryToggle}
            />

            <span className="custom-check">
              ✓
            </span>

            <span>
              <strong>
                Boundary Cost
              </strong>

              <small>
                Include boundary cost
              </small>
            </span>
          </label>

          <div className="input-prefix">
            <span>₹</span>

            <input
              type="number"
              min="0"
              value={form.boundaryCost}
              onChange={
                handleBoundaryCostChange
              }
              disabled={!form.includeBoundary}
              placeholder="Enter boundary cost"
            />
          </div>
        </div>

        {/* Parking Cost */}
        <div
          className={`optional-cost ${
            form.includeParking ? "active" : ""
          }`}
        >
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.includeParking}
              onChange={handleParkingToggle}
            />

            <span className="custom-check">
              ✓
            </span>

            <span>
              <strong>
                Parking Cost
              </strong>

              <small>
                Include parking cost
              </small>
            </span>
          </label>

          <div className="input-prefix">
            <span>₹</span>

            <input
              type="number"
              min="0"
              value={form.parkingCost}
              onChange={
                handleParkingCostChange
              }
              disabled={!form.includeParking}
              placeholder="Enter parking cost"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdditionalCosts;