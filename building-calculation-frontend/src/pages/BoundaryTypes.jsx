import { useEffect, useState } from "react";
import CrudTable from "../components/CrudTable";
import api from "../api/api";

function BuildingTypes() {
    const [structureTypes, setStructureTypes] = useState([]);

    useEffect(() => {
        api.get("/structure-types")
            .then((data) => setStructureTypes(data || []))
            .catch(() => setStructureTypes([]));
    }, []);

    const structureOptions = structureTypes.map((s) => ({
        value: s.id,
        label: s.name,
    }));

    return (
        <CrudTable
            title="Building Types"
            endpoint="/building-types"
            columns={[
                { key: "id", label: "ID" },
                { key: "structureType", label: "Structure" },
                { key: "code", label: "Code" },
                { key: "name", label: "Name" },
                { key: "active", label: "Active" },
            ]}
            fields={[
                {
                    name: "structureTypeId",
                    label: "Structure Type",
                    type: "select",
                    required: true,
                    valueType: "number",
                    options: structureOptions,
                },
                { name: "code", label: "Code", required: true },
                { name: "name", label: "Name", required: true },
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
            toFormValues={(item) => ({
                ...item,
                structureTypeId: item.structureType?.id ?? "",
            })}
            renderCell={(item, key) => {
                if (key === "structureType") {
                    return item.structureType?.name ?? "-";
                }
                if (key === "active") {
                    return (
                        <span className={item.active ? "status active" : "status inactive"}>
                            {item.active ? "Active" : "Inactive"}
                        </span>
                    );
                }
                return item[key];
            }}
        />
    );
}

export default BuildingTypes;