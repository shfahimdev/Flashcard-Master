import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const StudyTracker = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    chapter: '',
    topic: '',
    source: '',
    startTime: '',
    endTime: '',
    duration: 0,
    focus: 3,
    mood: 3,
    studyType: 'Concept',
    environment: 'Home',
    difficulty: 3,
    notes: '',
    goalAchieved: false
  });
  const [filters, setFilters] = useState({
    subject: '',
    chapter: '',
    dateFrom: '',
    dateTo: ''
  });
  const [errors, setErrors] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('studyEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('studyEntries', JSON.stringify(entries));
    }
  }, [entries]);

  // Auto-calculate duration
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diff = (end - start) / (1000 * 60 * 60);
      if (diff > 0) {
        setFormData(prev => ({ ...prev, duration: parseFloat(diff.toFixed(2)) }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.chapter.trim()) newErrors.chapter = 'Chapter is required';
    if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (formData.duration <= 0) newErrors.duration = 'End time must be after start time';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setEntries([...entries, { ...formData, id: Date.now() }]);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        chapter: '',
        topic: '',
        source: '',
        startTime: '',
        endTime: '',
        duration: 0,
        focus: 3,
        mood: 3,
        studyType: 'Concept',
        environment: 'Home',
        difficulty: 3,
        notes: '',
        goalAchieved: false
      });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getFilteredEntries = () => {
    return entries.filter(entry => {
      if (filters.subject && entry.subject !== filters.subject) return false;
      if (filters.chapter && entry.chapter !== filters.chapter) return false;
      if (filters.dateFrom && entry.date < filters.dateFrom) return false;
      if (filters.dateTo && entry.date > filters.dateTo) return false;
      return true;
    });
  };

  const filteredEntries = getFilteredEntries();

  // Helper: Calculate metrics
  const calculateMetrics = () => {
    const totalHours = filteredEntries.reduce((sum, e) => sum + e.duration, 0);
    
    const hoursBySubject = {};
    const hoursByChapter = {};
    const hoursByTopic = {};
    const focusBySubject = {};
    const focusByChapter = {};
    const focusByTopic = {};
    const focusCountBySubject = {};
    const focusCountByChapter = {};
    const focusCountByTopic = {};
    const hoursByDate = {};
    
    filteredEntries.forEach(e => {
      hoursBySubject[e.subject] = (hoursBySubject[e.subject] || 0) + e.duration;
      hoursByChapter[e.chapter] = (hoursByChapter[e.chapter] || 0) + e.duration;
      hoursByTopic[e.topic] = (hoursByTopic[e.topic] || 0) + e.duration;
      hoursByDate[e.date] = (hoursByDate[e.date] || 0) + e.duration;
      
      focusBySubject[e.subject] = (focusBySubject[e.subject] || 0) + e.focus;
      focusCountBySubject[e.subject] = (focusCountBySubject[e.subject] || 0) + 1;
      
      focusByChapter[e.chapter] = (focusByChapter[e.chapter] || 0) + e.focus;
      focusCountByChapter[e.chapter] = (focusCountByChapter[e.chapter] || 0) + 1;
      
      focusByTopic[e.topic] = (focusByTopic[e.topic] || 0) + e.focus;
      focusCountByTopic[e.topic] = (focusCountByTopic[e.topic] || 0) + 1;
    });

    const avgFocusBySubject = {};
    Object.keys(focusBySubject).forEach(s => {
      avgFocusBySubject[s] = (focusBySubject[s] / focusCountBySubject[s]).toFixed(2);
    });

    const avgFocusByChapter = {};
    Object.keys(focusByChapter).forEach(c => {
      avgFocusByChapter[c] = (focusByChapter[c] / focusCountByChapter[c]).toFixed(2);
    });

    const avgFocusByTopic = {};
    Object.keys(focusByTopic).forEach(t => {
      avgFocusByTopic[t] = (focusByTopic[t] / focusCountByTopic[t]).toFixed(2);
    });

    const goalsAchieved = filteredEntries.filter(e => e.goalAchieved).length;
    const goalCompletionRate = filteredEntries.length > 0 
      ? ((goalsAchieved / filteredEntries.length) * 100).toFixed(1) 
      : 0;

    const bestStudyDay = Object.entries(hoursByDate).sort((a, b) => b[1] - a[1])[0];
    
    // Calculate streak
    const sortedDates = [...new Set(entries.map(e => e.date))].sort();
    let streak = 0;
    let currentStreak = 0;
    let prevDate = null;
    
    sortedDates.forEach(dateStr => {
      const date = new Date(dateStr);
      if (prevDate) {
        const dayDiff = (date - prevDate) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          streak = Math.max(streak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      prevDate = date;
    });
    streak = Math.max(streak, currentStreak);

    const level = Math.floor(totalHours / 5) + 1;

    return {
      totalHours: totalHours.toFixed(2),
      hoursBySubject,
      hoursByChapter,
      hoursByTopic,
      avgFocusBySubject,
      avgFocusByChapter,
      avgFocusByTopic,
      goalCompletionRate,
      bestStudyDay: bestStudyDay ? `${bestStudyDay[0]} (${bestStudyDay[1].toFixed(2)}h)` : 'N/A',
      streak,
      level,
      hoursByDate
    };
  };

  const metrics = calculateMetrics();

  // Chart data
  const dailyStudyChartData = {
    labels: Object.keys(metrics.hoursByDate).sort(),
    datasets: [{
      label: 'Study Hours',
      data: Object.keys(metrics.hoursByDate).sort().map(d => metrics.hoursByDate[d]),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.3
    }]
  };

  const subjectPieData = {
    labels: Object.keys(metrics.hoursBySubject),
    datasets: [{
      data: Object.values(metrics.hoursBySubject),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
      ],
    }]
  };

  const chapterBarData = {
    labels: Object.keys(metrics.hoursByChapter),
    datasets: [{
      label: 'Hours',
      data: Object.values(metrics.hoursByChapter),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
    }]
  };

  const focusTrendData = {
    labels: filteredEntries.map((e, i) => `Entry ${i + 1}`),
    datasets: [{
      label: 'Focus Level',
      data: filteredEntries.map(e => e.focus),
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.5)',
      tension: 0.3
    }]
  };

  const uniqueSubjects = [...new Set(entries.map(e => e.subject))];
  const uniqueChapters = [...new Set(entries.map(e => e.chapter))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">Fahim's Study Journal</h1>
        
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Study Session</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Mathematics"
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chapter *</label>
              <input
                type="text"
                name="chapter"
                value={formData.chapter}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.chapter ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Calculus"
              />
              {errors.chapter && <p className="text-red-500 text-xs mt-1">{errors.chapter}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic *</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.topic ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Derivatives"
              />
              {errors.topic && <p className="text-red-500 text-xs mt-1">{errors.topic}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Textbook, YouTube"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.endTime ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Focus (1-5)</label>
              <input
                type="range"
                name="focus"
                min="1"
                max="5"
                value={formData.focus}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-center text-sm font-semibold">{formData.focus}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mood (1-5)</label>
              <input
                type="range"
                name="mood"
                min="1"
                max="5"
                value={formData.mood}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-center text-sm font-semibold">{formData.mood}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Study Type</label>
              <select
                name="studyType"
                value={formData.studyType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Concept</option>
                <option>Practice</option>
                <option>Revision</option>
                <option>Test</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
              <select
                name="environment"
                value={formData.environment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Home</option>
                <option>College</option>
                <option>Coaching</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty (1-5)</label>
              <input
                type="range"
                name="difficulty"
                min="1"
                max="5"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-center text-sm font-semibold">{formData.difficulty}</div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="2"
                placeholder="Any special observations..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="goalAchieved"
                checked={formData.goalAchieved}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Goal Achieved</label>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition font-semibold"
              >
                Add Study Session
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
              <select
                value={filters.chapter}
                onChange={(e) => setFilters({...filters, chapter: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Chapters</option>
                {uniqueChapters.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">Total Study Hours</div>
              <div className="text-3xl font-bold">{metrics.totalHours}</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">Goal Completion</div>
              <div className="text-3xl font-bold">{metrics.goalCompletionRate}%</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">Study Streak</div>
              <div className="text-3xl font-bold">{metrics.streak} days</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">Level</div>
              <div className="text-3xl font-bold">Level {metrics.level}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Hours by Subject</h3>
              {Object.entries(metrics.hoursBySubject).map(([subject, hours]) => (
                <div key={subject} className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{subject}</span>
                  <span className="font-semibold text-indigo-600">{hours.toFixed(2)}h</span>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Avg Focus by Subject</h3>
              {Object.entries(metrics.avgFocusBySubject).map(([subject, focus]) => (
                <div key={subject} className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{subject}</span>
                  <span className={`font-semibold ${focus < 3 ? 'text-red-600' : 'text-green-600'}`}>
                    {focus}/5
                  </span>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Hours by Chapter</h3>
              {Object.entries(metrics.hoursByChapter).map(([chapter, hours]) => (
                <div key={chapter} className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{chapter}</span>
                  <span className="font-semibold text-indigo-600">{hours.toFixed(2)}h</span>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Study Day</span>
                  <span className="font-semibold text-indigo-600">{metrics.bestStudyDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-semibold text-indigo-600">{filteredEntries.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        {filteredEntries.length > 0 && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Study Time</h2>
              <Line data={dailyStudyChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Study Time by Subject</h2>
                <Pie data={subjectPieData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Time by Chapter</h2>
                <Bar data={chapterBarData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Focus Trends Over Time</h2>
              <Line data={focusTrendData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        )}

        {filteredEntries.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No study sessions recorded yet. Add your first session above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTracker;
