import { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "./Modal";

function CrudTable({
    title,
    endpoint,
    fetchEndpoint,
    columns,
    fields,
    initialForm,
    renderCell,
    toFormValues,
    headerActions,
}) {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const activeFetchUrl =
        fetchEndpoint !== undefined ? fetchEndpoint : endpoint;

    const loadItems = async () => {
        if (!activeFetchUrl) {
            setItems([]);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await api.get(activeFetchUrl);

            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        if (!activeFetchUrl) {
            setItems([]);
            setLoading(false);
            return;
        }

        const fetchItems = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await api.get(activeFetchUrl);

                if (!cancelled) {
                    setItems(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchItems();

        return () => {
            cancelled = true;
        };
    }, [activeFetchUrl]);

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...initialForm });
        setError("");
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditingId(item.id);

        const source = toFormValues ? toFormValues(item) : item;
        const newForm = {};

        fields.forEach((field) => {
            newForm[field.name] =
                source[field.name] ?? field.defaultValue ?? "";
        });

        setForm(newForm);
        setError("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (!saving) {
            setShowModal(false);
        }
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Save current scroll position before saving
        const scrollPosition = window.scrollY;

        try {
            setSaving(true);
            setError("");

            const payload = {};

            fields.forEach((field) => {
                let value = form[field.name];

                if (
                    field.type === "number" ||
                    field.valueType === "number"
                ) {
                    value = value === "" ? null : Number(value);
                }

                if (field.type === "checkbox") {
                    value = Boolean(value);
                }

                payload[field.name] = value;
            });

            if (editingId) {
                await api.put(
                    `${endpoint}/${editingId}`,
                    payload
                );
            } else {
                await api.post(endpoint, payload);
            }

            setShowModal(false);

            // Reload the data
            await loadItems();

            // Restore previous scroll position
            requestAnimationFrame(() => {
                window.scrollTo(0, scrollPosition);
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(`${endpoint}/${id}`);

            // Remove the deleted item from the existing state
            setItems((previousItems) =>
                previousItems.filter((item) => item.id !== id)
            );

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>{title}</h1>

                    <p>
                        Manage {title.toLowerCase()}
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                    }}
                >
                    {headerActions}
                    <button
                        className="primary-button"
                        onClick={openCreate}
                    >
                        + Add New
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="table-card">
                {loading ? (
                    <div className="loading">
                        Loading...
                    </div>
                ) : items.length === 0 ? (
                    <div className="empty">
                        No records found.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column.key}>
                                            {column.label}
                                        </th>
                                    ))}

                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        {columns.map((column) => (
                                            <td key={column.key}>
                                                {renderCell
                                                    ? renderCell(
                                                        item,
                                                        column.key
                                                    )
                                                    : item[column.key]}
                                            </td>
                                        ))}

                                        <td>
                                            <div className="actions">
                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        openEdit(item)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <Modal
                    title={
                        editingId
                            ? `Edit ${title}`
                            : `Add ${title}`
                    }
                    onClose={closeModal}
                >
                    <form
                        onSubmit={handleSubmit}
                        className="form"
                    >
                        {fields.map((field) => (
                            <div
                                className="form-group"
                                key={field.name}
                            >
                                {field.type === "checkbox" ? (
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name={field.name}
                                            checked={Boolean(
                                                form[field.name]
                                            )}
                                            onChange={handleChange}
                                        />

                                        {field.label}
                                    </label>
                                ) : (
                                    <>
                                        <label>
                                            {field.label}
                                        </label>

                                        {field.type === "select" ? (
                                            <select
                                                name={field.name}
                                                value={
                                                    form[field.name] ?? ""
                                                }
                                                onChange={handleChange}
                                                required={field.required}
                                            >
                                                <option value="">
                                                    Select...
                                                </option>

                                                {field.options?.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={
                                                                option.value
                                                            }
                                                        >
                                                            {option.label}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        ) : (
                                            <input
                                                type={
                                                    field.type || "text"
                                                }
                                                name={field.name}
                                                value={
                                                    form[field.name] ?? ""
                                                }
                                                onChange={handleChange}
                                                required={field.required}
                                                step={
                                                    field.type ===
                                                        "number"
                                                        ? "0.01"
                                                        : undefined
                                                }
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        ))}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update"
                                        : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default CrudTable;