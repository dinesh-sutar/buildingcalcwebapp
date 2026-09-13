import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getBuildingTypes
} from "../api/buildingTypeApi";

import {
  getFloorConfigs
} from "../api/floorConfigApi";

import {
  getFloorTypes,
  getFloorRates
} from "../api/floorRateApi";

import {
  getFloorings
} from "../api/flooringApi";

function useBuildingConfig() {
  const [buildingTypes, setBuildingTypes] =
    useState([]);

  const [floorTypes, setFloorTypes] =
    useState([]);

  const [floorConfigs, setFloorConfigs] =
    useState([]);

  const [floorRates, setFloorRates] =
    useState([]);

  const [floorings, setFloorings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadConfiguration() {
      try {
        setLoading(true);
        setError("");

        const [
          buildings,
          floors,
          configs,
          rates,
          flooringData
        ] = await Promise.all([
          getBuildingTypes(),
          getFloorTypes(),
          getFloorConfigs(),
          getFloorRates(),
          getFloorings()
        ]);

        setBuildingTypes(
          buildings.filter(
            (item) => item.active !== false
          )
        );

        setFloorTypes(
          floors
            .filter(
              (item) =>
                item.active !== false
            )
            .sort(
              (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
            )
        );

        setFloorConfigs(
          configs.filter(
            (item) =>
              item.enabled !== false
          )
        );

        setFloorRates(
          rates.filter(
            (item) =>
              item.active !== false
          )
        );

        setFloorings(
          flooringData.filter(
            (item) =>
              item.active !== false
          )
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
          "Unable to load building configuration"
        );
      } finally {
        setLoading(false);
      }
    }

    loadConfiguration();
  }, []);

  /*
   * Returns floors allowed for the selected
   * building type.
   */
  function getFloorsForBuilding(
    buildingTypeId
  ) {
    if (!buildingTypeId) {
      return [];
    }

    return floorConfigs
      .filter(
        (config) =>
          config.buildingType?.id ===
          Number(buildingTypeId)
      )
      .map(
        (config) =>
          config.floorType
      )
      .filter(Boolean)
      .sort(
        (a, b) =>
          (a.displayOrder ?? 0) -
          (b.displayOrder ?? 0)
      );
  }

  /*
   * Get rate for:
   *
   * building type
   * floor type
   * component floor type
   */
  function getFloorRate(
    buildingTypeId,
    floorTypeId,
    componentFloorTypeId
  ) {
    return floorRates.find(
      (rate) =>
        rate.buildingType?.id ===
          Number(buildingTypeId) &&
        rate.floorType?.id ===
          Number(floorTypeId) &&
        rate.componentFloorType?.id ===
          Number(componentFloorTypeId)
    );
  }

  const activeBuildingTypes =
    useMemo(
      () => buildingTypes,
      [buildingTypes]
    );

  return {
    buildingTypes:
      activeBuildingTypes,

    floorTypes,

    floorConfigs,

    floorRates,

    floorings,

    loading,

    error,

    getFloorsForBuilding,

    getFloorRate
  };
}

export default useBuildingConfig;