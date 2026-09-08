import CrudTable from "../components/CrudTable";

function FloorTypes() {
    return (
        <CrudTable
            title="Floor Types"
            endpoint="/floor-types"
            columns={[
                {
                    key: "id",
                    label: "ID",
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
                    key: "displayOrder",
                    label: "Display Order",
                },
                {
                    key: "active",
                    label: "Active",
                },
            ]}
            fields={[
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
                    name: "displayOrder",
                    label: "Display Order",
                    type: "number",
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
                code: "",
                name: "",
                displayOrder: 0,
                active: true,
            }}
            renderCell={(item, key) => {
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

export default FloorTypes;