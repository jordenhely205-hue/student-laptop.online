"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Initial Mock Data
const initialApplications = [
  { id: "APP-1001", cnic: "35202-1234567-1", name: "Ahmad Ali", category: "Undergraduate", status: "Pending", voucherUrl: "/images/challan-preview.jpg", tid: "TID-987123" },
  { id: "APP-1002", cnic: "42101-9876543-2", name: "Ayesha Khan", category: "Inter Level", status: "Verified", voucherUrl: "/images/challan-preview.jpg", tid: "TID-456789" },
  { id: "APP-1003", cnic: "34101-1122334-5", name: "Hamza Tariq", category: "Matric", status: "Pending", voucherUrl: "/images/challan-preview.jpg", tid: "TID-112233" },
  { id: "APP-1004", cnic: "36302-5566778-9", name: "Fatima Noor", category: "Postgraduate", status: "Rejected", voucherUrl: "/images/challan-preview.jpg", tid: "TID-998877" },
  { id: "APP-1005", cnic: "35202-9988776-3", name: "Bilal Ahmad", category: "Undergraduate", status: "Pending", voucherUrl: "/images/challan-preview.jpg", tid: "TID-554433" },
  { id: "APP-1006", cnic: "32101-5544332-1", name: "Sana Malik", category: "Inter Level", status: "Verified", voucherUrl: "/images/challan-preview.jpg", tid: "TID-112211" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // States
  const [applications, setApplications] = useState(initialApplications);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProof = localStorage.getItem("paymentProof");
      const storedData = localStorage.getItem("challanData");
      if (storedProof && storedData) {
        const proof = JSON.parse(storedProof);
        const data = JSON.parse(storedData);
        const newApp = {
          id: `APP-${data.cnic.split("-").join("").slice(5, 10)}`,
          cnic: data.cnic,
          name: data.name,
          category: data.level,
          status: "Pending",
          voucherUrl: proof.image,
          tid: proof.tid
        };
        setApplications(prev => [newApp, ...prev]);
      }
    }
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  // Filter Logic
  const filteredApps = applications.filter(app => 
    filterStatus === "All" || app.status === filterStatus
  );

  // Checkbox Logic
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredApps.map(a => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  // Bulk Verification
  const verifySelected = () => {
    if (selectedIds.size === 0) return;
    setApplications(prev => prev.map(app => 
      selectedIds.has(app.id) ? { ...app, status: "Verified" } : app
    ));
    setSelectedIds(new Set());
  };

  // Single Actions
  const updateStatus = (id: string, newStatus: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div style={{minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column"}}>
      <header style={{padding: "1rem 0", backgroundColor: "#1e293b", color: "white"}}>
        <div className="container" style={{display: "flex", justifyContent: "space-between"}}>
           <div style={{display: "flex", alignItems: "center"}}>
             <span style={{color: "white", fontWeight: "bold", fontSize: "1.5rem"}}>StudentLaptop</span>
             <span style={{color: "var(--secondary)", fontWeight: "bold", fontSize: "1.5rem"}}>.admin</span>
           </div>
           <nav style={{display: "flex", gap: "1rem", alignItems: "center"}}>
             <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
           </nav>
        </div>
      </header>

      <main className="container" style={{flex: 1, padding: "3rem 0"}}>
        <h1 style={{marginBottom: "2rem"}}>Super Admin Dashboard</h1>
        
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem"}}>
            <div className="card" style={{borderTop: "4px solid var(--primary)"}}>
                <h3 style={{color: "#475569", marginBottom: "0.5rem", fontSize: "1rem"}}>Total Applications</h3>
                <p style={{fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)"}}>12,450</p>
            </div>
            <div className="card" style={{borderTop: "4px solid var(--secondary)"}}>
                <h3 style={{color: "#475569", marginBottom: "0.5rem", fontSize: "1rem"}}>Total Revenue Collected</h3>
                <p style={{fontSize: "2.5rem", fontWeight: "bold", color: "var(--secondary)"}}>Rs. 5,913,750</p>
            </div>
            <div className="card" style={{borderTop: "4px solid #f59e0b"}}>
                <h3 style={{color: "#475569", marginBottom: "0.5rem", fontSize: "1rem"}}>Pending Verification</h3>
                <p style={{fontSize: "2.5rem", fontWeight: "bold", color: "#d97706"}}>{applications.filter(a => a.status === 'Pending').length}</p>
            </div>
        </div>

        <div className="card">
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem"}}>
              <h2>Applications Management</h2>
              
              <div style={{display: "flex", gap: "0.5rem", backgroundColor: "#f1f5f9", padding: "0.5rem", borderRadius: "8px"}}>
                {["All", "Pending", "Verified", "Rejected"].map(status => (
                  <button 
                    key={status}
                    onClick={() => { setFilterStatus(status); setSelectedIds(new Set()); }}
                    className={filterStatus === status ? "btn btn-primary" : "btn"}
                    style={filterStatus === status ? {padding: "0.5rem 1rem"} : {backgroundColor: "transparent", color: "#475569", padding: "0.5rem 1rem"}}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#e0f2fe", border: "1px solid #bae6fd", borderRadius: "8px", marginBottom: "1rem"}}>
                <span style={{color: "#0369a1", fontWeight: "bold"}}>{selectedIds.size} applications selected</span>
                <button onClick={verifySelected} className="btn" style={{backgroundColor: "#0284c7", color: "white"}}>✓ Bulk Verify</button>
              </div>
            )}

            <div style={{overflowX: "auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", minWidth: "800px"}}>
                  <thead>
                      <tr style={{backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left"}}>
                          <th style={{padding: "1rem", width: "50px"}}>
                            <input 
                              type="checkbox" 
                              onChange={handleSelectAll} 
                              checked={filteredApps.length > 0 && selectedIds.size === filteredApps.length}
                              style={{width: "18px", height: "18px", cursor: "pointer"}}
                            />
                          </th>
                          <th style={{padding: "1rem"}}>App ID</th>
                          <th style={{padding: "1rem"}}>CNIC</th>
                          <th style={{padding: "1rem"}}>Name</th>
                          <th style={{padding: "1rem"}}>TID</th>
                          <th style={{padding: "1rem"}}>Receipt</th>
                          <th style={{padding: "1rem"}}>Status</th>
                          <th style={{padding: "1rem"}}>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredApps.length > 0 ? filteredApps.map(app => (
                        <tr key={app.id} style={{borderBottom: "1px solid #e2e8f0", backgroundColor: selectedIds.has(app.id) ? "#f1f5f9" : "transparent"}}>
                          <td style={{padding: "1rem"}}>
                            <input 
                              type="checkbox" 
                              checked={selectedIds.has(app.id)}
                              onChange={() => handleSelectRow(app.id)}
                              style={{width: "18px", height: "18px", cursor: "pointer"}}
                            />
                          </td>
                          <td style={{padding: "1rem", fontWeight: "500", color: "#475569"}}>{app.id}</td>
                          <td style={{padding: "1rem", fontWeight: "bold"}}>{app.cnic}</td>
                          <td style={{padding: "1rem"}}>{app.name} <br/><span style={{fontSize: "0.85rem", color: "#64748b"}}>{app.category}</span></td>
                          <td style={{padding: "1rem", fontWeight: "bold", color: "#2563eb"}}>{app.tid || "N/A"}</td>
                          <td style={{padding: "1rem"}}>
                            <button 
                              onClick={() => setVoucherPreview(app.voucherUrl)}
                              style={{background: "none", border: "none", color: "#2563eb", cursor: "pointer", textDecoration: "underline"}}
                            >View Receipt</button>
                          </td>
                          <td style={{padding: "1rem"}}>
                            <span style={{
                              backgroundColor: app.status === "Verified" ? "#dcfce7" : app.status === "Pending" ? "#fef3c7" : "#fee2e2",
                              color: app.status === "Verified" ? "#166534" : app.status === "Pending" ? "#92400e" : "#991b1b",
                              padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "500"
                            }}>
                              {app.status === "Verified" ? "Merit/Verified" : app.status}
                            </span>
                          </td>
                          <td style={{padding: "1rem"}}>
                            <div style={{display: "flex", gap: "0.5rem"}}>
                              {app.status !== "Verified" && (
                                <button onClick={() => updateStatus(app.id, "Verified")} className="btn" style={{padding: "0.25rem 0.5rem", fontSize: "0.85rem", backgroundColor: "#10b981", color: "white"}}>✓ Select</button>
                              )}
                              {app.status !== "Rejected" && (
                                <button onClick={() => updateStatus(app.id, "Rejected")} className="btn" style={{padding: "0.25rem 0.5rem", fontSize: "0.85rem", backgroundColor: "#ef4444", color: "white"}}>✗ Reject</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={7} style={{textAlign: "center", padding: "3rem", color: "#64748b"}}>No applications found in this category.</td>
                        </tr>
                      )}
                  </tbody>
              </table>
            </div>
        </div>
      </main>

      {/* Voucher Preview Modal Overlay */}
      {voucherPreview && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.75)", zIndex: 999,
          display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem"
        }}>
          <div style={{backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", maxWidth: "600px", width: "100%", position: "relative"}}>
            <button 
              onClick={() => setVoucherPreview(null)}
              style={{position: "absolute", top: "1rem", right: "1rem", background: "#f1f5f9", border: "none", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontWeight: "bold"}}
            >×</button>
            <h3 style={{marginBottom: "1rem"}}>Payment Voucher Review</h3>
            <div style={{backgroundColor: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: "8px", padding: "1rem", textAlign: "center", height: "400px", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden"}}>
              {voucherPreview?.startsWith("data:image") ? (
                <img src={voucherPreview} alt="Receipt" style={{maxHeight: "100%", maxWidth: "100%", objectFit: "contain"}} />
              ) : (
                <>
                  <span style={{fontSize: "3rem"}}>📄</span>
                  <p style={{marginTop: "1rem", color: "#64748b"}}>Simulated Voucher Image</p>
                  <p style={{fontSize: "0.85rem", color: "#94a3b8"}}>{voucherPreview}</p>
                </>
              )}
            </div>
            <div style={{display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem"}}>
              <button className="btn btn-secondary" onClick={() => setVoucherPreview(null)}>Close Window</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
