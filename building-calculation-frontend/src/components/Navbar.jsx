function Navbar({ activePage, setActivePage }) {
    const menuItems = [
        {
            id: "building-types",
            label: "Building Types",
        },
        {
            id: "floor-types",
            label: "Floor Types",
        },
        {
            id: "floorings",
            label: "Flooring",
        },
        {
            id: "gst-options",
            label: "GST Options",
        },
        {
            id: "floor-configs",
            label: "Floor Configuration",
        },
        {
            id: "floor-rates",
            label: "Floor Rates",
        },
    ];

    return (
        <aside className="sidebar">
            <div className="logo">
                <div className="logo-icon">
                    BC
                </div>

                <div>
                    <strong>
                        BuildingCalc
                    </strong>

                    <span>
                        Admin Panel
                    </span>
                </div>
            </div>

            <nav>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={
                            activePage === item.id
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage(item.id)
                        }
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default Navbar;