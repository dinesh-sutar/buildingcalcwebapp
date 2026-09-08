import { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "./Modal";

function CrudTable({
    title,
    endpoint,
    columns,
    fields,
    initialForm,
    renderCell,
}) {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadItems = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await api.get(endpoint);

            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, [endpoint]);

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...initialForm });
        setError("");
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditingId(item.id);

        const newForm = {};

        fields.forEach((field) => {
            newForm[field.name] =
                item[field.name] ?? field.defaultValue ?? "";
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

        try {
            setSaving(true);
            setError("");

            const payload = {};

            fields.forEach((field) => {
                let value = form[field.name];

                if (field.type === "number") {
                    value =
                        value === ""
                            ? null
                            : Number(value);
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
            await loadItems();
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

            await api.delete(
                `${endpoint}/${id}`
            );

            await loadItems();
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

                <button
                    className="primary-button"
                    onClick={openCreate}
                >
                    + Add New
                </button>
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