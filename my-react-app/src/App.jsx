import React, { useState } from 'react';
import ReportForm from './components/ReportForm';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [reports, setReports] = useState([]);
  const [searchLat, setSearchLat] = useState('');
  const [searchLng, setSearchLng] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'report', label: 'Report Issue' },
    { id: 'view', label: 'View Reports' },
  ];

  const handleSearchReports = async () => {
    if (!searchLat || !searchLng) {
      alert('Please enter both latitude and longitude');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`https://civicvoice-7.onrender.com/api/v1/reports?lat=${searchLat}&lng=${searchLng}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.data.reports || []);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Error fetching reports: ' + error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'report':
        return <ReportForm />;
      case 'view':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  Community Reports
                </h2>
                <p className="text-gray-600 text-lg">
                  View reports from your community and track their progress
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="text-2xl mr-2">📍</span>
                    Location Search
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Location
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Latitude"
                          value={searchLat}
                          onChange={(e) => setSearchLat(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Longitude"
                          value={searchLng}
                          onChange={(e) => setSearchLng(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSearchReports}
                      disabled={isSearching}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                    >
                      {isSearching ? '🔍 Searching...' : '🔍 Search Reports'}
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="text-2xl mr-2">📊</span>
                    Report Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-600">Total Reports</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-600">Resolved</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">0</div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-red-600">0</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </div>

              {reports.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Found Reports</h3>
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report._id} className="bg-white p-4 rounded-lg shadow border">
                        <h4 className="font-semibold">{report.title}</h4>
                        <p className="text-gray-600">{report.description}</p>
                        <p className="text-sm text-gray-500">Category: {report.category}</p>
                        <p className="text-sm text-gray-500">Status: {report.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reports.length === 0 && !isSearching && (
                <div className="mt-8 text-center">
                  <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Search for Reports
                    </h3>
                    <p className="text-gray-600">
                      Enter your location above to find reports near you
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  Welcome to CivicVoice
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Report issues anonymously and help improve your community.
                  Your voice matters in building a better society aligned with UN SDG 16.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">👤</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Anonymous Reporting</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Report issues without revealing your identity. Your privacy is protected.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🌍</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Community Impact</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Help mediators resolve issues and improve your neighborhood together.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Real-time Updates</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get notified when reports are addressed and issues are resolved.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setActiveTab('report')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  🚨 Report an Issue Now
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  It only takes 2 minutes to make a difference
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CivicVoice
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Anonymous Community Reporting Platform - UN SDG 16
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
