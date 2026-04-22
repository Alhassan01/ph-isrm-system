import { useEffect, useState } from "react";
import API from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");

  const [filter, setFilter] = useState("all");

  // ✅ Get role safely
  const getRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "";
      return JSON.parse(atob(token.split(".")[1])).role;
    } catch {
      return "";
    }
  };

  let role = getRole();

//let role = "";
  // Admin role stat
const [users, setUsers] = useState([]);
const [facilities, setFacilities] = useState([]);
const [logs, setLogs] = useState([]);

const fetchUsers = async () => {
  try{
    const res = await API.get("/");
  setUsers(res.data.data);
  }catch(error){
    console.log(error);
  }
};

// const fetchFacilities = async () => {
//   const res = await API.get("/");
//   setFacilities(res.data.data);
// };
const fetchFacilities = async () => {
  try {
    const res = await API.get("/facilities");
    setFacilities(res.data.data);
  } catch (err) {
    console.log(err);
    alert("Unable to fetch facilities");
  }
};

// const fetchLogs = async () => {
//   const res = await API.get("/");
//   setLogs(res.data.data);
// };
const fetchLogs = async () => {
  try {
    const res = await API.get("/audit-Logs");
    setLogs(res.data.data);
  } catch (err) {
    console.log(err);
    alert("Failed to fetch logs");
  }
};

  try{
      const token = localStorage.getItem("token");
      if(token){
        const decoded = JSON.parse(atob(token.split(".")[1]));
        role = decoded.role;
      }
    }catch(error){
        console.log("Token error", error);
      }
      
  //User Management
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
const [newUserRole, setNewUserRole] = useState("");

const createUser = async () => {
  try {
    await API.post("/users", {
      name: newUserName,
      email: newUserEmail,
      
      role: newUserRole,
      password: "123456" // temp
    });

    alert("User created");
    fetchUsers();
  } catch (err) {
    alert("Failed to create user");
  }
};
// delete user
// const deleteUser = async (id) => {
//   await API.delete(`/users/${id}`);
//   fetchUsers();
// };  
const deleteUser = async (id) => {
  if (!confirm("Delete this user?")) return;

  try {
    await API.delete(`/users/${id}`);
    alert("User deleted");
    fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message);
  }
};
//update role
// const updateUserRole = async (id, role) => {
//   await API.put(`/users/${id}`, { role });
//   fetchUsers();
// };
const updateUserRole = async (id, role) => {
  try {
    await API.put(`/users/${id}`, { role });
    alert("User role updated");
    fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message);
  }
};

//Facility management
//Add facility
const [newFacilityName, setNewFacilityName] = useState("");
const [newFacilityLocation, setNewFacilityLocation] = useState("");
const [newFacilityDistrict, setNewFacilityDistrict] = useState("");
const [newFacilityRegion, setNewFacilityRegion] = useState("");
const [newFacilityType, setNewFacilityType] = useState("");
const [facilityName, setFacilityName] = useState("");



//create facility
// const createFacility = async () => {
//   await API.post("/facilities", {
//     name: facilityName
//   });

//   fetchFacilities();
// };
const createFacility = async () => {
  try {
    await API.post("/facilities", {
      name: newFacilityName,
      location: newFacilityLocation,
      district: newFacilityDistrict,
      region: newFacilityRegion,
      type: newFacilityType,
    });

    alert("Facility created");
    fetchFacilities();

    setNewFacilityName("");
    setNewFacilityLocation("");
    setNewFacilityDistrict("");
    setNewFacilityRegion("");
  } catch (err) {
    alert(err.response?.data?.message);
  }
};

