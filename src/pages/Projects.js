import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/helpers';
import '../styles/projects.css';

const Projects = () => {
  const { state, dispatch } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', members: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const fetchProjects = async () => {
    try {
      const response = await apiService.getProjects({}, 1, 10, search);
      setProjects(response.data.data.projects);
      dispatch({ type: 'SET_PROJECTS', payload: response.data.data.projects });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createProject(
        formData.title,
        formData.description,
        formData.members
      );
      setProjects([...projects, response.data.data]);
      dispatch({ type: 'ADD_PROJECT', payload: response.data.data });
      setFormData({ title: '', description: '', members: [] });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiService.deleteProject(id);
        setProjects(projects.filter(p => p._id !== id));
        dispatch({ type: 'DELETE_PROJECT', payload: id });
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        {['admin', 'manager'].includes(state.authUser?.role) && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreateProject} className="project-form">
          <input
            type="text"
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project._id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-meta">
              <span className={`status ${project.status}`}>{project.status}</span>
              <span>Started: {formatDate(project.startDate)}</span>
            </div>
            {['admin', 'manager'].includes(state.authUser?.role) && (
              <div className="project-actions">
                <button className="btn-secondary">Edit</button>
                <button 
                  onClick={() => handleDeleteProject(project._id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
