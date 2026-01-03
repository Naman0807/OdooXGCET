import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './RulesDashboard.css';

const RulesDashboard = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    priority: 'medium',
    isDraft: false
  });

  const ruleCategories = [
    'Attendance & Punctuality',
    'Leave Policy',
    'Code of Conduct',
    'Benefits & Compensation',
    'Workplace Safety',
    'Performance & Development',
    'IT & Security',
    'General HR Policies'
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: '#28a745' },
    { value: 'medium', label: 'Medium', color: '#ffc107' },
    { value: 'high', label: 'High', color: '#dc3545' },
    { value: 'critical', label: 'Critical', color: '#6f42c1' }
  ];

  useEffect(() => {
    fetchRules();
    fetchCategories();
  }, []);

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/rules', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rules');
      }

      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/rules/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingRule 
        ? `http://localhost:5000/api/rules/${editingRule.id}`
        : 'http://localhost:5000/api/rules';
      
      const method = editingRule ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingRule ? 'update' : 'create'} rule`);
      }

      const result = await response.json();
      alert(result.message || `Rule ${editingRule ? 'updated' : 'created'} successfully`);
      
      setShowAddForm(false);
      setEditingRule(null);
      setFormData({
        title: '',
        category: '',
        content: '',
        priority: 'medium',
        isDraft: false
      });
      
      fetchRules();
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      title: rule.title,
      category: rule.category,
      content: rule.content,
      priority: rule.priority,
      isDraft: rule.isDraft
    });
    setShowAddForm(true);
  };

  const handleDelete = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/rules/${ruleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete rule');
      }

      alert('Rule deleted successfully');
      fetchRules();
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const getPriorityColor = (priority) => {
    const level = priorityLevels.find(p => p.value === priority);
    return level ? level.color : '#6c757d';
  };

  const getPriorityLabel = (priority) => {
    const level = priorityLevels.find(p => p.value === priority);
    return level ? level.label : 'Medium';
  };

  const filteredRules = user.role === 'admin' 
    ? rules 
    : rules.filter(rule => !rule.isDraft);

  if (loading) {
    return <div className="rules-loading">Loading rules...</div>;
  }

  return (
    <div className="rules-dashboard">
      <div className="rules-header">
        <h1>HR Rules & Policies Management</h1>
        {user.role === 'admin' && (
          <button 
            className="add-rule-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Rule'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && user.role === 'admin' && (
        <div className="rule-form">
          <h2>{editingRule ? 'Edit Rule' : 'Create New Rule'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter rule title"
                />
              </div>
              
              <div className="form-group">
                <label>Category*</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {ruleCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Content*</label>
              <textarea
                required
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Enter detailed rule content..."
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Priority*</label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  {priorityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isDraft}
                    onChange={(e) => setFormData({...formData, isDraft: e.target.checked})}
                  />
                  Save as Draft
                </label>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingRule ? 'Update' : 'Create'} Rule
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingRule(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rules-content">
        {categories.length > 0 && (
          <div className="categories-overview">
            <h2>Categories Overview</h2>
            <div className="category-cards">
              {categories.map(category => (
                <div key={category.name} className="category-card">
                  <h3>{category.name}</h3>
                  <p>{category.ruleCount} rules</p>
                  <button 
                    className="view-category-btn"
                    onClick={() => window.location.href = `/rules/${encodeURIComponent(category.name)}`}
                  >
                    View Rules
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rules-list">
          <h2>All Rules</h2>
          <div className="rules-grid">
            {filteredRules.map(rule => (
              <div key={rule.id} className={`rule-card ${rule.isDraft ? 'draft' : ''}`}>
                <div className="rule-header">
                  <h3>{rule.title}</h3>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(rule.priority) }}
                  >
                    {getPriorityLabel(rule.priority)}
                  </span>
                  {rule.isDraft && <span className="draft-badge">Draft</span>}
                </div>
                
                <div className="rule-meta">
                  <span className="category-tag">{rule.category}</span>
                  <span className="date">
                    {new Date(rule.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="rule-content">
                  <p>{rule.content.length > 200 
                    ? `${rule.content.substring(0, 200)}...` 
                    : rule.content}
                  </p>
                </div>
                
                <div className="rule-actions">
                  <button 
                    className="view-btn"
                    onClick={() => window.location.href = `/rules/${encodeURIComponent(rule.category)}`}
                  >
                    View Details
                  </button>
                  {user.role === 'admin' && (
                    <>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(rule)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(rule.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesDashboard;