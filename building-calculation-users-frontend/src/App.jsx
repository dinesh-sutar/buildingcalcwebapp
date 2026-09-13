import {
  useMemo,
  useState
} from "react";

import Header from "./components/Header";
import PropertyDetails from "./components/PropertyDetails";
import FloorDetails from "./components/FloorDetails";
import AdditionalCosts from "./components/AdditionalCosts";
import ResultCard from "./components/ResultCard";
import ActionButtons from "./components/ActionButtons";

import useBuildingConfig from "./hooks/useBuildingConfig";

import {
  calculateValuation,
} from "./api/valuationApi";


const initialForm = {
  totalValue: "",

  landArea: "",

  landValue: "",

  buildingTypeId: "",

  floorTypeId: "",

  flooringId: "",

  gstType: "",

  includeBoundary: false,

  boundaryCost: "",

  includeParking: false,

  parkingCost: "",

  floorAreas: {}
};

function App() {

  const {
    buildingTypes,

    floorings,

    loading,

    error: configError,

    getFloorsForBuilding

  } = useBuildingConfig();

  const [
    form,
    setForm
  ] = useState(initialForm);

  const [
    result,
    setResult
  ] = useState(null);

  const [
    error,
    setError
  ] = useState("");

  const floors = useMemo(
    () =>
      getFloorsForBuilding(
        form.buildingTypeId
      ),
    [
      form.buildingTypeId,
      getFloorsForBuilding
    ]
  );

  async function calculate() {
  setError("");
  setResult(null);

  if (!form.totalValue) {
    setError(
      "Please enter the total property value."
    );
    return;
  }

  if (!form.landArea) {
    setError(
      "Please enter the land area."
    );
    return;
  }

  if (!form.landValue) {
    setError(
      "Please enter the land value."
    );
    return;
  }

  if (!form.buildingTypeId) {
    setError(
      "Please select a building type."
    );
    return;
  }

  if (!form.floorTypeId) {
    setError(
      "Please select a floor configuration."
    );
    return;
  }

  if (!form.flooringId) {
    setError(
      "Please select a flooring type."
    );
    return;
  }

  if (!form.gstType) {
    setError(
      "Please select a GST option."
    );
    return;
  }

  if (
    form.includeBoundary &&
    !form.boundaryCost
  ) {
    setError(
      "Please enter the boundary cost."
    );
    return;
  }

  if (
    form.includeParking &&
    !form.parkingCost
  ) {
    setError(
      "Please enter the parking cost."
    );
    return;
  }

  const request = {
    totalValue:
      Number(form.totalValue),

    landArea:
      Number(form.landArea),

    landValue:
      Number(form.landValue),

    buildingTypeId:
      Number(form.buildingTypeId),

    floorTypeId:
      Number(form.floorTypeId),

    flooringId:
      Number(form.flooringId),

    gstType:
      form.gstType,

    boundaryCost:
      form.includeBoundary
        ? Number(form.boundaryCost)
        : 0,

    parkingCost:
      form.includeParking
        ? Number(form.parkingCost)
        : 0,

    floorAreas:
      Object.entries(
        form.floorAreas || {}
      ).map(
        ([floorTypeId, area]) => ({
          floorTypeId:
            Number(floorTypeId),

          area:
            Number(area),
        })
      ),
  };

  console.log(
    "Sending request:",
    request
  );

  try {
    const response =
      await calculateValuation(
        request
      );

    console.log(
      "API response:",
      response
    );

    setResult(response);
  } catch (error) {
    console.error(
      "Calculation failed:",
      error
    );

    setError(
      error.message ||
        "Unable to calculate valuation."
    );
  }
}

  function clearForm() {
    setForm(
      initialForm
    );

    setResult(null);

    setError("");
  }

  return (
    <div className="app">

      <Header />

      <main className="main-container">

        <div className="page-intro">

          <div>

            <p className="eyebrow">
              BUILDING CALCULATION
            </p>

            <h1>
              Property Valuation
            </h1>

            <p className="intro-text">
              Calculate land value,
              building value, GST and
              additional costs.
            </p>

          </div>

        </div>

        {(error ||
          configError) && (
          <div className="error-message">

            <span>
              !
            </span>

            {error ||
              configError}

          </div>
        )}

        <PropertyDetails
          form={form}
          setForm={setForm}
          buildingTypes={
            buildingTypes
          }
          floors={floors}
          floorings={floorings}
          loading={loading}
        />

        <FloorDetails
          form={form}
          setForm={setForm}
          floors={floors}
        />

        <AdditionalCosts
          form={form}
          setForm={setForm}
        />

        <ActionButtons
          onClear={clearForm}
          onCalculate={calculate}
        />

        {result && (
          <ResultCard
            result={result}
          />
        )}

      </main>

      <footer className="footer">

        <span>
          BuildingCalc
        </span>

        <span>
          Building Valuation Application
        </span>

      </footer>

    </div>
  );
}

export default App;