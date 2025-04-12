import React, { useEffect } from 'react';

const App = () => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Health check response:', data);
      } catch (error) {
        console.error('Error fetching health check:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="App">
      <h1>Search Mate!</h1>
    </div>
  );
}

export default App;
