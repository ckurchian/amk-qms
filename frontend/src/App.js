import { useState, useEffect } from "react";
import Login from "./Login";

const MATERIAL_OPTIONS = [
    "4130 Steel",
    "6061 Aluminum",
    "17-4 PH Stainless Steel",
    "Inconel 625",
    "Inconel 718",
    "Titanium Grade 5 (Ti-6Al-4V)",
    "316L Stainless Steel",
    "A36 Carbon Steel",
    "Copper C101",
    "Magnesium AZ31B",
    "Nickel 200",
    "AWS B2.1 - Carbon Steel",
    "AWS B2.1 - Stainless Steel",
    "AWS B2.1 - Aluminum Alloys",
    "AWS B2.1 - Nickel Alloys",
    "AWS B2.1 - Titanium Alloys"
    // Add more as needed
];

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));
    const [showMaterials, setShowMaterials] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [newMaterial, setNewMaterial] = useState({
        name: "",
        material_type: "",
        lot_number: "",
        supplier: "",
        received_date: "",
        quantity: "",
        status: "available",
    });
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [updatedMaterial, setUpdatedMaterial] = useState({});

    useEffect(() => {
        if (isLoggedIn) {
            fetchMaterials();
        }
    }, [isLoggedIn]);

    const fetchMaterials = async () => {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/materials/", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
            const data = await response.json();
            setMaterials(data);
        }
    };

    const handleAddMaterial = async () => {
        const token = localStorage.getItem("access_token");

        const response = await fetch("http://127.0.0.1:8000/api/materials/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newMaterial),
        });

        if (response.ok) {
            fetchMaterials();
            setNewMaterial({
                name: "",
                material_type: "",
                lot_number: "",
                supplier: "",
                received_date: "",
                quantity: "",
                status: "available",
            }); // Reset form after adding
        } else {
            alert("Failed to add material");
        }
    };

   const handleDeleteClick = (id) => {
    if (pendingDelete === id) {
        handleDeleteMaterial(id);
        setPendingDelete(null);
    } else {
        setPendingDelete(id);
        setTimeout(() => {
            setPendingDelete(null); // Reset if no second click after 5 seconds
        }, 5000);
    }
};

