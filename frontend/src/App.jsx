// // Improved App.jsx with fixed pie chart rendering

// import React, { useState, useRef, useEffect } from 'react';
// import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from 'recharts';
// import { Loader2, SendHorizontal, Database, BarChart3 } from 'lucide-react';
// import axios from "./config/axios"; // Adjust the import based on your project structure
// import { PieChart, Pie, Cell } from 'recharts';

// // Main App Component
// export default function SQLChatApp() {


//   const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];

//   const [messages, setMessages] = useState([
//     { 
//       role: 'assistant', 
//       content: `Hi there! I can help you explore and analyze mental health data. Ask me anything—from stress levels and sleep patterns to depression scores and workplace impact—and I’ll uncover insights with charts and graphs. For example, you can ask how sleep hours affect anxiety scores. 
      
// Here's a sample record I analyze: 
// age: 29, gender: Female, employment_status: Full-time, work_environment: High-pressure, mental_health_history: Yes, seeks_treatment: Yes, stress_level: 8, sleep_hours: 5.5, physical_activity_days: 2, depression_score: 14, anxiety_score: 16, social_support_score: 4, productivity_score: 5.8, mental_health_risk: High. `,
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [selectedView, setSelectedView] = useState('chart'); // 'chart' or 'table'
//   const messagesEndRef = useRef(null);

//   // Auto scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: 'user', content: input, timestamp: new Date() };
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       const response = await axios.post('/ai/get-result', { query: input });

//       // Parse stringified JSON if needed
//       const rawData = typeof response.data === 'string'
//         ? JSON.parse(response.data)
//         : response.data;
      
//       console.log('Raw API response:', rawData);

//       // Process the chart data based on transformation code
//       let chartData = [];
//       try {
//         if (rawData.visualization && rawData.visualization.transformationCode) {
//           // Create a safe function from the transformation code
//           const transformCode = rawData.visualization.transformationCode;
          
//           // Extract just the function body
//           const functionBody = transformCode.substring(
//             transformCode.indexOf('{') + 1,
//             transformCode.lastIndexOf('}')
//           );
          
//           // Create a new function with the extracted body
//           const transformFunc = new Function('data', `
//             ${functionBody}
//           `);
          
//           chartData = transformFunc(rawData.tableData);
//           console.log('Transformed chart data:', chartData);
//         } else {
//           // Fallback to direct table data if no transformation code
//           chartData = rawData.tableData;
//         }
//       } catch (e) {
//         console.error('Error transforming data for chart:', e);
//         // Fallback to raw table data
//         chartData = rawData.tableData;
//       }

//       setMessages(prevMessages => [
//         ...prevMessages,
//         {
//           role: 'assistant',
//           content: rawData.explanation,
//           chartData: chartData,
//           tableData: rawData.tableData,
//           chartType: rawData.visualization?.chartType || 'bar',
//           timestamp: new Date()
//         }
//       ]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prevMessages => [
//         ...prevMessages,
//         {
//           role: 'assistant',
//           content: 'Sorry, I encountered an error processing your request. Please try again.',
//           timestamp: new Date()
//         }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderTable = (tableData) => {
//     if (!tableData || tableData.length === 0) return null;
    
//     const headers = Object.keys(tableData[0]);
    
//     return (
//       <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {headers.map((header, index) => (
//                 <th 
//                   key={index}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {tableData.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {headers.map((header, cellIndex) => (
//                   <td 
//                     key={cellIndex}
//                     className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
//                   >
//                     {row[header]}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderChart = (chartData, chartType) => {
//     if (!chartData || chartData.length === 0) {
//       console.log('No chart data available');
//       return null;
//     }

//     console.log('Rendering chart with data:', chartData);
//     console.log('Chart type:', chartType);

//     // Make sure numeric values are actually numbers
//     const processedData = chartData.map(item => {
//       const newItem = {...item};
//       // Convert string numbers to actual numbers
//       Object.keys(newItem).forEach(key => {
//         if (!isNaN(newItem[key]) && typeof newItem[key] === 'string') {
//           newItem[key] = parseFloat(newItem[key]);
//         }
//       });
//       return newItem;
//     });

//     return (
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <ResponsiveContainer width="100%" height={300}>
//           {chartType === 'line' ? (
//             <LineChart data={processedData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {Object.keys(processedData[0])
//                 .filter(key => key !== 'name')
//                 .map((key, index) => (
//                   <Line
//                     key={index}
//                     type="monotone"
//                     dataKey={key}
//                     stroke={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//             </LineChart>
//           ) : chartType === 'bar' ? (
//             <BarChart data={processedData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {Object.keys(processedData[0])
//                 .filter(key => key !== 'name')
//                 .map((key, index) => (
//                   <Bar
//                     key={index}
//                     dataKey={key}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//             </BarChart>
//           ) : chartType === 'pie' ? (
//             <PieChart>
//               <Pie
//                 data={processedData}
//                 dataKey="count"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
//               >
//                 {processedData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value) => [value, 'Count']} />
//               <Legend />
//             </PieChart>
//           ) : null}
//         </ResponsiveContainer>
//       </div>
//     );
//   };
  