//delete facility
// const deleteFacility = async (id) => {
//   await API.delete(`/facilities/${id}`);
//   fetchFacilities();
// };
const deleteFacility = async (id) => {
  if (!confirm("Delete this facility?")) return;

  try {
    await API.delete(`/facilities/${id}`);
    alert("Facility deleted");
    fetchFacilities();
  } catch (err) {
    alert(err.response?.data?.message);
  }
};
//admin role end

  // ✅ Fetch incidents
  const fetchIncidents = async () => {
    try {
      const res = await API.get("/incidents");
      setIncidents(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/";
    fetchIncidents();
  }, []);

  // ✅ Create incident
  const createIncident = async () => {
    try {
      await API.post("/incidents", {
        type,
        severity,
        description,
        occurredAt: new Date()
      });

      alert("Incident created");
      fetchIncidents();

      setType("");
      setSeverity("");
      setDescription("");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ✅ Update status
const updateStatus = async (id, status) => {
  try {
    console.log("Updating:", id, status);

    const res = await API.put(`/incidents/${id}`, { status });//await API.put(`/incidents/${id}/status`, { status });

    console.log("Response:", res.data);

    fetchIncidents(); // refresh UI
  } catch (err) {
    console.error("UPDATE ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Update failed");
  }
};

  // const updateStatus = async (id, status) => {
  //   try {
  //     await API.put(`/incidents/${id}/status`, { status });
  //     fetchIncidents();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // ✅ Helpers
  const getStatusColor = (status) => {
    const map = {
      submitted: "#6c757d",
      acknowledged: "#0d6efd",
      in_progress: "#fd7e14",
      resolved: "#198754",
      closed: "#212529"
    };
    return map[status] || "#6c757d";
  };

  const getSeverityColor = (severity) => {
    if (severity === "high") return "red";
    if (severity === "medium") return "orange";
    return "green";
  };

  // ✅ Chart data
  const getChartData = () => {
    const counts = {
      submitted: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };

    incidents.forEach((i) => {
      if (counts[i.status] !== undefined) counts[i.status]++;
    });

    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key]
    }));
  };

  const COLORS = ["#6c757d", "#fd7e14", "#198754", "#212529"];

  const filtered =
    filter === "all"
      ? incidents
      : incidents.filter((i) => i.status === filter);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // <==================Main==========================>
//     return (
//     <div className="dashboard">
//       <div className="header">
//         <h2>Dashboard</h2>
//         <button className="logout-btn" onClick={logout}>Logout</button>
//       </div>

//       <p className="role">Logged in as <strong>{role}</strong></p>
//       <div className="grid">
//  {/* LEFT PANEL */}
//   <div className="panel">
//           {role === "national_admin" && (
//   <div className="btn-group" >
//     <h3>Admin Panel</h3>

//     <button onClick={fetchUsers}>View Users</button>
//     <button onClick={fetchFacilities}>View Facilities</button>
//     <button onClick={fetchLogs}>View Audit Logs</button>
//   </div>
// )}
// <div className="form">
//   {/* USERS */}
// {users.map(user => (
//   <div key={user._id} className="card">
//     {user.email} - {user.role}
//   </div>
// ))}
// {/*User management*/}
// <input
//   placeholder="User Email"
//   onChange={(e) => setNewUserEmail(e.target.value)}
// />
// <input type="text"
//   placeholder="User Name"
//   onChange={(e) => setNewUserName(e.target.value)}
// />
// <select onChange={(e) => setNewUserRole(e.target.value)}>
//   <option value="">Select Role</option>
//   <option value="facility_reporter">Facility Reporter</option>
//   <option value="district_officer">District Officer</option>
//   <option value="regional_supervisor">Regional Supervisor</option>
//   <option value="national_admin">National Admin</option>
//   <option value="auditor">Auditor</option>
// </select>
// <button onClick={createUser}>Create User</button>
// {/*delete user*/}
//  {users.map(user => (
//   <div key={user._id}>
//     {user.email} - {user.role}
//     <button onClick={() => deleteUser(user._id)}>Delete</button>
//   </div>
// ))} 
// {users.map(user => (
//   <div key={user._id} className="card">
//     <p>{user.email}</p>

//     <select
//       value={user.role}
//       onChange={(e) => updateUserRole(user._id, e.target.value)}
//     >
//       <option value="district_officer">District</option>
//       <option value="regional_supervisor">Regional</option>
//       <option value="national_admin">Admin</option>
//     </select>

//     <button onClick={() => deleteUser(user._id)}>Delete</button>
//   </div>
// ))}

//   </div>
//         {/*Admin role*/}
// </div>
// {/*RIGHT PANEL*/}
// <div className="panel">
//   {/* FACILITIES */}
// {facilities.map(f => (
//   <div key={f._id} className="card">
//     {f.name} - {f.location}
//   </div>
// ))}
// {/* create faility */}
// <div className="card">
//   <h3>Create Facility</h3>
//   <div className="form">
//   <input 
//     placeholder="Name"
//     value={newFacilityName}
//     onChange={(e) => setNewFacilityName(e.target.value)}
//   />

