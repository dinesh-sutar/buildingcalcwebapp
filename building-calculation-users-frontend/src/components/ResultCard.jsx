function formatCurrency(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "₹0";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "₹0";
  }

  return `₹${numericValue.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "0";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "0";
  }

  return numericValue.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function ResultCard({ result }) {
  if (!result) {
    return null;
  }

  /*
   * Backend response:
   *
   * {
   *   buildingBaseValue,
   *   buildingCost,
   *   extraItemsCost,
   *   gstAmount,
   *   boundaryCost,
   *   parkingCost,
   *   floorCosts,
   *   undervalued
   * }
   */

  const buildingBaseValue =
    result.buildingCost ?? 0;

  const buildingCost =
    result.buildingBaseValue ?? 0;

  const extraItemsCost =
    result.extraItemsCost ?? 0;

  const gstAmount =
    result.gstAmount ?? 0;

  const boundaryCost =
    result.boundaryCost ?? 0;

  const parkingCost =
    result.parkingCost ?? 0;

  const floorCosts =
    Array.isArray(result.floorCosts)
      ? result.floorCosts
      : [];

  const undervalued =
    Boolean(result.undervalued);

  return (
    <section className="result-card">

      {/* ----------------------------------------- */}
      {/* HEADER */}
      {/* ----------------------------------------- */}

      <div className="result-header">

        <div>
          <span className="result-eyebrow">
            CALCULATION RESULT
          </span>

          <h2>
            Valuation Summary
          </h2>
        </div>

        <div
          className={`result-status ${undervalued
            ? "result-status-warning"
            : "result-status-success"
            }`}
        >
          {undervalued
            ? "Undervalued"
            : "Calculated"}
        </div>

      </div>


      {/* ----------------------------------------- */}
      {/* BUILDING BASE VALUE */}
      {/* ----------------------------------------- */}

      <div className="result-total">

        <span>
          Building Value
        </span>

        <strong>
          {formatCurrency(
            buildingBaseValue
          )}
        </strong>

      </div>


      {/* ----------------------------------------- */}
      {/* SUMMARY */}
      {/* ----------------------------------------- */}

      <div className="result-grid">

        <div className="result-item">

          <span>
            Land Cost
          </span>

          <strong>
            {formatCurrency(
              buildingCost
            )}
          </strong>

        </div>


        <div className="result-item">

          <span>
            EI + PH + Ext PW
          </span>

          <strong>
            {formatCurrency(
              extraItemsCost
            )}
          </strong>

        </div>


        <div className="result-item">

          <span>
            GST
          </span>

          <strong>
            {formatCurrency(
              gstAmount
            )}
          </strong>

        </div>


        {Number(boundaryCost) > 0 && (

          <div className="result-item">

            <span>
              Boundary Cost
            </span>

            <strong>
              {formatCurrency(
                boundaryCost
              )}
            </strong>

          </div>

        )}


        {Number(parkingCost) > 0 && (

          <div className="result-item">

            <span>
              Parking Cost
            </span>

            <strong>
              {formatCurrency(
                parkingCost
              )}
            </strong>

          </div>

        )}

      </div>


      {/* ----------------------------------------- */}
      {/* FLOOR DISTRIBUTION */}
      {/* ----------------------------------------- */}

      {floorCosts.length > 0 && (

        <div className="distribution">

          <div className="distribution-heading">

            <h3>
              Floor-wise Distribution
            </h3>

            <span>
              Building Cost
            </span>

          </div>


          {floorCosts.map(
            (floor) => (

              <div
                className="distribution-row"
                key={
                  floor.componentFloorTypeId
                }
              >

                <span>
                  {floor.componentFloorTypeName}
                </span>

                <strong>
                  {formatCurrency(
                    floor.cost
                  )}
                </strong>

              </div>

            )
          )}

        </div>

      )}


      {/* ----------------------------------------- */}
      {/* UNDERVALUATION MESSAGE */}
      {/* ----------------------------------------- */}

      {undervalued && (

        <div className="result-extra">

          <span>
            Status
          </span>

          <strong>
            Declared value is below the
            configured building valuation.
          </strong>

        </div>

      )}


      {/* ----------------------------------------- */}
      {/* TOTAL FLOOR AREA */}
      {/* ----------------------------------------- */}

      {result.totalFloorArea !==
        undefined && (

          <div className="result-extra">

            <span>
              Total Floor Area
            </span>

            <strong>
              {formatNumber(
                result.totalFloorArea
              )}{" "}
              sqft
            </strong>

          </div>

        )}

    </section>
  );
}

export default ResultCard;
