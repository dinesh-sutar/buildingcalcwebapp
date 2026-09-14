
import {
  useEffect,
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
  calculateValuation
} from "./api/valuationApi";

import {
  getGstOptions
} from "./api/gstApi";


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
    floorRates,
    loading,
    error: configError,
    getFloorsForBuilding
  } = useBuildingConfig();


  // --------------------------------------------------
  // GST STATE
  // --------------------------------------------------

  const [
    gstOptions,
    setGstOptions
  ] = useState([]);

  const [
    gstLoading,
    setGstLoading
  ] = useState(false);

  const [
    gstError,
    setGstError
  ] = useState("");


  // --------------------------------------------------
  // FORM / RESULT STATE
  // --------------------------------------------------

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


  // --------------------------------------------------
  // LOAD GST OPTIONS
  // --------------------------------------------------

  useEffect(() => {

    async function loadGstOptions() {

      setGstLoading(true);
      setGstError("");

      try {

        const data =
          await getGstOptions();

        const activeOptions =
          data.filter(
            (option) =>
              option.active === true
          );

        setGstOptions(
          activeOptions
        );

      } catch (error) {

        console.error(
          "Failed to load GST options:",
          error
        );

        setGstError(
          error.message ||
          "Unable to load GST options."
        );

      } finally {

        setGstLoading(false);
      }
    }

    loadGstOptions();

  }, []);


  // --------------------------------------------------
  // FLOORS FOR SELECTED BUILDING
  // --------------------------------------------------

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


  // --------------------------------------------------
  // CALCULATE
  // --------------------------------------------------

  async function calculate() {

    setError("");
    setResult(null);


    // ----------------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------------

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


    // ----------------------------------------------
    // GST VALIDATION
    // ----------------------------------------------

    if (gstLoading) {

      setError(
        "GST options are still loading. Please wait."
      );

      return;
    }


    if (gstOptions.length === 0) {

      setError(
        "No active GST options are available."
      );

      return;
    }


    // ----------------------------------------------
    // FIND SELECTED GST OPTION
    // ----------------------------------------------

    const selectedGstOption =
      gstOptions.find(
        (option) =>
          option.code === form.gstType
      );


    if (!selectedGstOption) {

      setError(
        "Selected GST option could not be found."
      );

      return;
    }


    // ----------------------------------------------
    // ADDITIONAL COST VALIDATION
    // ----------------------------------------------

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


    // ----------------------------------------------
    // BUILD FLOOR AREA REQUEST
    // ----------------------------------------------

    const floorAreas =
      Object.entries(
        form.floorAreas || {}
      )
        .filter(
          ([, area]) =>
            area !== "" &&
            area !== null &&
            area !== undefined
        )
        .map(
          ([floorTypeId, area]) => ({
            componentFloorTypeId:
              Number(floorTypeId),

            area:
              Number(area)
          })
        );


    // ----------------------------------------------
    // FINAL API REQUEST
    // ----------------------------------------------

    const request = {

      totalValue:
        Number(form.totalValue),

      area:
        Number(form.landArea),

      ratePerSqft:
        Number(form.landValue),

      buildingTypeId:
        Number(form.buildingTypeId),

      floorTypeId:
        Number(form.floorTypeId),

      flooringId:
        Number(form.flooringId),

      // IMPORTANT:
      // Backend expects gstOptionId,
      // not gstType.
      gstOptionId:
        selectedGstOption.id,

      boundaryCost:
        form.includeBoundary
          ? Number(form.boundaryCost)
          : 0,

      parkingCost:
        form.includeParking
          ? Number(form.parkingCost)
          : 0,

      floorAreas
    };


    // ----------------------------------------------
    // DEBUG
    // ----------------------------------------------

    console.log(
      "Selected GST option:",
      selectedGstOption
    );

    console.log(
      "Sending valuation request:",
      request
    );


    // ----------------------------------------------
    // API CALL
    // ----------------------------------------------

    try {

      const response =
        await calculateValuation(
          request
        );


      console.log(
        "API response:",
        response
      );


      setResult(
        response
      );

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


  // --------------------------------------------------
  // CLEAR FORM
  // --------------------------------------------------

  function clearForm() {

    setForm(
      initialForm
    );

    setResult(null);

    setError("");
  }


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
          configError ||
          gstError) && (

            <div className="error-message">

              <span>
                !
              </span>

              {error ||
                configError ||
                gstError}

            </div>
          )}


        <PropertyDetails
          form={form}
          setForm={setForm}

          buildingTypes={
            buildingTypes
          }

          floors={
            floors
          }

          floorings={
            floorings
          }

          gstOptions={
            gstOptions
          }

          loading={
            loading
          }

          gstLoading={
            gstLoading
          }
        />


        <FloorDetails
          form={form}
          setForm={setForm}
          floors={floors}
          floorRates={floorRates}
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
