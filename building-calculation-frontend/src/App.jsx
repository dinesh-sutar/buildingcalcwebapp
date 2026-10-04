import { useState } from "react";

import Navbar from "./components/Navbar";

import BuildingTypes from "./pages/BuildingTypes";
import FloorTypes from "./pages/FloorTypes";
import Floorings from "./pages/Floorings";
import GstOptions from "./pages/GstOptions";
import BuildingFloorConfigs from "./pages/BuildingFloorConfigs";
import BuildingFloorRates from "./pages/BuildingFloorRates";
import BoundaryTypes from "./pages/BoundaryTypes";
import VisitorAnalytics from "./pages/VisitorAnalytics";
import StructureTypes from "./pages/StructureTypes";

function App() {
  const [activePage, setActivePage] =
    useState("visitor-analytics");

  const renderPage = () => {
    switch (activePage) {

      case "visitor-analytics":
        return <VisitorAnalytics />;

      case "structure-types":
        return <StructureTypes />;

      case "building-types":
        return <BuildingTypes />;

      case "floor-types":
        return <FloorTypes />;

      case "floorings":
        return <Floorings />;

      case "gst-options":
        return <GstOptions />;

      case "floor-configs":
        return <BuildingFloorConfigs />;

      case "floor-rates":
        return <BuildingFloorRates />;

      case "boundary-types":
        return <BoundaryTypes />;

      default:
        return <VisitorAnalytics />;
    }
  };

  return (
    <div className="app">

      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;