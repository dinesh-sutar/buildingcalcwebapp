function PropertyDetails({
  form,
  setForm,
  buildingTypes,
  floors,
  floorings,
  gstOptions,
  loading,
  gstLoading
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

      buildingTypeId:
        value,

      floorTypeId:
        "",

      floorAreas:
        {}
    }));
  }


  return (
    <section className="section-card">

      {/* ------------------------------------------ */}
      {/* SECTION HEADER */}
      {/* ------------------------------------------ */}

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

        {/* ---------------------------------------- */}
        {/* TOTAL VALUE */}
        {/* ---------------------------------------- */}

        <div className="field">

          <label>
            Total Property Value
          </label>

          <div className="input-prefix">

            <span>
              ₹
            </span>

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
              min="0"
            />

          </div>

        </div>


        {/* ---------------------------------------- */}
        {/* LAND AREA */}
        {/* ---------------------------------------- */}

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
              min="0"
            />

            <span>
              dcml/sft
            </span>

          </div>

        </div>


        {/* ---------------------------------------- */}
        {/* LAND VALUE */}
        {/* ---------------------------------------- */}

        <div className="field">

          <label>
            Land Value (per dcml/sft)
          </label>

          <div className="input-prefix">

            <span>
              ₹
            </span>

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
              min="0"
            />

          </div>

        </div>


        {/* ---------------------------------------- */}
        {/* BUILDING TYPE */}
        {/* ---------------------------------------- */}

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


        {/* ---------------------------------------- */}
        {/* FLOOR CONFIGURATION */}
        {/* ---------------------------------------- */}

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


        {/* ---------------------------------------- */}
        {/* FLOORING */}
        {/* ---------------------------------------- */}

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


        {/* ---------------------------------------- */}
        {/* GST */}
        {/* ---------------------------------------- */}

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
            disabled={
              gstLoading
            }
          >

            <option value="">
              {gstLoading
                ? "Loading GST options..."
                : "Select GST"}
            </option>


            {gstOptions &&
              gstOptions.map(
                (option) => (

                  <option
                    key={option.id}
                    value={option.code}
                  >
                    {option.name}
                    {option.rate !== null &&
                      option.rate !== undefined
                      ? ` (${option.rate}%)`
                      : ""}
                  </option>

                )
              )}

          </select>

        </div>

      </div>

    </section>
  );
}


export default PropertyDetails;