//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-blue-600 text-white p-4 shadow-md">
//         <div className="container mx-auto flex items-center">
//           <Database className="mr-2" />
//           <h1 className="text-xl font-bold">SQL Analytics Assistant</h1>
//         </div>
//       </header>
      
//       {/* Chat interface */}
//       <div className="flex-1 overflow-auto p-4">
//         <div className="container mx-auto max-w-4xl">
//           {messages.map((message, index) => (
//             <div 
//               key={index} 
//               className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div 
//                 className={`p-4 rounded-lg max-w-3xl ${
//                   message.role === 'user' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-white shadow-md'
//                 }`}
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="font-semibold">
//                     {message.role === 'user' ? 'You' : 'SQL Assistant'}
//                   </span>
//                   <span className="text-xs opacity-70">
//                     {formatTime(message.timestamp)}
//                   </span>
//                 </div>
//                 <div className="text-sm whitespace-pre-wrap">
//                   {message.content}
//                 </div>
                
//                 {/* Data visualization section */}
//                 {(message.chartData || message.tableData) && (
//                   <div className="mt-4">
//                     <div className="flex justify-end space-x-2 mb-2">
//                       <button 
//                         onClick={() => setSelectedView('chart')}
//                         className={`p-1 rounded ${selectedView === 'chart' ? 'bg-gray-200' : ''}`}
//                         aria-label="Show chart view"
//                       >
//                         <BarChart3 size={16} />
//                       </button>
//                       <button 
//                         onClick={() => setSelectedView('table')}
//                         className={`p-1 rounded ${selectedView === 'table' ? 'bg-gray-200' : ''}`}
//                         aria-label="Show table view"
//                       >
//                         <span className="text-xs">Table</span>
//                       </button>
//                     </div>
                    
//                     {selectedView === 'chart'
//                       ? renderChart(message.chartData, message.chartType)
//                       : renderTable(message.tableData)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>
      
//       {/* Input area */}
//       <div className="p-4 bg-white border-t">
//         <div className="container mx-auto max-w-4xl">
//           <div className="flex">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//               placeholder="Ask a business question about your data..."
//               className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={loading}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={loading}
//               className="bg-blue-600 text-  white px-4 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {loading ? 
//                 <Loader2 className="animate-spin" /> : 
//                 <span>Send</span>
//               }
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from 'recharts';
import { Loader2, SendHorizontal, Database, BarChart3, Moon, Sun, Table } from 'lucide-react';
import axios from "./config/axios"; // Adjust the import based on your project structure
import { PieChart, Pie, Cell } from 'recharts';

// Main App Component
export default function SQLChatApp() {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];
  const DARK_COLORS = ['#bb86fc', '#03dac6', '#cf6679', '#b388ff', '#00b3a6', '#ffab40'];

  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Hi there! I can help you explore and analyze mental health data. Ask me anything—from stress levels and sleep patterns to depression scores and workplace impact—and I'll uncover insights with charts and graphs. For example, you can ask how sleep hours affect anxiety scores. 
      
