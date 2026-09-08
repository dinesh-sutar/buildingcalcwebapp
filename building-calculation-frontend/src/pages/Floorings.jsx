import CrudTable from "../components/CrudTable";

function Floorings() {
    return (
        <CrudTable
            title="Flooring"
            endpoint="/floorings"
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
                    key: "rate",
                    label: "Rate",
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
                    name: "rate",
                    label: "Rate",
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
                rate: "",
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

export default Floorings;