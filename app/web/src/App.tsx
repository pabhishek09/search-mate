import React, { useEffect } from 'react';
import Chat from './chat/Chat';

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
    <div className="h-screen md:px-64 md:py-4">
      <Chat />
    </div>
  );
}

export default App;