Here's a sample record I analyze: 
age: 29, gender: Female, employment_status: Full-time, work_environment: High-pressure, mental_health_history: Yes, seeks_treatment: Yes, stress_level: 8, sleep_hours: 5.5, physical_activity_days: 2, depression_score: 14, anxiety_score: 16, social_support_score: 4, productivity_score: 5.8, mental_health_risk: High. `,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedView, setSelectedView] = useState('chart'); // 'chart' or 'table'
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle dark mode change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/ai/get-result', { query: input });

      // Parse stringified JSON if needed
      const rawData = typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data;
      
      console.log('Raw API response:', rawData);

      // Process the chart data based on transformation code
      let chartData = [];
      try {
        if (rawData.visualization && rawData.visualization.transformationCode) {
          // Create a safe function from the transformation code
          const transformCode = rawData.visualization.transformationCode;
          
          // Extract just the function body
          const functionBody = transformCode.substring(
            transformCode.indexOf('{') + 1,
            transformCode.lastIndexOf('}')
          );
          
          // Create a new function with the extracted body
          const transformFunc = new Function('data', `
            ${functionBody}
          `);
          
          chartData = transformFunc(rawData.tableData);
          console.log('Transformed chart data:', chartData);
        } else {
          // Fallback to direct table data if no transformation code
          chartData = rawData.tableData;
        }
      } catch (e) {
        console.error('Error transforming data for chart:', e);
        // Fallback to raw table data
        chartData = rawData.tableData;
      }

      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'assistant',
          content: rawData.explanation,
          chartData: chartData,
          tableData: rawData.tableData,
          chartType: rawData.visualization?.chartType || 'bar',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const renderTable = (tableData) => {
    if (!tableData || tableData.length === 0) return null;
    
    const headers = Object.keys(tableData[0]);
    
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md overflow-x-auto`}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                {headers.map((header, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderChart = (chartData, chartType) => {
    if (!chartData || chartData.length === 0) {
      console.log('No chart data available');
      return null;
    }

    console.log('Rendering chart with data:', chartData);
    console.log('Chart type:', chartType);

    // Make sure numeric values are actually numbers
    const processedData = chartData.map(item => {
      const newItem = {...item};
      // Convert string numbers to actual numbers
      Object.keys(newItem).forEach(key => {
        if (!isNaN(newItem[key]) && typeof newItem[key] === 'string') {
          newItem[key] = parseFloat(newItem[key]);
        }
      });
      return newItem;
    });

    // Choose color scheme based on mode
    const colorScheme = darkMode ? DARK_COLORS : COLORS;

    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'line' ? (
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
              <XAxis 
                dataKey="name" 
                stroke={darkMode ? "#aaa" : "#666"}
                tick={{ fill: darkMode ? "#aaa" : "#666" }}
              />
              <YAxis 
                stroke={darkMode ? "#aaa" : "#666"}
                tick={{ fill: darkMode ? "#aaa" : "#666" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#222' : '#fff',
                  border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
                  color: darkMode ? '#eee' : '#333'
                }} 
              />
              <Legend wrapperStyle={{ color: darkMode ? "#eee" : "#333" }} />
              {Object.keys(processedData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={key}
                    stroke={colorScheme[index % colorScheme.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
            </LineChart>
          ) : chartType === 'bar' ? (
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
              <XAxis 
                dataKey="name" 
                stroke={darkMode ? "#aaa" : "#666"}
                tick={{ fill: darkMode ? "#aaa" : "#666" }}
              />
              <YAxis 
                stroke={darkMode ? "#aaa" : "#666"}
                tick={{ fill: darkMode ? "#aaa" : "#666" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#222' : '#fff',
                  border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
                  color: darkMode ? '#eee' : '#333'
                }} 
              />
              <Legend wrapperStyle={{ color: darkMode ? "#eee" : "#333" }} />
              {Object.keys(processedData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar
                    key={index}
                    dataKey={key}
                    fill={colorScheme[index % colorScheme.length]}
                  />
                ))}
            </BarChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={processedData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorScheme[index % colorScheme.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Count']}
                contentStyle={{ 
                  backgroundColor: darkMode ? '#222' : '#fff',
                  border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
                  color: darkMode ? '#eee' : '#333'
                }} 
              />
              <Legend wrapperStyle={{ color: darkMode ? "#eee" : "#333" }} />
            </PieChart>
          ) : null}
        </ResponsiveContainer>
      </div>
    );
  };
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'} transition-colors duration-200`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-600'} text-white p-4 shadow-md transition-colors duration-200`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="text-indigo-200" />
            <h1 className="text-xl font-bold">SQL Analytics Assistant</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-400'} transition-colors duration-200`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      
      {/* Chat interface */}
      <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">
        <div className="container mx-auto max-w-4xl space-y-6">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`p-4 rounded-lg max-w-3xl ${
                  message.role === 'user' 
                    ? `${darkMode ? 'bg-indigo-800' : 'bg-indigo-600'} text-white`
                    : `${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-md`
                } transition-colors duration-200`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold flex items-center">
                    {message.role === 'user' ? 'You' : (
                      <>
                        <Database size={16} className="mr-1 text-indigo-400" />
                        <span>SQL Assistant</span>
                      </>
                    )}
                  </span>
                  <span className={`text-xs ${message.role === 'user' ? 'opacity-70' : 'text-gray-400'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                
                {/* Data visualization section */}
                {(message.chartData || message.tableData) && (
                  <div className="mt-6">
                    <div className={`flex justify-end space-x-2 mb-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-2`}>
                      <button 
                        onClick={() => setSelectedView('chart')}
                        className={`p-2 rounded flex items-center transition-colors duration-200 ${
                          selectedView === 'chart' 
                            ? (darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800') 
                            : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                        }`}
                        aria-label="Show chart view"
                      >
                        <BarChart3 size={16} className="mr-1" />
                        <span className="text-xs">Chart</span>
                      </button>
                      <button 
                        onClick={() => setSelectedView('table')}
                        className={`p-2 rounded flex items-center transition-colors duration-200 ${
                          selectedView === 'table' 
                            ? (darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800') 
                            : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                        }`}
                        aria-label="Show table view"
                      >
                        <Table size={16} className="mr-1" />
                        <span className="text-xs">Table</span>
                      </button>
                    </div>
                    
                    <div className="rounded-lg overflow-hidden">
                      {selectedView === 'chart'
                        ? renderChart(message.chartData, message.chartType)
                        : renderTable(message.tableData)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className={`p-4 ${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} transition-colors duration-200`}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a business question about your data..."
              className={`flex-1 p-3 rounded-l-lg focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500'
              } transition-colors duration-200`}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className={`px-4 rounded-r-lg flex items-center justify-center min-w-[80px] ${
                darkMode
                  ? 'bg-indigo-700 hover:bg-indigo-600 focus:ring-indigo-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              } text-white focus:outline-none focus:ring-2 transition-colors duration-200`}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <div className="flex items-center">
                  <span className="mr-1">Send</span>
                  <SendHorizontal size={16} />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
