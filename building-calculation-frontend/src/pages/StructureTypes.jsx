import CrudTable from "../components/CrudTable";

function StructureTypes() {
    return (
        <CrudTable
            title="Structure Types"
            endpoint="/structure-types"
            columns={[
                { key: "id", label: "ID" },
                { key: "code", label: "Code" },
                { key: "name", label: "Name" },
                { key: "active", label: "Active" },
            ]}
            fields={[
                { name: "code", label: "Code", required: true },
                { name: "name", label: "Name", required: true },
                {
                    name: "active",
                    label: "Active",
                    type: "checkbox",
                    defaultValue: true,
                },
            ]}
            initialForm={{ code: "", name: "", active: true }}
            renderCell={(item, key) => {
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

export default StructureTypes;