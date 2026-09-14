function FloorDetails({
  form,
  setForm,
  floorRates,
  loading = false,
}) {

  /*
   * The selected floorType is the configuration:
   *
   * Duplex
   * Triplex
   * Ground
   * First
   * etc.
   *
   * The actual floors that need area input come
   * from BuildingFloorRate.componentFloorType.
   */

  const selectedFloorId =
    Number(form.floorTypeId);

  const selectedBuildingId =
    Number(form.buildingTypeId);


  /*
   * Get the configured component floors for:
   *
   * building type
   * +
   * selected floor configuration
   */

  const configuredFloorRates =
    floorRates?.filter(
      (rate) =>
        Number(rate.buildingType?.id) ===
        selectedBuildingId &&
        Number(rate.floorType?.id) ===
        selectedFloorId
    ) || [];


  /*
   * Remove duplicate component floors
   * in case duplicate rate records exist.
   */

  const componentFloors =
    configuredFloorRates
      .map(
        (rate) =>
          rate.componentFloorType
      )
      .filter(Boolean)
      .filter(
        (floor, index, array) =>
          array.findIndex(
            (item) =>
              Number(item.id) ===
              Number(floor.id)
          ) === index
      )
      .sort(
        (a, b) =>
          (a.displayOrder ?? 0) -
          (b.displayOrder ?? 0)
      );


  /*
   * Update the area of an actual component floor.
   *
   * IMPORTANT:
   * The key stored in floorAreas is the
   * componentFloorTypeId.
   */

  const handleAreaChange = (
    componentFloorTypeId,
    value
  ) => {

    setForm((previous) => ({
      ...previous,

      floorAreas: {
        ...previous.floorAreas,

        [componentFloorTypeId]:
          value,
      },
    }));
  };


  return (
    <section className="section-card">

      {/* ------------------------------------------ */}
      {/* SECTION HEADER */}
      {/* ------------------------------------------ */}

      <div className="section-heading">

        <div className="section-number">
          02
        </div>

        <div>

          <h2>
            Floor Details
          </h2>

          <p>
            Enter the built-up area for each
            floor in the selected configuration
          </p>

        </div>

      </div>


      {/* ------------------------------------------ */}
      {/* LOADING */}
      {/* ------------------------------------------ */}

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


      {/* ------------------------------------------ */}
      {/* NO BUILDING SELECTED */}
      {/* ------------------------------------------ */}

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


      {/* ------------------------------------------ */}
      {/* NO FLOOR CONFIGURATION SELECTED */}
      {/* ------------------------------------------ */}

      {!loading &&
        form.buildingTypeId &&
        !form.floorTypeId && (

          <div className="empty-state">

            <div className="empty-icon">
              ↑
            </div>

            <p>
              Select a floor configuration
              above to enter the floor areas.
            </p>

          </div>

        )}


      {/* ------------------------------------------ */}
      {/* COMPONENT FLOORS */}
      {/* ------------------------------------------ */}

      {!loading &&
        form.buildingTypeId &&
        form.floorTypeId &&
        componentFloors.length > 0 && (

          <div className="floor-grid">

            {componentFloors.map(
              (floor) => (

                <div
                  className="floor-input"
                  key={floor.id}
                >

                  <div className="floor-label">

                    <span className="floor-icon">
                      {floor.name
                        ?.charAt(0)
                        ?.toUpperCase() || "F"}
                    </span>

                    <div>

                      <strong>
                        {floor.name}
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
                        floor.id
                        ] ?? ""
                      }
                      onChange={(event) =>
                        handleAreaChange(
                          floor.id,
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

              )
            )}

          </div>

        )}


      {/* ------------------------------------------ */}
      {/* NO RATE CONFIGURATION */}
      {/* ------------------------------------------ */}

      {!loading &&
        form.buildingTypeId &&
        form.floorTypeId &&
        componentFloors.length === 0 && (

          <div className="empty-state">

            <div className="empty-icon">
              !
            </div>

            <p>
              No component floor rates are
              configured for the selected
              building and floor configuration.
            </p>

          </div>

        )}

    </section>
  );
}


export default FloorDetails;
