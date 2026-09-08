import CrudTable from "../components/CrudTable";

function GstOptions() {
    return (
        <CrudTable
            title="GST Options"
            endpoint="/gst-options"
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
                    label: "GST Rate",
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
                    label: "Rate (%)",
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

                if (key === "rate") {
                    return `${item.rate}%`;
                }

                return item[key];
            }}
        />
    );
}

export default GstOptions;