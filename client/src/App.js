import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [issues, setIssues] = useState([]);
    const [newIssue, setNewIssue] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        const response = await axios.get('http://localhost:5000/issues');
        setIssues(response.data);
    };

    const createIssue = async () => {
        const id = Date.now(); // Use timestamp as a unique ID
        const response = await axios.post('http://localhost:5000/issues', { id, ...newIssue });
        setIssues([...issues, response.data]);
        setNewIssue({ title: '', description: '' });
    };

    const updateIssue = async (id) => {
        const updatedTitle = prompt('Enter new title:', '');
        const updatedDescription = prompt('Enter new description:', '');
        const response = await axios.put(`http://localhost:5000/issues/${id}`, { id, title: updatedTitle, description: updatedDescription });
        setIssues(issues.map(issue => issue.id === id ? response.data : issue));
    };

    const deleteIssue = async (id) => {
        await axios.delete(`http://localhost:5000/issues/${id}`);
        setIssues(issues.filter(issue => issue.id !== id));
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
                        {issues.map(issue => (
                            <tr key={issue.id}>
                                <td className="table-cell">{issue.id}</td>
                                <td className="table-cell">{issue.title}</td>
                                <td className="table-cell">{issue.description}</td>
                                <td className="table-cell">
                                    <button 
                                        onClick={() => updateIssue(issue.id)} 
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
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className="table-cell">New</td>
                            <td className="table-cell">
                                <input
                                    type="text"
                                    value={newIssue.title}
                                    onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                                    placeholder="Title"
                                    className="input-field"
                                />
                            </td>
                            <td className="table-cell">
                                <input
                                    type="text"
                                    value={newIssue.description}
                                    onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                                    placeholder="Description"
                                    className="input-field"
                                />
                            </td>
                            <td className="table-cell">
                                <button 
                                    onClick={createIssue} 
                                    className="button button-add"
                                >
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
