import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { rulesAPI } from '../services/api';

const RuleCategory = () => {
  const { category } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategoryRules();
  }, [category]);

  const fetchCategoryRules = async () => {
    try {
      const response = await rulesAPI.getCategory(category);
      setCategoryData(response.data.data);
    } catch (error) {
      setError('Failed to load category rules');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-600 text-red-100';
      case 'medium':
        return 'bg-yellow-600 text-yellow-100';
      case 'low':
        return 'bg-green-600 text-green-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white">Loading rules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl mb-4">{error}</p>
          <button 
            onClick={fetchCategoryRules}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-red-400">
          <p className="text-xl mb-4">Category not found</p>
          <Link to="/rules" className="btn-primary">
            Back to Rules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/rules"
            className="text-primary hover:text-primary/80 mb-4 inline-block"
          >
            ← Back to All Rules
          </Link>
          
          <div className="flex items-center">
            <span className="text-4xl mr-4">{categoryData.icon}</span>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {categoryData.title}
              </h2>
              <p className="text-gray-400">
                {categoryData.rules.length} rules in this category
              </p>
            </div>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoryData.rules.map((rule) => (
            <div key={rule.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">
                  {rule.title}
                </h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                  {getSeverityIcon(rule.severity)} {rule.severity.toUpperCase()}
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">
                {rule.description}
              </p>
              
              <details className="bg-gray-700 rounded p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-300 hover:text-white mb-2">
                  📖 View Details
                </summary>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {rule.details}
                </p>
              </details>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 card">
          <h3 className="text-xl font-semibold mb-4 text-primary">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">HR Department</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">📧 hr@dayflow.com</p>
                <p className="text-gray-400">📞 +1 (555) 123-4567</p>
                <p className="text-gray-400">🏢 Room 204, Main Building</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Working Hours</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">Monday - Friday: 9:30 AM - 6:30 PM</p>
                <p className="text-gray-400">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-gray-400">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleCategory;