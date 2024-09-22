import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const SERVER_URL = "http://localhost:5000/issues";

function App() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: "", description: "" });
  const [editMode, setEditMode] = useState(null);
  const [editFields, setEditFields] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const response = await axios.get(SERVER_URL);
    setIssues(response.data);
  };

  const createIssue = async () => {
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
      <h1 className="header-title">Issue Tracker</h1>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Title</th>
              <th className="table-header-cell">Description</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td className="table-cell">{issue.id}</td>
                <td className="table-cell">
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
                <td className="table-cell">
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
                <td className="table-cell">
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
              <td className="table-cell">New</td>
              <td className="table-cell">
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
              <td className="table-cell">
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
              <td className="table-cell">
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
