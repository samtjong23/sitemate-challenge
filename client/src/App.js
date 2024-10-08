import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "./Alert";
import "./App.css";

const SERVER_URL = "http://localhost:5000/issues";
const ALERT_MESSAGE = "Both title and description are required.";

function App() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: "", description: "" });
  const [editMode, setEditMode] = useState(null);
  const [editFields, setEditFields] = useState({ title: "", description: "" });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const fetchIssues = async () => {
    const response = await axios.get(SERVER_URL);
    setIssues(response.data);
  };

  const createIssue = async () => {
    if (!newIssue.title || !newIssue.description) {
      setShowAlert(true);
      return;
    }

    const id = Date.now(); // Use timestamp as a unique ID
    const response = await axios.post(SERVER_URL, {
      id,
      ...newIssue,
    });
    setIssues([...issues, response.data]);
    setNewIssue({ title: "", description: "" });
  };

  const startEditing = (issue) => {
    setEditMode(issue.id);
    setEditFields({ title: issue.title, description: issue.description });
  };

  const saveIssue = async (id) => {
    if (!editFields.title || !editFields.description) {
      setShowAlert(true);
      return;
    }

    const response = await axios.put(`${SERVER_URL}/${id}`, {
      id,
      ...editFields,
    });
    setIssues(issues.map((issue) => (issue.id === id ? response.data : issue)));
    setEditMode(null);
  };

  const cancelEdit = () => {
    setEditMode(null);
  };

  const deleteIssue = async (id) => {
    await axios.delete(`${SERVER_URL}/${id}`);
    setIssues(issues.filter((issue) => issue.id !== id));
  };

  return (
    <div className="app-container">
      {showAlert && <Alert message={ALERT_MESSAGE} />}
      <h1 className="header-title">Issue Tracker</h1>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th className="table-header-cell id-column">ID</th>
              <th className="table-header-cell title-column">Title</th>
              <th className="table-header-cell description-column">
                Description
              </th>
              <th className="table-header-cell action-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td className="table-cell id-column">{issue.id}</td>
                <td className="table-cell title-column">
                  {editMode === issue.id ? (
                    <input
                      type="text"
                      value={editFields.title}
                      onChange={(e) =>
                        setEditFields({ ...editFields, title: e.target.value })
                      }
                      className="input-field"
                    />
                  ) : (
                    issue.title
                  )}
                </td>
                <td className="table-cell description-column">
                  {editMode === issue.id ? (
                    <input
                      type="text"
                      value={editFields.description}
                      onChange={(e) =>
                        setEditFields({
                          ...editFields,
                          description: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  ) : (
                    issue.description
                  )}
                </td>
                <td className="table-cell action-column">
                  {editMode === issue.id ? (
                    <>
                      <button
                        onClick={() => saveIssue(issue.id)}
                        className="button button-save"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="button button-cancel"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(issue)}
                        className="button button-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteIssue(issue.id)}
                        className="button button-delete"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className="table-cell id-column">New</td>
              <td className="table-cell title-column">
                <input
                  type="text"
                  value={newIssue.title}
                  onChange={(e) =>
                    setNewIssue({ ...newIssue, title: e.target.value })
                  }
                  placeholder="Title"
                  className="input-field"
                />
              </td>
              <td className="table-cell description-column">
                <input
                  type="text"
                  value={newIssue.description}
                  onChange={(e) =>
                    setNewIssue({ ...newIssue, description: e.target.value })
                  }
                  placeholder="Description"
                  className="input-field"
                />
              </td>
              <td className="table-cell action-column">
                <button onClick={createIssue} className="button button-add">
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
