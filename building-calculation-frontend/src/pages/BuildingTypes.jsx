import CrudTable from "../components/CrudTable";
import api from "../api/api";
import { useEffect, useState } from "react";

function BuildingTypes() {
    const [structureTypes, setStructureTypes] = useState([]);

    const [loadingStructures, setLoadingStructures] = useState(true);
    const [structureError, setStructureError] = useState("");

    useEffect(() => {
        const loadStructureTypes = async () => {
            try {
                setLoadingStructures(true);
                setStructureError("");

                const data = await api.get("/structure-types");

                setStructureTypes(data || []);
            } catch (err) {
                setStructureError(
                    err.message || "Failed to load structure types"
                );
            } finally {
                setLoadingStructures(false);
            }
        };

        loadStructureTypes();
    }, []);

    return (
        <CrudTable
            title="Building Types"
            endpoint="/building-types"

            columns={[
                {
                    key: "id",
                    label: "ID",
                },
                {
                    key: "structureType",
                    label: "Structure Type",
                },
                {
                    key: "code",
                    label: "Code",
                },
                {
                    key: "name",
                    label: "Name",
                },
                {
                    key: "active",
                    label: "Active",
                },
            ]}

            fields={[
                {
                    name: "structureTypeId",
                    label: "Structure Type",
                    type: "select",
                    required: true,
                    options: structureTypes.map((structure) => ({
                        value: structure.id,
                        label: `${structure.code} - ${structure.name}`,
                    })),
                },
                {
                    name: "code",
                    label: "Code",
                    required: true,
                },
                {
                    name: "name",
                    label: "Name",
                    required: true,
                },
                {
                    name: "active",
                    label: "Active",
                    type: "checkbox",
                    defaultValue: true,
                },
            ]}

            initialForm={{
                structureTypeId: "",
                code: "",
                name: "",
                active: true,
            }}

            renderCell={(item, key) => {
                if (key === "structureType") {
                    return item.structureType ? (
                        <span>
                            {item.structureType.code} -{" "}
                            {item.structureType.name}
                        </span>
                    ) : (
                        "-"
                    );
                }

                if (key === "active") {
                    return (
                        <span
                            className={
                                item.active
                                    ? "status active"
                                    : "status inactive"
                            }
                        >
                            {item.active
                                ? "Active"
                                : "Inactive"}
                        </span>
                    );
                }

                return item[key];
            }}
        />
    );
}

export default BuildingTypes;