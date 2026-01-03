import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rulesAPI } from '../services/api';

const Rules = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRulesCategories();
  }, []);

  const fetchRulesCategories = async () => {
    try {
      const response = await rulesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      setError('Failed to load rules categories');
    } finally {
      setLoading(false);
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
            onClick={fetchRulesCategories}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">HRMS Rules & Policies</h2>
          <p className="text-gray-400">
            Comprehensive guidelines for employees and HR administration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/rules/${category.id}`}
              className="card hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  {category.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {category.ruleCount} rules
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 card">
          <h3 className="text-xl font-semibold mb-4 text-primary">Important Notice</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-yellow-400 mr-3">⚠️</span>
              <div>
                <p className="text-white font-medium">Policy Updates</p>
                <p className="text-gray-400 text-sm">
                  HR policies are updated quarterly. Please review regularly to stay informed.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-400 mr-3">ℹ️</span>
              <div>
                <p className="text-white font-medium">Contact HR</p>
                <p className="text-gray-400 text-sm">
                  For clarifications or special circumstances, please contact the HR department.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-3">📅</span>
              <div>
                <p className="text-white font-medium">Last Updated</p>
                <p className="text-gray-400 text-sm">
                  These rules were last updated on {new Date().toLocaleDateString()}. 
                  Changes are communicated via email and office announcements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;