import { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "../components/Modal";

function BuildingFloorConfigs() {
    const [configs, setConfigs] = useState([]);
    const [buildingTypes, setBuildingTypes] =
        useState([]);
    const [floorTypes, setFloorTypes] =
        useState([]);

    const [showModal, setShowModal] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [form, setForm] = useState({
        buildingTypeId: "",
        floorTypeId: "",
        enabled: true,
    });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadData = async () => {
        try {
            setLoading(true);

            const [
                configData,
                buildingData,
                floorData,
            ] = await Promise.all([
                api.get("/building-floor-configs"),
                api.get("/building-types"),
                api.get("/floor-types"),
            ]);

            setConfigs(configData || []);
            setBuildingTypes(buildingData || []);
            setFloorTypes(floorData || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openCreate = () => {
        setEditingId(null);

        setForm({
            buildingTypeId: "",
            floorTypeId: "",
            enabled: true,
        });

        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditingId(item.id);

        setForm({
            buildingTypeId:
                item.buildingType?.id || "",
            floorTypeId:
                item.floorType?.id || "",
            enabled:
                item.enabled ?? true,
        });

        setShowModal(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const payload = {
                buildingTypeId:
                    Number(form.buildingTypeId),

                floorTypeId:
                    Number(form.floorTypeId),

                enabled: Boolean(form.enabled),
            };

            if (editingId) {
                await api.put(
                    `/building-floor-configs/${editingId}`,
                    payload
                );
            } else {
                await api.post(
                    "/building-floor-configs",
                    payload
                );
            }

            setShowModal(false);

            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteConfig = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this configuration?"
            )
        ) {
            return;
        }

        try {
            await api.delete(
                `/building-floor-configs/${id}`
            );

            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>
                        Building Floor Configuration
                    </h1>

                    <p>
                        Configure which floor types are
                        available for each building type.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={openCreate}
                >
                    + Add Configuration
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
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Building Type</th>
                                    <th>Floor Type</th>
                                    <th>Enabled</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {configs.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>

                                        <td>
                                            <strong>
                                                {
                                                    item.buildingType
                                                        ?.code
                                                }
                                            </strong>

                                            <br />

                                            <small>
                                                {
                                                    item.buildingType
                                                        ?.name
                                                }
                                            </small>
                                        </td>

                                        <td>
                                            <strong>
                                                {item.floorType?.code}
                                            </strong>

                                            <br />

                                            <small>
                                                {item.floorType?.name}
                                            </small>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    item.enabled
                                                        ? "status active"
                                                        : "status inactive"
                                                }
                                            >
                                                {item.enabled
                                                    ? "Enabled"
                                                    : "Disabled"}
                                            </span>
                                        </td>

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
                                                        deleteConfig(
                                                            item.id
                                                        )
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

                        {configs.length === 0 && (
                            <div className="empty">
                                No configurations found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <Modal
                    title={
                        editingId
                            ? "Edit Configuration"
                            : "Add Configuration"
                    }
                    onClose={() =>
                        setShowModal(false)
                    }
                >
                    <form
                        className="form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group">
                            <label>
                                Building Type
                            </label>

                            <select
                                value={
                                    form.buildingTypeId
                                }
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        buildingTypeId:
                                            event.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">
                                    Select Building Type
                                </option>

                                {buildingTypes.map(
                                    (building) => (
                                        <option
                                            key={building.id}
                                            value={building.id}
                                        >
                                            {building.code} -{" "}
                                            {building.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                Floor Type
                            </label>

                            <select
                                value={
                                    form.floorTypeId
                                }
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        floorTypeId:
                                            event.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">
                                    Select Floor Type
                                </option>

                                {floorTypes.map(
                                    (floor) => (
                                        <option
                                            key={floor.id}
                                            value={floor.id}
                                        >
                                            {floor.code} -{" "}
                                            {floor.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={form.enabled}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            enabled:
                                                event.target
                                                    .checked,
                                        })
                                    }
                                />

                                Enabled
                            </label>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    setShowModal(false)
                                }
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

export default BuildingFloorConfigs;