//   <input
//     placeholder="Location"
//     value={newFacilityLocation}
//     onChange={(e) => setNewFacilityLocation(e.target.value)}
//   />
// <input
//   placeholder="District"
//   value={newFacilityDistrict}
//   onChange={(e) => setNewFacilityDistrict(e.target.value)}
// />
// <input
//   placeholder="Region"
//   value={newFacilityRegion}
//   onChange={(e) => setNewFacilityRegion(e.target.value)}
// />
// <select placeholder="Type" value={newFacilityType} onChange={(e) =>setNewFacilityType(e.target.value)}>
//   <option value="hospital">Hospital</option>
//   <option value="clinic">Clinic</option>
// </select>
//   <button onClick={createFacility}>Create</button>
//   </div>
  
// </div>

// {/* facility list */}
// {facilities.map(f => (
//   <div key={f._id} className="card">
//     {f.name} - {f.location}

//     <button onClick={() => deleteFacility(f._id)}>Delete</button>
//   </div>
// ))}
// </div>


// {/* AUDIT LOGS */}
// {logs.map(log => (
//   <div key={log._id} className="card">
//     {log.changedBy?.email} changed {log.fromStatus} → {log.toStatus}
//   </div>
// ))}



//       {/* CREATE INCIDENT */}
//       <div className="card">
//         <h3>Create Incident</h3>

//         <select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="">Select Type</option>
//           <option value="drug_stockout">Drug Stockout</option>
//           <option value="equipment_failure">Equipment Failure</option>
//           <option value="utility_failure">Utility Failure</option>
//           <option value="staffing_issue">Staffing Issue</option>
//         </select>

//         <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
//           <option value="">Select Severity</option>
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//         </select>

//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <button onClick={createIncident}>Submit</button>
//       </div>

//       {/* FILTER */}
//       <select onChange={(e) => setFilter(e.target.value)}>
//         <option value="all">All</option>
//         <option value="submitted">Submitted</option>
//         <option value="in_progress">In Progress</option>
//         <option value="resolved">Resolved</option>
//       </select>

//       {/* CHART */}
//       <PieChart width={300} height={250}>
//         <Pie data={getChartData()} dataKey="value" outerRadius={80}>
//           {getChartData().map((_, index) => (
//             <Cell key={index} fill={COLORS[index]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>

//       {/* INCIDENTS */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : filtered.length === 0 ? (
//         <p>No incidents found</p>
//       ) : (
//         filtered.map((incident) => (
//           <div key={incident._id} className="card">
//             <h4>{incident.type.replace("_", " ")}</h4>

//             <p>
//               Status:
//               <span
//                 style={{
//                   backgroundColor: getStatusColor(incident.status),
//                   color: "#fff",
//                   padding: "4px 10px",
//                   marginLeft: "8px",
//                   borderRadius: "20px"
//                 }}
//               >
//                 {incident.status}
//               </span>
//             </p>

//             <p style={{ color: getSeverityColor(incident.severity) }}>
//               Severity: {incident.severity}
//             </p>

//             {/* ACTIONS */}
//             {role === "district_officer" && (
//               <button onClick={() => updateStatus(incident._id, "acknowledged")}>
//                 Acknowledge
//               </button>
//             )}

//             {role === "regional_supervisor" && (
//               <button onClick={() => updateStatus(incident._id, "in_progress")}>
//                 In Progress
//               </button>
//             )}

//             {role === "national_admin" && (
//               <>
//                 <button onClick={() => updateStatus(incident._id, "resolved")}>
//                   Resolve
//                 </button>
//                 <button onClick={() => updateStatus(incident._id, "closed")}>
//                   Close
//                 </button>
//               </>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//     </div>
//   );
// }
  //<=====================Main end====================>
