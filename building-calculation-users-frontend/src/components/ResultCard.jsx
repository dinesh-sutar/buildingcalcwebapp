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

  return `₹${numericValue.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
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

  return numericValue.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  );
}

function ResultCard({ result }) {
  if (!result) {
    return null;
  }

  /*
   * Support both the current backend-style
   * response and slightly different property
   * naming conventions.
   */

  const totalValue =
    result.totalValue ??
    result.totalPropertyValue ??
    result.totalCost ??
    0;

  const landCost =
    result.landCost ??
    result.landValue ??
    0;

  const buildingCost =
    result.buildingCost ??
    result.constructionCost ??
    0;

  const gst =
    result.gst ??
    result.gstAmount ??
    0;

  const boundaryCost =
    result.boundaryCost ??
    0;

  const parkingCost =
    result.parkingCost ??
    0;

  const eiPhExt =
    result.eiPhExt ??
    result.eiPhExtPw ??
    result.eiPhExtPW ??
    result.externalWorks ??
    0;

  /*
   * Floor distribution can come from
   * different backend response formats.
   */

  let floorDistribution =
    result.floorDistribution ??
    result.floorWiseDistribution ??
    {};

  /*
   * If backend returns an array instead of
   * an object, convert it to an object for
   * rendering.
   */

  if (
    Array.isArray(floorDistribution)
  ) {
    floorDistribution =
      floorDistribution.reduce(
        (accumulator, item) => {
          const floorName =
            item.floorName ??
            item.name ??
            item.floorType?.name ??
            `Floor ${item.floorTypeId}`;

          const amount =
            item.amount ??
            item.value ??
            item.cost ??
            0;

          accumulator[floorName] =
            amount;

          return accumulator;
        },
        {}
      );
  }

  const hasFloorDistribution =
    Object.keys(
      floorDistribution || {}
    ).length > 0;

  return (
    <section className="result-card">
      {/* Header */}
      <div className="result-header">
        <div>
          <span className="result-eyebrow">
            CALCULATION RESULT
          </span>

          <h2>
            Valuation Summary
          </h2>
        </div>

        <div className="result-status">
          Calculated
        </div>
      </div>

      {/* Total */}
      <div className="result-total">
        <span>
          Total Property Value
        </span>

        <strong>
          {formatCurrency(
            totalValue
          )}
        </strong>
      </div>

      {/* Summary */}
      <div className="result-grid">
        <div className="result-item">
          <span>
            Land Cost
          </span>

          <strong>
            {formatCurrency(
              landCost
            )}
          </strong>
        </div>

        <div className="result-item">
          <span>
            Building Cost
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
              eiPhExt
            )}
          </strong>
        </div>

        <div className="result-item">
          <span>
            GST
          </span>

          <strong>
            {formatCurrency(gst)}
          </strong>
        </div>

        {boundaryCost > 0 && (
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

        {parkingCost > 0 && (
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

      {/* Floor Distribution */}
      {hasFloorDistribution && (
        <div className="distribution">
          <div className="distribution-heading">
            <h3>
              Floor-wise Distribution
            </h3>

            <span>
              Building Cost
            </span>
          </div>

          {Object.entries(
            floorDistribution
          ).map(
            ([floor, amount]) => (
              <div
                className="distribution-row"
                key={floor}
              >
                <span>
                  {floor}
                </span>

                <strong>
                  {formatCurrency(
                    amount
                  )}
                </strong>
              </div>
            )
          )}
        </div>
      )}

      {/* Extra information */}
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