import { useEffect, useMemo, useState } from "react";

import api from "../api/api";
import Modal from "../components/Modal";

const EMPTY_FORM = {
    structureTypeId: "",
    buildingTypeId: "",
    floorTypeId: "",
    componentFloorTypeId: "",
    baseRate: "",
    active: true,
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

function BuildingFloorRates() {
    const [rates, setRates] = useState([]);

    const [structureTypes, setStructureTypes] = useState([]);
    const [buildingTypes, setBuildingTypes] = useState([]);
    const [floorTypes, setFloorTypes] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Collapsed groups, keyed by structure type + building type
    const [collapsed, setCollapsed] = useState({});

    const toggleGroup = (key) =>
        setCollapsed((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));

    /*
     * Load structure types, rates and floor types.
     *
     * Building types are NOT loaded here.
     * They are loaded dynamically based on the selected structure type.
     */
    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                rateData,
                structureData,
                floorData,
            ] = await Promise.all([
                api.get("/building-floor-rates"),
                api.get("/structure-types"),
                api.get("/floor-types"),
            ]);

            setRates(rateData || []);
            setStructureTypes(structureData || []);
            setFloorTypes(floorData || []);
        } catch (err) {
            setError(
                err.message || "Failed to load building floor rates"
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Load building types only for the selected structure type.
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
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    /*
     * Group by:
     *
     * Structure Type
     *      └── Building Type
     *              └── Floor Rates
     */
    const groupedRates = useMemo(() => {
        const structureMap = new Map();

        rates.forEach((item) => {
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
                                (b.floorType?.displayOrder ?? 0) ||
                                (a.componentFloorType
                                    ?.displayOrder ?? 0) -
                                (b.componentFloorType
                                    ?.displayOrder ?? 0)
                        ),
                    })),
            }));
    }, [rates]);

    /*
     * Open create modal.
     *
     * If a structure type is already known, load its
     * building types before showing the modal.
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

        if (structureTypeId) {
            await loadBuildingTypes(structureTypeId);
        } else {
            setBuildingTypes([]);
        }

        setShowModal(true);
    };

    /*
     * Open edit modal.
     *
     * First load building types belonging to the existing
     * structure type so the existing building type can be
     * selected correctly.
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
            floorTypeId:
                item.floorType?.id || "",
            componentFloorTypeId:
                item.componentFloorType?.id || "",
            baseRate:
                item.baseRate ?? "",
            active:
                item.active ?? true,
        });

        setError("");

        if (structureTypeId) {
            await loadBuildingTypes(structureTypeId);
        } else {
            setBuildingTypes([]);
        }

        setShowModal(true);
    };

    /*
     * Create / Update rate.
     *
     * Preserve the current page scroll position after
     * reloading the data.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        const scrollPosition = window.scrollY;

        try {
            setSaving(true);
            setError("");

            const payload = {
                structureTypeId:
                    Number(form.structureTypeId),

                buildingTypeId:
                    Number(form.buildingTypeId),

                floorTypeId:
                    Number(form.floorTypeId),

                componentFloorTypeId:
                    Number(form.componentFloorTypeId),

                baseRate:
                    form.baseRate === ""
                        ? null
                        : Number(form.baseRate),

                active:
                    Boolean(form.active),
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

            requestAnimationFrame(() => {
                window.scrollTo(
                    0,
                    scrollPosition
                );
            });
        } catch (err) {
            setError(
                err.message || "Failed to save building floor rate"
            );
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
            setError("");

            await api.delete(
                `/building-floor-rates/${id}`
            );

            await loadData();
        } catch (err) {
            setError(
                err.message || "Failed to delete building floor rate"
            );
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
                            toggleGroup(
                                buildingGroup.key
                            );
                        }
                    }}
                >
                    <div className="group-title">
                        <span
                            className="chevron"
                            aria-hidden="true"
                        >
                            {isCollapsed
                                ? "▶"
                                : "▼"}
                        </span>

                        <div>
                            <h2>
                                {buildingGroup.building?.name ??
                                    "Unknown building type"}
                            </h2>

                            {buildingGroup.building?.code && (
                                <small>
                                    {
                                        buildingGroup
                                            .building
                                            .code
                                    }
                                </small>
                            )}
                        </div>

                        <span className="count-badge">
                            {count}{" "}
                            {count === 1
                                ? "rate"
                                : "rates"}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={(event) => {
                            event.stopPropagation();

                            openCreate(
                                structure?.id ?? "",
                                buildingGroup
                                    .building?.id ?? ""
                            );
                        }}
                    >
                        + Add rate
                    </button>
                </div>

                {!isCollapsed && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Floor Type</th>
                                    <th>Component Floor</th>
                                    <th>Base Rate</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {buildingGroup.items.map(
                                    (item) => (
                                        <tr key={item.id}>
                                            <td>
                                                {item.id}
                                            </td>

                                            <td>
                                                {
                                                    item
                                                        .floorType
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
                                                            openEdit(
                                                                item
                                                            )
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
                                    )
                                )}
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
                    <h1>Building Floor Rates</h1>

                    <p>
                        Manage rates for structure,
                        building and floor combinations.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => openCreate()}
                >
                    + Add Rate
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
            ) : groupedRates.length === 0 ? (
                <div className="table-card">
                    <div className="empty">
                        No rates found.
                    </div>
                </div>
            ) : (
                groupedRates.map(
                    (structureGroup) => (
                        <div
                            key={structureGroup.key}
                        >
                            {/* Structure Type Header */}
                            <div
                                className="table-card"
                                style={{
                                    marginBottom:
                                        "10px",
                                    padding: "16px",
                                }}
                            >
                                <div className="group-title">
                                    <div>
                                        <h2>
                                            {structureGroup
                                                .structure
                                                ?.name ??
                                                "Unknown structure type"}
                                        </h2>

                                        {structureGroup
                                            .structure
                                            ?.code && (
                                                <small>
                                                    {
                                                        structureGroup
                                                            .structure
                                                            .code
                                                    }
                                                </small>
                                            )}
                                    </div>
                                </div>
                            </div>

                            {structureGroup.buildings.map(
                                (buildingGroup) =>
                                    renderBuildingGroup(
                                        structureGroup.structure,
                                        buildingGroup
                                    )
                            )}
                        </div>
                    )
                )
            )}

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

                                    setForm((previous) => ({
                                        ...previous,
                                        structureTypeId,
                                        buildingTypeId:
                                            "",
                                    }));

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
                                            key={
                                                structure.id
                                            }
                                            value={
                                                structure.id
                                            }
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
                                            event.target
                                                .value,
                                    }))
                                }
                                required
                                disabled={
                                    !form.structureTypeId ||
                                    buildingTypes.length === 0
                                }
                            >
                                <option value="">
                                    {form.structureTypeId
                                        ? "Select Building Type"
                                        : "Select Structure Type First"}
                                </option>

                                {buildingTypes.map(
                                    (building) => (
                                        <option
                                            key={
                                                building.id
                                            }
                                            value={
                                                building.id
                                            }
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
                                            event.target
                                                .value,
                                    }))
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

                        {/* Component Floor Type */}
                        <div className="form-group">
                            <label>
                                Component Floor Type
                            </label>

                            <select
                                value={
                                    form.componentFloorTypeId
                                }
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        componentFloorTypeId:
                                            event.target
                                                .value,
                                    }))
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

                        {/* Base Rate */}
                        <div className="form-group">
                            <label>
                                Base Rate
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                value={
                                    form.baseRate
                                }
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        baseRate:
                                            event.target
                                                .value,
                                    }))
                                }
                                required
                            />
                        </div>

                        {/* Active */}
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={
                                        form.active
                                    }
                                    onChange={(event) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            active:
                                                event.target
                                                    .checked,
                                        }))
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