return (
  <div className="container-fluid p-4">
    
    {/* HEADER */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 className="fw-bold">PH-ISRM Dashboard</h3>
      <button className="btn btn-danger" onClick={logout}>
        Logout
      </button>
    </div>

    {/* ADMIN PANEL */}
    {role === "national_admin" && (
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Admin Panel</h5>

          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-primary" onClick={fetchUsers}>
              View Users
            </button>
            <button className="btn btn-outline-success" onClick={fetchFacilities}>
              View Facilities
            </button>
            <button className="btn btn-outline-dark" onClick={fetchLogs}>
              View Logs
            </button>
          </div>
        </div>
      </div>
    )}
    {/*View logs current code*/}
    {role === "national_admin" && logs.length > 0 && (
  <div className="card shadow-sm mt-4">
    <div className="card-body">
      <h5>Audit Logs</h5>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>User</th>
            <th>Incident</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.changedBy?.email}</td>
              <td>{log.incident}</td>
              <td>{log.fromStatus}</td>
              <td>{log.toStatus}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
    {/*View log current code end*/}
    {/*Current code*/}{role === "national_admin" && users.length > 0 && (
  <div className="card shadow-sm mb-4">
    <div className="card-body">
      <h5>Users</h5>
      {/*Current code begin*/}
      <div className="card shadow-sm mb-4">
  <div className="card-body">
    <h5>Create User</h5>

    <div className="row g-2">
      <div className="col-md-4">
        <input
          className="form-control"
          placeholder="Name"
          onChange={(e) => setNewUserName(e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <input
          className="form-control"
          placeholder="Email"
          onChange={(e) => setNewUserEmail(e.target.value)}
        />
      </div>

      <div className="col-md-3">
        <select
          className="form-select"
          onChange={(e) => setNewUserRole(e.target.value)}
        >
          <option>Select Role</option>
          <option value="district_officer">District</option>
          <option value="regional_supervisor">Regional</option>
          <option value="national_admin">Admin</option>
        </select>
      </div>

      <div className="col-md-1">
        <button className="btn btn-primary w-100" onClick={createUser}>
          Add
        </button>
      </div>
    </div>
  </div>
</div>
      {/*Current code ends*/}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Update Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>
                <select
                  className="form-select"
                  value={user.role}
                  onChange={(e) =>
                    updateUserRole(user._id, e.target.value)
                  }
                >
                  <option value="district_officer">District</option>
                  <option value="regional_supervisor">Regional</option>
                  <option value="national_admin">Admin</option>
                </select>
              </td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
    {/*Current code end*/}
      {/*current*/}
        {role === "national_admin" && facilities.length > 0 && (
  <div className="card shadow-sm mb-4">
    <div className="card-body">
      <h5>Facilities</h5>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {facilities.map((f) => (
            <tr key={f._id}>
              <td>{f.name}</td>
              <td>{f.location}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteFacility(f._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
      {/*current*/}
    {/* STATS */}
    <div className="row g-3 mb-4">
      <div className="col-md-3">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h6>Total</h6>
            <h4>{incidents.length}</h4>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h6>Submitted</h6>
            <h4>{incidents.filter(i => i.status === "submitted").length}</h4>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h6>In Progress</h6>
            <h4>{incidents.filter(i => i.status === "in_progress").length}</h4>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h6>Resolved</h6>
            <h4>{incidents.filter(i => i.status === "resolved").length}</h4>
          </div>
        </div>
      </div>
    </div>

    {/* CREATE INCIDENT */}
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5>Create Incident</h5>

        <div className="row g-3">
          <div className="col-md-4">
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="drug_stockout">Drug Stockout</option>
              <option value="equipment_failure">Equipment Failure</option>
              <option value="utility_failure">Utility Failure</option>
              <option value="staffing_issue">Staffing Issue</option>
            </select>
          </div>

          <div className="col-md-4">
            <select className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="">Select Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="col-md-12">
            <textarea
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-md-12">
            <button className="btn btn-primary" onClick={createIncident}>
              Submit Incident
            </button>
          </div>
        </div>
      </div>
    </div>
    {/*current facility form*/}
  {role === "national_admin" && (
  <div className="card shadow-sm mb-4">
    <div className="card-body">
      <h5>Create Facility</h5>

      <div className="row g-2">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Name"
            value={newFacilityName}
            onChange={(e) => setNewFacilityName(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Location"
            value={newFacilityLocation}
            onChange={(e) => setNewFacilityLocation(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={newFacilityType}
            onChange={(e) => setNewFacilityType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="hospital">Hospital</option>
            <option value="clinic">Clinic</option>
          </select>
        </div>

        <div className="col-md-1">
          <button
            className="btn btn-success w-100"
            onClick={createFacility}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
)}

 {/* FILTER */}
       <select onChange={(e) => setFilter(e.target.value)}>
         <option value="all">All</option>
         <option value="submitted">Submitted</option>
         <option value="in_progress">In Progress</option>
         <option value="resolved">Resolved</option>
       </select>

    {/*current facility form*/}
    {/* INCIDENT LIST */}
    <div className="card shadow-sm">
      <div className="card-body">
        <h5>Incidents</h5>

        {loading ? (
          <p>Loading...</p>
        ) : incidents.length === 0 ? (
          <p>No incidents found</p>
        ) : (
          incidents.map((incident) => (
            <div key={incident._id} className="border rounded p-3 mb-3">
              
              <div className="d-flex justify-content-between">
                <h6>{incident.type.replace("_", " ")}</h6>
                
                <div>
                  <span className="badge bg-secondary me-2">
                    {incident.status}
                  </span>

                  <span className={`badge ${
                    incident.severity === "high"
                      ? "bg-danger"
                      : incident.severity === "medium"
                      ? "bg-warning text-dark"
                      : "bg-success"
                  }`}>
                    {incident.severity}
                  </span>
                </div>
              </div>

              <p className="mt-2">{incident.description}</p>

              {/* ACTION BUTTONS */}
              <div className="mt-2">
                {role === "district_officer" && (
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => updateStatus(incident._id, "acknowledged")}
                  >
                    Acknowledge
                  </button>
                )}

                {role === "regional_supervisor" && (
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => updateStatus(incident._id, "in_progress")}
                  >
                    In Progress
                  </button>
                )}

                {role === "national_admin" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => updateStatus(incident._id, "resolved")}
                    >
                      Resolve
                    </button>

                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => updateStatus(incident._id, "closed")}
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>

  </div>
);

// // // //<======Code to be remove after copied==========>
// import { useEffect, useState } from "react";
// import API from "../services/api";
// import axios from "axios";
// //import { Cursor } from "mongoose";
// import {PieChart, Pie, Cell, Tooltip, Legend} from "recharts";
// import "../styles/dashboard.css";

// export default function Dashboard() {

//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   //state for charts  

// const getChartData = () => {
//   const counts = {
//     submitted: 0,
//     in_progress: 0,
//     resolved: 0,
//     closed: 0
//   };

//   incidents.forEach(i => {
//     if (counts[i.status] !== undefined) {
//       counts[i.status]++;
//     }
//   });

//   return Object.keys(counts).map(key => ({
//     name: key,
//     value: counts[key]
//   }));
// };



// const COLORS = ["#6c757d", "#fd7e14", "#198754", "#212529"];
// //Incident form states
//   const [type, setType] = useState("");
//   const [severity, setSeverity] = useState("");
//   const [description, setDescription] = useState("");

//   let role = "";
//   // Admin role stat
// const [users, setUsers] = useState([]);
// const [facilities, setFacilities] = useState([]);
// const [logs, setLogs] = useState([]);

// const fetchUsers = async () => {
//   try{
//     const res = await API.get("/");
//   setUsers(res.data.data);
//   }catch(error){
//     console.log(error);
//   }
// };

// const fetchFacilities = async () => {
//   const res = await API.get("/");
//   setFacilities(res.data.data);
// };

// const fetchLogs = async () => {
//   const res = await API.get("/");
//   setLogs(res.data.data);
// };

//   try{
//       const token = localStorage.getItem("token");
//       if(token){
//         const decoded = JSON.parse(atob(token.split(".")[1]));
//         role = decoded.role;
//       }
//     }catch(error){
//         console.log("Token error", error);
//       }

//       //helper function to get status color
//      const getStatusColor = (status) => {
//     const s = status?.toLowerCase();

//     if (s === "submitted") return "#6c757d";   // gray
//     if (s === "acknowledged") return "#0d6efd"; // blue
//     if (s === "in_progress") return "#fd7e14"; // orange
//     if (s === "resolved") return "#198754";    // green
//     if (s === "closed") return "#212529";      // dark

//     return "#6c757d";
//   };
//       //Helper function to get severity color
//       const getSeverityColor = (severity) => {
//         if(severity === "high") return "red";
//         if(severity === "medium") return "orange";
//         return "green";
//       }

//        useEffect(() => {
//     //Protection: if no token, redirect to login
//     const token = localStorage.getItem("token");
//       if(!token){
//         window.location.href = "/";
//       }
// //Fetch incidents
//     const fetchIncidents = async () => {
//       try {
//        //const res = await API.get("/incidents"); old code
//        const res = await axios.get("http://localhost:5000/api/incidents", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//        });
//         setIncidents(res.data.data);
//         setLoading(false); //added code to stop loading
//       } catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     };

//     fetchIncidents();

//   }, []);

// //create incident
//   const createIncident = async ()=>{
//     try{
//       await API.post("/incidents", {
//         type,
//         severity,
//         description,
//         occurredAt: new Date
//       });
//       //console.log("Success:", res.data );
//       alert("Incident created");
//       //Refresh list
//       const res = await API.get("/incidents");
//       setIncidents(res.data.data);

//       //clear form
//       setType("");
//       setSeverity("");
//       setDescription("");

//     }catch(error){  
//       console.log("ERROR", error.response?.data);
//       alert(error.response?.data?.message) || "Something went wrong";
//     }
//   }

//   // const [incidents, setIncidents] = useState([]);
//   // const [loading, setLoading] = useState(true);

// //   useEffect(() => { <===MOVE ABOVE===>
// //     //Protection: if no token, redirect to login
// //     const token = localStorage.getItem("token");
// //       if(!token){
// //         window.location.href = "/";
// //       }
// // //Fetch incidents
// //     const fetchIncidents = async () => {
// //       try {
// //         const res = await API.get("/incidents");
// //         setIncidents(res.data.data);
// //       } catch (error) {
// //         console.log(error);
// //       }
// //     };

// //     fetchIncidents();

// //   }, []);

//   //Update status
//     const updateStatus = async (id, newStatus) =>{
//       try{
//         await API.put(`/incidents/${id}`, {status: newStatus});
//         alert("Status updated");

//         //Refresh incidents
//         const res = await API.get("/incidents");
//         setIncidents(res.data.data);
//       }catch(error){
//         console.log(error.response?.data?.message);
//       }
//     };
//       //Style buttons 
//       const buttonStyle = {
//         marginRight: "8px",
//         padding: "6px 12px",
//         border: "none",
//         borderRadius: "6px",
//         Cursor: "pointer",
//         backgroundColor: "0de6fd",
//         color: "white"
//       }


//     //Logout 
//     const logout = () => {
//       localStorage.removeItem("token");
//       window.location.href = "/";
//     };
//     // let role = ""; <====MOVE ABOVE====>
    
//     //const user = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
//     //const role = user.role
//     // try{ <===MOVE ABOVE====>
//     //   const token = localStorage.getItem("token");
//     //   if(token){
//     //     const decoded = JSON.parse(atob(token.split(".")[1]));
//     //     role = decoded.role;
//     //   }
//     // }catch(error){
//     //     console.log("Token error", error);
//     //   }
//     //Filter state
//     const [filter, setFilter] = useState("all"); 
//     // filter incidents based on status 
//     const filteredIncidents = filter === "all" ? incidents : incidents.filter(i => i.status === filter);
//     //<===============================================Code Replaced=======================================================>
//     return (
//   <div className="continer" //style={{
//     //  maxWidth: "700px",
//     //   margin: "auto",
//     //    padding: "20px",
//     //    fontFamily: "Arial, sans-serif" }}
//     >
//       <div className="header">
//         <h2>Dashboard</h2>
//         <button onClick={logout}>Logout</button>
//       </div>
//       {/*Admin role*/}
//       {role === "national_admin" && (
//   <div className="card">
//     <h3>Admin Panel</h3>

//     <button onClick={fetchUsers}>View Users</button>
//     <button onClick={fetchFacilities}>View Facilities</button>
//     <button onClick={fetchLogs}>View Audit Logs</button>
//   </div>
// )}
// {/* USERS */}
// {users.map(user => (
//   <div key={user._id} className="card">
//     {user.email} - {user.role}
//   </div>
// ))}

// {/* FACILITIES */}
// {facilities.map(f => (
//   <div key={f._id} className="card">
//     {f.name} - {f.location}
//   </div>
// ))}

// {/* AUDIT LOGS */}
// {logs.map(log => (
//   <div key={log._id} className="card">
//     {log.changedBy?.email} changed {log.fromStatus} → {log.toStatus}
//   </div>
// ))}


//       {/* Stats*/}
//       <div className="stats">
//         <div className="stat-box">
//           Submitted: {incidents.filter(i => i.status === "submitted").length}
//         </div>
//         <div className="stat-box">
//           In Progress: {incidents.filter(i => i.status === "in_progress").length}
//         </div>
//         <div className="stat-box">
//           Resolved: {incidents.filter(i => i.status === "resolved").length}
//         </div>
//       </div>

//     <p>Logged in as <strong>{role}</strong></p>

//       {/*Create Incident*/}
//       <div className="card">
//         <h3>Create Incident</h3>

//     <select value={type} onChange={(e) => setType(e.target.value)}>
//       <option value="">Select Type</option>
//       <option value="drug_stockout">Drug Stockout</option>
//       <option value="equipment_failure">Equipment Failure</option>
//       <option value="utility_failure">Utility Failure</option>
//       <option value="staffing_issue">Staffing Issue</option>
//     </select>

//     <br /><br />

//     <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
//       <option value="">Select Severity</option>
//       <option value="low">Low</option>
//       <option value="medium">Medium</option>
//       <option value="high">High</option>
//     </select>

//     <br /><br />

//     <textarea
//       placeholder="Description"
//       value={description}
//       onChange={(e) => setDescription(e.target.value)}
//     />

//     <br /><br />

//     <button style={buttonStyle} onClick={createIncident}>Submit Incident</button>
//       </div>

//     <hr />
//     {/*Incidents*/}
//       {incidents.map((incident) => (
//         <div key={incident._id} className="card">
//           <h4>{incident.type.replace("_", " ")}</h4>
//           <p>{incident.description}</p>

//           <p>
//             status:{" "}
//             <span className={`badge ${incident.status === "submitted" ? "grey"
//             : incident.status === "acknowledged" ? "blue"
//             : incident.status === "in_progress" ? "orange"
//             : incident.status === "resolved" ? "green"
//             : "black"
//           }`}>
//           {incident.status}
//           </span>
//           </p>
//           <p className={`severity-${incident.severity}`}>
//             Severity: {incident.severity}
//           </p>

//           {/*Actions*/}
//           {role === "district_officer" && (
//             <button onClick={() =>updateStatus(incident._id, "acknowledge")}>
//               Acknowledge
//             </button>
//           )}
//           {role === "regional_supervisor" && (
//             <button onClick={() =>updateStatus(incident._id, " in_progress")}>
//               start progress
//             </button>
//           )}
//           {role === "national_admin" && (
//             <>
//             <button onClick={() =>updateStatus(incident._id, "resolved")}>
//               Resolve
//             </button>
//             <button onClick={() =>updateStatus(incident._id, "closed")}>
//               close
//             </button>
//             </>
            
//           )}

//         </div>
//       ))}
//     {/* Loading & Empty States */}
//     {loading ? (
//       <p>Loading...</p>
//     ) : incidents.length === 0 ? (
//       <p>No incidents found</p>
//     ) : (
//       <>
//       <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//   <div style={{ flex: 1, padding: "10px", background: "#f1f1f1", borderRadius: "8px" }}>
//     <h4>Total</h4>
//     <p>{incidents.length}</p>
//   </div>

//   <div style={{ flex: 1, padding: "10px", background: "#e7f5ff", borderRadius: "8px" }}>
//     <h4>Submitted</h4>
//     <p>{incidents.filter(i => i.status === "submitted").length}</p>
//   </div>

//   <div style={{ flex: 1, padding: "10px", background: "#fff3cd", borderRadius: "8px" }}>
//     <h4>In Progress</h4>
//     <p>{incidents.filter(i => i.status === "in_progress").length}</p>
//   </div>

//   <div style={{ flex: 1, padding: "10px", background: "#d4edda", borderRadius: "8px" }}>
//     <h4>Resolved</h4>
//     <p>{incidents.filter(i => i.status === "resolved").length}</p>
//   </div>
// </div>

// <select onChange={(e) => setFilter(e.target.value)}>
//   <option value="all">All</option>
//   <option value="submitted">Submitted</option>
//   <option value="in_progress">In Progress</option>
//   <option value="resolved">Resolved</option>
// </select>
// {/* Pie Chart  */}
// <PieChart>
//   <Pie
//   data={getChartData()}
//   dataKey="value"
//   nameKey="name"
//   cx="50%"
//   cy="50%"
//   outerRadius={80}
//   label
//   >
//     {getChartData().map((entry, index) => (
//       <cell key={index} fill={COLORS[index % COLORS.length]} />
//     ))}
//   </Pie>
//   <Tooltip/>
//   <Legend />
// </PieChart>


//         {/* Incidents list */}
        
//         {filteredIncidents.map((incident) => (
//           <div
//             key={incident._id}
//             style={{
//               backgroundColor: "#fff",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               marginBottom: "15px",
//               padding: "15px",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.8)",
//               borderLeft: `5px solid ${getSeverityColor(incident.severity)}`
//             }}
//           >
//             <h4 style={{marginBottom: "5px"}}>
//               {incident.type.replace("_", " ")}
//             </h4>
//             <p><strong>Type:</strong> {incident.type}</p>

//             <p>
//               <strong>Status:</strong>{" "}
//               <span style={{ 
//                 backgroundcolor: getStatusColor(incident.status),
//                 color: "white",
//                 padding: "4px 10px",
//                 borderRadius: "20px",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 textTransform: "capitalize"
//                 }}>
//                 {incident.status.replace("_", " ")}
//               </span>
//             </p>

//             <p>
//               <strong>Severity:</strong>{" "}
//               <span style={{ color: getSeverityColor(incident.severity), fontWeight: "bold" }}>
//                 {incident.severity}
//               </span>
//             </p>
//               <div style= {{marginTop: "10px"}}>
//                 {/* Role-based actions */}
//             {role === "district_officer" && (
//               <button disabled={incident.status !== "submitted"} onClick={() => updateStatus(incident._id, "acknowledged")}>
//                 Acknowledge
//               </button>
//             )}

//             {role === "regional_supervisor" && (
//               <button  onClick={() => updateStatus(incident._id, "in_progress")}>
//                 In Progress
//               </button>
//             )}

//             {role === "national_admin" && (
//               <>
//                 <button onClick={() => updateStatus(incident._id, "resolved")}>
//                   Resolve
//                 </button>
//                 <button onClick={() => updateStatus(incident._id, "closed")}>
//                   Close
//                 </button>
//               </>
//             )}
//               </div>
            
//           </div>
//         ))}
//       </>
//     )}

//     <button onClick={logout}>Logout</button>
//   </div>
// );
// }
// //<===============================================Code Replaced End=======================================================>

// // import { useEffect, useState } from "react";
// // import API from "../services/api";

// // export default function Dashboard() {
// //   const [incidents, setIncidents] = useState([]);
// //   const [description, setDescription] = useState("");

// //   // Fetch incidents
// //   const fetchIncidents = async () => {
// //     const res = await API.get("/incidents");
// //     setIncidents(res.data.data);
// //   };

// //   // Create incident
// //   const createIncident = async () => {
// //     await API.post("/incidents", {
// //       type: "drug_stockout",
// //       severity: "high",
// //       description,
// //       occurredAt: new Date()
// //     });

// //     fetchIncidents();
// //   };

// //   // Update status
// //   const updateStatus = async (id, status) => {
// //     await API.put(`/incidents/${id}/status`, { status });
// //     fetchIncidents();
// //   };

// //   useEffect(() => {
// //     fetchIncidents();
// //   }, []);

// //   return (
// //     <div>
// //       <h2>Dashboard</h2>

// //       <input
// //         placeholder="Incident description"
// //         onChange={(e) => setDescription(e.target.value)}
// //       />
// //       <button onClick={createIncident}>Create Incident</button>

// //       <ul>
// //         {incidents.map((inc) => (
// //           <li key={inc._id}>
// //             {inc.description} - {inc.status}

// //             <button onClick={() => updateStatus(inc._id, "acknowledged")}>
// //               Acknowledge
// //             </button>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
}