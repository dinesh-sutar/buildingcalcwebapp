import { useEffect, useMemo, useState } from "react";

import api from "../api/api";
import Modal from "../components/Modal";

const EMPTY_FORM = {
    structureTypeId: "",
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

    const [structureTypes, setStructureTypes] = useState([]);
    const [buildingTypes, setBuildingTypes] = useState([]);
    const [floorTypes, setFloorTypes] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadingBuildingTypes, setLoadingBuildingTypes] = useState(false);
    const [error, setError] = useState("");

    // Collapsed groups, keyed by structure type + building type
    const [collapsed, setCollapsed] = useState({});

    const toggleGroup = (key) =>
        setCollapsed((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));

    /*
     * Load building types based on selected structure type.
     *
     * API:
     * GET /building-types/structure-types/{structureTypeId}
     */
    const loadBuildingTypes = async (structureTypeId) => {
        if (!structureTypeId) {
            setBuildingTypes([]);
            return;
        }

        try {
            setLoadingBuildingTypes(true);
            setError("");

            const data = await api.get(
                `/building-types/structure-types/${structureTypeId}`
            );

            setBuildingTypes(Array.isArray(data) ? data : []);
        } catch (err) {
            setBuildingTypes([]);
            setError(
                err.message || "Failed to load building types"
            );
        } finally {
            setLoadingBuildingTypes(false);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            /*
             * Building types are intentionally NOT loaded here.
             *
             * They are loaded only after selecting a structure type
             * inside the configuration modal.
             */
            const [
                configData,
                structureData,
                floorData,
            ] = await Promise.all([
                api.get("/building-floor-configs"),
                api.get("/structure-types"),
                api.get("/floor-types"),
            ]);

            setConfigs(configData || []);
            setStructureTypes(structureData || []);
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

    /*
     * Group by:
     *
     * Structure Type
     *     └── Building Type
     *             └── Floor Types
     */
    const groupedConfigs = useMemo(() => {
        const structureMap = new Map();

        configs.forEach((item) => {
            const structure = item.structureType;
            const building = item.buildingType;

            const structureId =
                structure?.id ?? "unknown-structure";

            const buildingId =
                building?.id ?? "unknown-building";

            if (!structureMap.has(structureId)) {
                structureMap.set(structureId, {
                    key: `structure-${structureId}`,
                    structure,
                    buildings: new Map(),
                });
            }

            const structureGroup =
                structureMap.get(structureId);

            if (!structureGroup.buildings.has(buildingId)) {
                structureGroup.buildings.set(buildingId, {
                    key: `structure-${structureId}-building-${buildingId}`,
                    building,
                    items: [],
                });
            }

            structureGroup.buildings
                .get(buildingId)
                .items.push(item);
        });

        return Array.from(structureMap.values())
            .sort(
                (a, b) =>
                    (a.structure?.id ?? 0) -
                    (b.structure?.id ?? 0)
            )
            .map((structureGroup) => ({
                ...structureGroup,
                buildings: Array.from(
                    structureGroup.buildings.values()
                )
                    .sort(
                        (a, b) =>
                            (a.building?.id ?? 0) -
                            (b.building?.id ?? 0)
                    )
                    .map((buildingGroup) => ({
                        ...buildingGroup,
                        items: [...buildingGroup.items].sort(
                            (a, b) =>
                                (a.floorType?.displayOrder ?? 0) -
                                (b.floorType?.displayOrder ?? 0)
                        ),
                    })),
            }));
    }, [configs]);

    /*
     * Open modal for creating a new configuration.
     *
     * structureTypeId and buildingTypeId can be supplied
     * when opening from an existing building group.
     */
    const openCreate = async (
        structureTypeId = "",
        buildingTypeId = ""
    ) => {
        setEditingId(null);

        setForm({
            ...EMPTY_FORM,
            structureTypeId,
            buildingTypeId,
        });

        setError("");

        /*
         * If the modal was opened from an existing
         * structure/building group, load the corresponding
         * building types immediately.
         */
        if (structureTypeId) {
            await loadBuildingTypes(structureTypeId);
        } else {
            setBuildingTypes([]);
        }

        setShowModal(true);
    };

    /*
     * Open modal for editing an existing configuration.
     */
    const openEdit = async (item) => {
        setEditingId(item.id);

        const structureTypeId =
            item.structureType?.id || "";

        const buildingTypeId =
            item.buildingType?.id || "";

        setForm({
            structureTypeId,
            buildingTypeId,
            floorTypeId: item.floorType?.id || "",
            enabled: item.enabled ?? true,
        });

        setError("");

        /*
         * Load building types belonging to the
         * existing structure type before opening
         * the edit modal.
         */
        if (structureTypeId) {
            await loadBuildingTypes(structureTypeId);
        } else {
            setBuildingTypes([]);
        }

        setShowModal(true);
    };

    /*
     * Handle form submission.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Save current scroll position before saving
        const scrollPosition = window.scrollY;

        try {
            setSaving(true);
            setError("");

            const payload = {
                structureTypeId: Number(form.structureTypeId),
                buildingTypeId: Number(form.buildingTypeId),
                floorTypeId: Number(form.floorTypeId),
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

            // Reload the data
            await loadData();

            // Restore the previous scroll position
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: "instant",
                });
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    /*
     * Delete configuration.
     */
    const deleteConfig = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this configuration?"
            )
        ) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `/building-floor-configs/${id}`
            );

            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const renderBuildingGroup = (
        structure,
        buildingGroup
    ) => {
        const isCollapsed = Boolean(
            collapsed[buildingGroup.key]
        );

        const count = buildingGroup.items.length;

        return (
            <div
                className="table-card group-card"
                key={buildingGroup.key}
            >
                <div
                    className="group-header"
                    role="button"
                    tabIndex={0}
                    aria-expanded={!isCollapsed}
                    onClick={() =>
                        toggleGroup(buildingGroup.key)
                    }
                    onKeyDown={(event) => {
                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            event.preventDefault();
                            toggleGroup(buildingGroup.key);
                        }
                    }}
                >
                    <div className="group-title">
                        <span
                            className="chevron"
                            aria-hidden="true"
                        >
                            {isCollapsed ? "▶" : "▼"}
                        </span>

                        <div>
                            <h2>
                                {buildingGroup.building?.name ??
                                    "Unknown building type"}
                            </h2>

                            {buildingGroup.building?.code && (
                                <small>
                                    {buildingGroup.building.code}
                                </small>
                            )}
                        </div>

                        <span className="count-badge">
                            {count}{" "}
                            {count === 1
                                ? "floor type"
                                : "floor types"}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={(event) => {
                            event.stopPropagation();

                            openCreate(
                                structure?.id ?? "",
                                buildingGroup.building?.id ?? ""
                            );
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
                                {buildingGroup.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>

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
                        Configure which floor types are
                        available for each structure and
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

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="table-card">
                    <div className="loading">
                        Loading...
                    </div>
                </div>
            ) : groupedConfigs.length === 0 ? (
                <div className="table-card">
                    <div className="empty">
                        No configurations found.
                    </div>
                </div>
            ) : (
                groupedConfigs.map((structureGroup) => (
                    <div key={structureGroup.key}>
                        {/* Structure Type Header */}
                        {/* Structure Type Header */}
                        <div
                            className="table-card"
                            style={{
                                marginBottom: "10px",
                                padding: "16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "16px",
                            }}
                        >
                            <div className="group-title">
                                <div>
                                    <h2>
                                        {structureGroup.structure?.name ??
                                            "Unknown structure type"}
                                    </h2>

                                    {structureGroup.structure?.code && (
                                        <small>
                                            {structureGroup.structure.code}
                                        </small>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    openCreate(
                                        structureGroup.structure?.id ?? "",
                                        ""
                                    )
                                }
                            >
                                + Add configuration
                            </button>
                        </div>

                        {structureGroup.buildings.map(
                            (buildingGroup) =>
                                renderBuildingGroup(
                                    structureGroup.structure,
                                    buildingGroup
                                )
                        )}
                    </div>
                ))
            )}

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
                        {/* Structure Type */}
                        <div className="form-group">
                            <label>
                                Structure Type
                            </label>

                            <select
                                value={
                                    form.structureTypeId
                                }
                                onChange={async (event) => {
                                    const structureTypeId =
                                        event.target.value;

                                    /*
                                     * Clear the current building
                                     * type because it belongs to
                                     * the previously selected
                                     * structure type.
                                     */
                                    setForm((previous) => ({
                                        ...previous,
                                        structureTypeId,
                                        buildingTypeId: "",
                                    }));

                                    /*
                                     * Load building types for
                                     * selected structure type.
                                     */
                                    await loadBuildingTypes(
                                        structureTypeId
                                    );
                                }}
                                required
                            >
                                <option value="">
                                    Select Structure Type
                                </option>

                                {structureTypes.map(
                                    (structure) => (
                                        <option
                                            key={structure.id}
                                            value={structure.id}
                                        >
                                            {structure.code} -{" "}
                                            {structure.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Building Type */}
                        <div className="form-group">
                            <label>
                                Building Type
                            </label>

                            <select
                                value={
                                    form.buildingTypeId
                                }
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        buildingTypeId:
                                            event.target.value,
                                    }))
                                }
                                required
                                disabled={
                                    !form.structureTypeId ||
                                    loadingBuildingTypes
                                }
                            >
                                <option value="">
                                    {loadingBuildingTypes
                                        ? "Loading Building Types..."
                                        : !form.structureTypeId
                                            ? "Select Structure Type First"
                                            : "Select Building Type"}
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

                        {/* Floor Type */}
                        <div className="form-group">
                            <label>
                                Floor Type
                            </label>

                            <select
                                value={
                                    form.floorTypeId
                                }
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        floorTypeId:
                                            event.target.value,
                                    }))
                                }
                                required
                            >
                                <option value="">
                                    Select Floor Type
                                </option>

                                {floorTypes.map((floor) => (
                                    <option
                                        key={floor.id}
                                        value={floor.id}
                                    >
                                        {floor.code} -{" "}
                                        {floor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Enabled */}
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={form.enabled}
                                    onChange={(event) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            enabled:
                                                event.target
                                                    .checked,
                                        }))
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
