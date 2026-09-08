import { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "../components/Modal";

function BuildingFloorRates() {
    const [rates, setRates] = useState([]);
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
        componentFloorTypeId: "",
        baseRate: "",
        active: true,
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
                rateData,
                buildingData,
                floorData,
            ] = await Promise.all([
                api.get("/building-floor-rates"),
                api.get("/building-types"),
                api.get("/floor-types"),
            ]);

            setRates(rateData || []);
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
            componentFloorTypeId: "",
            baseRate: "",
            active: true,
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

            componentFloorTypeId:
                item.componentFloorType?.id || "",

            baseRate:
                item.baseRate ?? "",

            active:
                item.active ?? true,
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

                componentFloorTypeId:
                    Number(
                        form.componentFloorTypeId
                    ),

                baseRate:
                    form.baseRate === ""
                        ? null
                        : Number(form.baseRate),

                active: Boolean(form.active),
            };

            if (editingId) {
                await api.put(
                    `/building-floor-rates/${editingId}`,
                    payload
                );
            } else {
                await api.post(
                    "/building-floor-rates",
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

    const deleteRate = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this rate?"
            )
        ) {
            return;
        }

        try {
            await api.delete(
                `/building-floor-rates/${id}`
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
                        Building Floor Rates
                    </h1>

                    <p>
                        Manage rates for building and
                        floor combinations.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={openCreate}
                >
                    + Add Rate
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
                                    <th>Component Floor</th>
                                    <th>Base Rate</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rates.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>

                                        <td>
                                            {
                                                item.buildingType
                                                    ?.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                item.floorType
                                                    ?.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                item
                                                    .componentFloorType
                                                    ?.name
                                            }
                                        </td>

                                        <td>
                                            ₹{" "}
                                            {Number(
                                                item.baseRate
                                            ).toFixed(2)}
                                        </td>

                                        <td>
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
                                                        deleteRate(
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

                        {rates.length === 0 && (
                            <div className="empty">
                                No rates found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <Modal
                    title={
                        editingId
                            ? "Edit Building Floor Rate"
                            : "Add Building Floor Rate"
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
                            <label>
                                Component Floor Type
                            </label>

                            <select
                                value={
                                    form.componentFloorTypeId
                                }
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        componentFloorTypeId:
                                            event.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">
                                    Select Component Floor
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
                            <label>
                                Base Rate
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                value={form.baseRate}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        baseRate:
                                            event.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={form.active}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            active:
                                                event.target
                                                    .checked,
                                        })
                                    }
                                />

                                Active
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

export default BuildingFloorRates;