const handleDeleteMaterial = async (id) => {
    const token = localStorage.getItem("access_token");
    await fetch(`http://127.0.0.1:8000/api/materials/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    fetchMaterials();
};

    const handleEditMaterial = (material) => {
        setEditingMaterial(material);
        setUpdatedMaterial(material);
    };

    const handleUpdateMaterial = async () => {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:8000/api/materials/${editingMaterial.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedMaterial),
        });

        if (response.ok) {
            setEditingMaterial(null);
            fetchMaterials();
        } else {
            alert("Failed to update material");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsLoggedIn(false);
        setShowMaterials(false);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>AMK QMS System</h1>

            {isLoggedIn ? (
                showMaterials ? (
                    <div style={styles.section}>
                        <button onClick={() => setShowMaterials(false)} style={styles.backButton}>⬅ Back to Dashboard</button>
                        <h2 style={styles.subHeader}>Materials Management</h2>

                        <ul style={styles.list}>
                           {materials.map((material) => (
    <li key={material.id} style={styles.listItem}>
        <span>{material.name} - {material.lot_number} ({material.status})</span>
        <div style={styles.buttonGroup}>
            <button onClick={() => handleEditMaterial(material)} style={styles.button}>Edit</button>
            <button 
                onClick={() => handleDeleteClick(material.id)} 
                style={pendingDelete === material.id ? styles.confirmDeleteButton : styles.deleteButton}>
                {pendingDelete === material.id ? "Delete. OK?" : "Delete"}
            </button>
        </div>
    </li>
))}
                        </ul>

                        {editingMaterial && (
                            <div style={styles.editSection}>
                                <h3>Edit Material</h3>
                                <input type="text" value={updatedMaterial.name} onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, name: e.target.value })} style={styles.input} placeholder="Material Name" />
                                <input type="text" value={updatedMaterial.material_type} onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, material_type: e.target.value })} style={styles.input} placeholder="Material Type" />
                                <input type="text" value={updatedMaterial.lot_number} onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, lot_number: e.target.value })} style={styles.input} placeholder="Lot Number" />
                                <input type="text" value={updatedMaterial.supplier} onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, supplier: e.target.value })} style={styles.input} placeholder="Supplier" />
                                <input type="date" value={updatedMaterial.received_date} onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, received_date: e.target.value })} style={styles.input} />
                                <input type="number" value={updatedMaterial.quantity} onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, quantity: e.target.value })} style={styles.input} placeholder="Quantity" />
                                <select value={updatedMaterial.status} onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, status: e.target.value })} style={styles.input}>
                                    <option value="available">Available</option>
                                    <option value="used">Used</option>
                                </select>
                                <button onClick={handleUpdateMaterial} style={styles.button}>Save</button>
                                <button onClick={() => setEditingMaterial(null)} style={styles.deleteButton}>Cancel</button>
                            </div>
                        )}

                       <h3>Add a New Material</h3>
<input
    type="text"
    value={newMaterial.name}
    onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
    placeholder="Search or Enter Material Name"
    style={styles.input}
/>
<select
    onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
    style={styles.input}
>
    <option value="">-- Select a Material --</option>
    {MATERIAL_OPTIONS.filter(material =>
        material.toLowerCase().includes(newMaterial.name.toLowerCase())
    ).map((material) => (
        <option key={material} value={material}>
            {material}
        </option>
    ))}
</select>
                        <input type="text" value={newMaterial.material_type} onChange={(e) => setNewMaterial({ ...newMaterial, material_type: e.target.value })} placeholder="Material Type" style={styles.input} />
                        <input type="text" value={newMaterial.lot_number} onChange={(e) => setNewMaterial({ ...newMaterial, lot_number: e.target.value })} placeholder="Lot Number" style={styles.input} />
                        <input type="text" value={newMaterial.supplier} onChange={(e) => setNewMaterial({ ...newMaterial, supplier: e.target.value })} placeholder="Supplier" style={styles.input} />
                        <input type="date" value={newMaterial.received_date} onChange={(e) => setNewMaterial({ ...newMaterial, received_date: e.target.value })} style={styles.input} />
                        <input type="number" value={newMaterial.quantity} onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })} placeholder="Quantity" style={styles.input} />
                        <select value={newMaterial.status} onChange={(e) => setNewMaterial({ ...newMaterial, status: e.target.value })} style={styles.input}>
                            <option value="available">Available</option>
                            <option value="used">Used</option>
                        </select>
                        <button onClick={handleAddMaterial} style={styles.button}>Add Material</button>
                    </div>
                ) : (
                    <div style={styles.dashboard}>
                        <button onClick={() => setShowMaterials(true)} style={styles.iconButton}>🏭 Materials Management</button>
                        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                    </div>
                )
            ) : (
                <Login onLogin={() => setIsLoggedIn(true)} />
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: "600px", margin: "auto", textAlign: "center", fontFamily: "Arial, sans-serif" },
    header: { fontSize: "28px", marginBottom: "20px" },
    subHeader: { fontSize: "22px", marginBottom: "10px" },
    section: { padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", marginTop: "10px" },
    dashboard: { display: "flex", flexDirection: "column", gap: "15px" },
    list: { listStyle: "none", padding: "0" },
    listItem: { background: "#fff", padding: "10px", margin: "5px 0", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    button: { background: "#4CAF50", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer", margin: "5px" },
    deleteButton: { background: "#f44336", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer", margin: "5px" },
confirmDeleteButton: { background: "#FFA500", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer", margin: "5px" },
    input: { padding: "8px", margin: "5px", width: "80%", borderRadius: "5px", border: "1px solid #ddd" },
    iconButton: { fontSize: "18px", padding: "10px", cursor: "pointer", background: "#2196F3", color: "white", border: "none", borderRadius: "5px" },
    logoutButton: { background: "#555", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" },
    backButton: { marginBottom: "10px", cursor: "pointer", border: "none", background: "none", fontSize: "16px", color: "#2196F3" },
};

export default App;