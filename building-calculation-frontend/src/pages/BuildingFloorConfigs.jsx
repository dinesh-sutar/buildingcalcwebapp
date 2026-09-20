import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import Modal from "../components/Modal";

const EMPTY_FORM = {
    buildingTypeId: "",
    floorTypeId: "",
    enabled: true,
};

const GROUP_STYLES = `
.group-card {
    margin-bottom: 20px;
}

.group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    cursor: pointer;
    border-bottom: 1px solid #e5e7eb;
    user-select: none;
}

.group-header:focus-visible {
    outline: 2px solid #4338ca;
    outline-offset: -2px;
}

.group-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.group-title h2 {
    margin: 0;
    font-size: 16px;
}

.group-title small {
    color: #6b7280;
}

.chevron {
    font-size: 12px;
    color: #6b7280;
    width: 12px;
}

.count-badge {
    background: #eef2ff;
    color: #4338ca;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 12px;
    white-space: nowrap;
}
`;

function BuildingFloorConfigs() {
    const [configs, setConfigs] = useState([]);
    const [buildingTypes, setBuildingTypes] = useState([]);
    const [floorTypes, setFloorTypes] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // collapsed groups, keyed by building type id
    const [collapsed, setCollapsed] = useState({});

    const toggleGroup = (key) =>
        setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

    const loadData = async () => {
        try {
            setLoading(true);

            const [configData, buildingData, floorData] = await Promise.all([
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

    // Group configs by building type, sorted by building id,
    // and rows inside each group sorted by floor order.
    const groupedConfigs = useMemo(() => {
        const map = new Map();

        configs.forEach((item) => {
            const building = item.buildingType;
            const key = building?.id ?? "unknown";

            if (!map.has(key)) {
                map.set(key, { key, building, items: [] });
            }
            map.get(key).items.push(item);
        });

        return Array.from(map.values())
            .sort((a, b) => (a.building?.id ?? 0) - (b.building?.id ?? 0))
            .map((group) => ({
                ...group,
                items: [...group.items].sort(
                    (a, b) =>
                        (a.floorType?.displayOrder ?? 0) -
                        (b.floorType?.displayOrder ?? 0)
                ),
            }));
    }, [configs]);

    // Optional buildingTypeId lets a group's "+ Add" prefill the building.
    const openCreate = (buildingTypeId = "") => {
        setEditingId(null);
        setForm({ ...EMPTY_FORM, buildingTypeId });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditingId(item.id);

        setForm({
            buildingTypeId: item.buildingType?.id || "",
            floorTypeId: item.floorType?.id || "",
            enabled: item.enabled ?? true,
        });

        setShowModal(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const payload = {
                buildingTypeId: Number(form.buildingTypeId),
                floorTypeId: Number(form.floorTypeId),
                enabled: Boolean(form.enabled),
            };

            if (editingId) {
                await api.put(`/building-floor-configs/${editingId}`, payload);
            } else {
                await api.post("/building-floor-configs", payload);
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
            !window.confirm("Are you sure you want to delete this configuration?")
        ) {
            return;
        }

        try {
            await api.delete(`/building-floor-configs/${id}`);
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const renderGroup = (group) => {
        const isCollapsed = Boolean(collapsed[group.key]);
        const count = group.items.length;

        return (
            <div className="table-card group-card" key={group.key}>
                <div
                    className="group-header"
                    role="button"
                    tabIndex={0}
                    aria-expanded={!isCollapsed}
                    onClick={() => toggleGroup(group.key)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            toggleGroup(group.key);
                        }
                    }}
                >
                    <div className="group-title">
                        <span className="chevron" aria-hidden="true">
                            {isCollapsed ? "▶" : "▼"}
                        </span>

                        <div>
                            <h2>{group.building?.name ?? "Unknown building type"}</h2>
                            {group.building?.code && (
                                <small>{group.building.code}</small>
                            )}
                        </div>

                        <span className="count-badge">
                            {count} {count === 1 ? "floor type" : "floor types"}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={(event) => {
                            event.stopPropagation();
                            openCreate(group.building?.id ?? "");
                        }}
                    >
                        + Add configuration
                    </button>
                </div>

                {!isCollapsed && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Floor Type</th>
                                    <th>Enabled</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {group.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>

                                        <td>
                                            <strong>{item.floorType?.code}</strong>
                                            <br />
                                            <small>{item.floorType?.name}</small>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    item.enabled
                                                        ? "status active"
                                                        : "status inactive"
                                                }
                                            >
                                                {item.enabled ? "Enabled" : "Disabled"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="actions">
                                                <button
                                                    className="edit-button"
                                                    onClick={() => openEdit(item)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() => deleteConfig(item.id)}
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
        );
    };

    return (
        <div className="page">
            <style>{GROUP_STYLES}</style>

            <div className="page-header">
                <div>
                    <h1>Building Floor Configuration</h1>
                    <p>
                        Configure which floor types are available for each
                        building type.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => openCreate()}
                >
                    + Add Configuration
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="table-card">
                    <div className="loading">Loading...</div>
                </div>
            ) : groupedConfigs.length === 0 ? (
                <div className="table-card">
                    <div className="empty">No configurations found.</div>
                </div>
            ) : (
                groupedConfigs.map(renderGroup)
            )}

            {showModal && (
                <Modal
                    title={editingId ? "Edit Configuration" : "Add Configuration"}
                    onClose={() => setShowModal(false)}
                >
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Building Type</label>

                            <select
                                value={form.buildingTypeId}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        buildingTypeId: event.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Select Building Type</option>

                                {buildingTypes.map((building) => (
                                    <option key={building.id} value={building.id}>
                                        {building.code} - {building.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Floor Type</label>

                            <select
                                value={form.floorTypeId}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        floorTypeId: event.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Select Floor Type</option>

                                {floorTypes.map((floor) => (
                                    <option key={floor.id} value={floor.id}>
                                        {floor.code} - {floor.name}
                                    </option>
                                ))}
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
                                            enabled: event.target.checked,
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
                                onClick={() => setShowModal(false)}
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