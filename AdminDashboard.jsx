import React, { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [users, setUsers] = useState([
    { username: "agent1", role: "Relief Agent" },
    { username: "user2", role: "General" },
  ]);
  const mlModelVersion = "v1.0";

  const [selectedUser, setSelectedUser] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [analyses, setAnalyses] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const [showRegionModal, setShowRegionModal] = useState(false);
  const [regions, setRegions] = useState([]);
  const [newRegion, setNewRegion] = useState("");

  const [showNotificationConfig, setShowNotificationConfig] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: false,
    sms: false,
    push: false,
  });

  // --- User edit/remove ---
  const editUser = (username) => {
    const user = users.find((u) => u.username === username);
    setSelectedUser(user);
    setEditedRole(user.role);
    setShowEditModal(true);
  };

  const removeUser = (username) => {
    const user = users.find((u) => u.username === username);
    setSelectedUser(user);
    setShowRemoveModal(true);
  };

  const handleUpdateUser = () => {
    if (!editedRole.trim()) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.username === selectedUser.username ? { ...u, role: editedRole } : u
      )
    );
    setNotifications((prev) => [
      ...prev,
      `Updated ${selectedUser.username}'s role to ${editedRole}`,
    ]);
    setShowEditModal(false);
  };

  const handleConfirmRemove = () => {
    setUsers((prev) => prev.filter((u) => u.username !== selectedUser.username));
    setNotifications((prev) => [
      ...prev,
      `Removed user: ${selectedUser.username}`,
    ]);
    setShowRemoveModal(false);
  };

  // Dummy Fetches
  const fetchRequests = async () => {
    const res = await authFetch("/api/analysis/requests/");
    const data = await res.json();
    setRequests(data);
  };

  const fetchAnalyses = async () => {
    const res = await authFetch("/api/analysis/requests/all/");
    const data = await res.json();
    setAnalyses(data);
  };

  const fetchRegions = async () => {
    const res = await authFetch("/api/analysis/regions/");
    const data = await res.json();
    setRegions(data);
  };

  const updateStatus = async (id, status) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setNotifications((prev) => [...prev, `Request #${id} marked as ${status}`]);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Status", "Before Date", "After Date"]],
      body: requests.map((r) => [r.id, r.status, r.beforeDate, r.afterDate]),
    });
    doc.save("admin_requests.pdf");
  };

  const filteredRequests =
    filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  const runAllBatchJobs = () =>
    setNotifications((prev) => [...prev, "Batch jobs started"]);
  const stopAllBatchJobs = () =>
    setNotifications((prev) => [...prev, "Batch jobs stopped"]);

  const openUploadModal = () => setShowUploadModal(true);
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
  };
  const handleFileChange = (e) => setUploadFile(e.target.files[0]);

  const submitModelUpload = () => {
    if (!uploadFile) {
      alert("Please select a model file");
      return;
    }
    alert(`Uploaded: ${uploadFile.name}`);
    closeUploadModal();
  };

  const openRegionModal = () => setShowRegionModal(true);
  const closeRegionModal = () => {
    setShowRegionModal(false);
    setNewRegion("");
  };

  const addRegion = () => {
    if (!newRegion.trim()) {
      alert("Enter region name");
      return;
    }
    setRegions((prev) => [...prev, { id: Date.now(), name: newRegion }]);
    setNotifications((prev) => [...prev, `Region added: ${newRegion}`]);
    closeRegionModal();
  };

  const openNotificationConfig = () => setShowNotificationConfig(true);
  const closeNotificationConfig = () => setShowNotificationConfig(false);

  const toggleNotificationSetting = (type) =>
    setNotificationSettings((prev) => ({ ...prev, [type]: !prev[type] }));

  const saveNotificationSettings = () => {
    setNotifications((prev) => [...prev, "Notification settings updated"]);
    closeNotificationConfig();
  };

  useEffect(() => {
    fetchRequests();
    fetchAnalyses();
    fetchRegions();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {/* Users */}
      <section style={{ marginBottom: 30 }}>
        <h3>Users:</h3>
        <ul>
          {users.map((u) => (
            <li key={u.username}>
              - {u.username} ({u.role}){" "}
              <button onClick={() => editUser(u.username)}>Edit</button>{" "}
              <button onClick={() => removeUser(u.username)}>Remove</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Requests */}
      <section>
        <h3>Requests:</h3>
        <label>Filter by Status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="DENIED">Denied</option>
        </select>
        <div style={{ margin: "10px 0" }}>
          <CSVLink data={requests} filename="admin_requests.csv">
            <button>Download CSV</button>
          </CSVLink>
          <button onClick={downloadPDF} style={{ marginLeft: 10 }}>
            Download PDF
          </button>
        </div>
        {filteredRequests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <table border="1" cellPadding="8" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Before Date</th>
                <th>After Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.status}</td>
                  <td>{req.beforeDate}</td>
                  <td>{req.afterDate}</td>
                  <td>
                    {req.status === "PENDING" && (
                      <>
                        <button onClick={() => updateStatus(req.id, "APPROVED")}>
                          Approve
                        </button>{" "}
                        <button onClick={() => updateStatus(req.id, "DENIED")}>
                          Deny
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ML Model */}
      <section>
        <h3>ML Model:</h3>
        <p>Current version: {mlModelVersion}</p>
        <button onClick={openUploadModal}>Upload new model</button>
      </section>

      {/* Batch Jobs */}
      <section>
        <h3>Batch Jobs:</h3>
        <button onClick={runAllBatchJobs}>Run All</button>{" "}
        <button onClick={stopAllBatchJobs}>Stop All</button>
      </section>

      {/* Notifications Config */}
      <section>
        <h3>Notifications Config:</h3>
        <button onClick={openNotificationConfig}>Configure</button>
      </section>

      {/* All Analyses */}
      <section>
        <h3>All Analyses:</h3>
        {analyses.length === 0 ? (
          <p>No analyses found.</p>
        ) : (
          <table border="1" cellPadding="8" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.status}</td>
                  <td>{a.result}</td>
                  <td>{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Region Access */}
      <section>
        <h3>Region Access:</h3>
        <button onClick={openRegionModal}>Add New Region</button>
        <ul>
          {regions.map((r) => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ul>
      </section>

      {/* Notifications */}
      <section>
        <h3>Notifications:</h3>
        <ul>
          {notifications.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </section>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div style={modalStyle}>
          <h4>Edit User: {selectedUser.username}</h4>
          <input
            type="text"
            value={editedRole}
            onChange={(e) => setEditedRole(e.target.value)}
            placeholder="Enter new role"
          />
          <div style={{ marginTop: 10 }}>
            <button onClick={handleUpdateUser}>Save</button>{" "}
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Confirm Remove Modal */}
      {showRemoveModal && selectedUser && (
        <div style={modalStyle}>
          <h4>Confirm Removal</h4>
          <p>Are you sure you want to remove {selectedUser.username}?</p>
          <button onClick={handleConfirmRemove}>Yes, Remove</button>{" "}
          <button onClick={() => setShowRemoveModal(false)}>Cancel</button>
        </div>
      )}

      {/* Upload Model Modal */}
      {showUploadModal && (
        <div style={modalStyle}>
          <h4>Upload New Model</h4>
          <input type="file" onChange={handleFileChange} />
          <div style={{ marginTop: 10 }}>
            <button onClick={submitModelUpload}>Upload</button>{" "}
            <button onClick={closeUploadModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add Region Modal */}
      {showRegionModal && (
        <div style={modalStyle}>
          <h4>Add New Region</h4>
          <input
            type="text"
            value={newRegion}
            onChange={(e) => setNewRegion(e.target.value)}
            placeholder="Enter region name"
          />
          <div style={{ marginTop: 10 }}>
            <button onClick={addRegion}>Add</button>{" "}
            <button onClick={closeRegionModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* Notification Config Modal */}
      {showNotificationConfig && (
        <div style={modalStyle}>
          <h4>Notification Settings</h4>
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.email}
              onChange={() => toggleNotificationSetting("email")}
            />{" "}
            Email
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.sms}
              onChange={() => toggleNotificationSetting("sms")}
            />{" "}
            SMS
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.push}
              onChange={() => toggleNotificationSetting("push")}
            />{" "}
            Push Notifications
          </label>
          <div style={{ marginTop: 10 }}>
            <button onClick={saveNotificationSettings}>Save</button>{" "}
            <button onClick={closeNotificationConfig}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyle = {
  border: "1px solid #ccc",
  padding: 20,
  background: "#f9f9f9",
  position: "fixed",
  top: 100,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 999,
  width: 300,
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
};

export default AdminDashboard;
