function PropertyDetails({
  form,
  setForm,
  buildingTypes,
  floors,
  floorings,
  loading
}) {
  function handleChange(event) {
    const {
      name,
      value
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleBuildingChange(
    event
  ) {
    const value =
      event.target.value;

    setForm((previous) => ({
      ...previous,

      buildingTypeId: value,

      floorTypeId: "",

      floorAreas: {}
    }));
  }

  return (
    <section className="section-card">

      <div className="section-heading">

        <div className="section-number">
          01
        </div>

        <div>
          <h2>
            Property Details
          </h2>

          <p>
            Enter the basic property
            information
          </p>
        </div>

      </div>

      <div className="form-grid">

        {/* TOTAL VALUE */}

        <div className="field">

          <label>
            Total Property Value
          </label>

          <div className="input-prefix">

            <span>₹</span>

            <input
              type="number"
              name="totalValue"
              value={
                form.totalValue
              }
              onChange={
                handleChange
              }
              placeholder="Enter total value"
            />

          </div>

        </div>

        {/* LAND AREA */}

        <div className="field">

          <label>
            Land Area
          </label>

          <div className="input-suffix">

            <input
              type="number"
              name="landArea"
              value={
                form.landArea
              }
              onChange={
                handleChange
              }
              placeholder="Enter land area"
            />

            <span>
              sqft
            </span>

          </div>

        </div>

        {/* LAND VALUE */}

        <div className="field">

          <label>
            Land Value
          </label>

          <div className="input-prefix">

            <span>₹</span>

            <input
              type="number"
              name="landValue"
              value={
                form.landValue
              }
              onChange={
                handleChange
              }
              placeholder="Enter land value"
            />

          </div>

        </div>

        {/* BUILDING TYPE */}

        <div className="field">

          <label>
            Building Type
          </label>

          <select
            value={
              form.buildingTypeId
            }
            onChange={
              handleBuildingChange
            }
            disabled={loading}
          >

            <option value="">
              {loading
                ? "Loading..."
                : "Select Building Type"}
            </option>

            {buildingTypes.map(
              (building) => (
                <option
                  key={building.id}
                  value={building.id}
                >
                  {building.name}
                </option>
              )
            )}

          </select>

        </div>

        {/* FLOOR */}

        <div className="field">

          <label>
            Floors
          </label>

          <select
            name="floorTypeId"
            value={
              form.floorTypeId
            }
            onChange={
              handleChange
            }
            disabled={
              !form.buildingTypeId ||
              loading
            }
          >

            <option value="">
              {!form.buildingTypeId
                ? "Select Building Type First"
                : "Select Floors"}
            </option>

            {floors.map(
              (floor) => (
                <option
                  key={floor.id}
                  value={floor.id}
                >
                  {floor.name}
                </option>
              )
            )}

          </select>

        </div>

        {/* FLOORING */}

        <div className="field">

          <label>
            Flooring Type
          </label>

          <select
            name="flooringId"
            value={
              form.flooringId
            }
            onChange={
              handleChange
            }
            disabled={loading}
          >

            <option value="">
              {loading
                ? "Loading..."
                : "Select Flooring"}
            </option>

            {floorings.map(
              (flooring) => (
                <option
                  key={flooring.id}
                  value={flooring.id}
                >
                  {flooring.name}
                </option>
              )
            )}

          </select>

        </div>

        {/* GST */}

        <div className="field full-width">

          <label>
            GST Calculation
          </label>

          <select
            name="gstType"
            value={
              form.gstType
            }
            onChange={
              handleChange
            }
          >

            <option value="">
              Select GST
            </option>

            <option value="WITH_LAND">
              GST with Land
            </option>

            <option value="WITHOUT_LAND">
              GST without Land
            </option>

            <option value="NO_GST">
              No GST
            </option>

          </select>

        </div>

      </div>

    </section>
  );
}

export default PropertyDetails;