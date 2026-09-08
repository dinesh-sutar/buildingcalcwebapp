import { useState } from "react";

import Navbar from "./components/Navbar";

import BuildingTypes from "./pages/BuildingTypes";
import FloorTypes from "./pages/FloorTypes";
import Floorings from "./pages/Floorings";
import GstOptions from "./pages/GstOptions";
import BuildingFloorConfigs from "./pages/BuildingFloorConfigs";
import BuildingFloorRates from "./pages/BuildingFloorRates";

function App() {
  const [activePage, setActivePage] =
    useState("building-types");

  const renderPage = () => {
    switch (activePage) {
      case "building-types":
        return <BuildingTypes />;

      case "floor-types":
        return <FloorTypes />;

      case "floorings":
        return <Floorings />;

      case "gst-options":
        return <GstOptions />;

      case "floor-configs":
        return (
          <BuildingFloorConfigs />
        );

      case "floor-rates":
        return (
          <BuildingFloorRates />
        );

      default:
        return <BuildingTypes />;
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