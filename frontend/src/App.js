import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/pets`);
      setPets(response.data.pets || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch pets. Make sure the backend is running.');
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      alert(`Backend Status: ${response.data.message}`);
    } catch (err) {
      alert('Backend is not responding. Please check if it\'s running on port 5000.');
    }
  };

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>🐾 Pet Adoption Center</h1>
          <p>Loading pets...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🐾 Pet Adoption Center</h1>
        <p>Find Your Perfect Companion</p>
        <button 
          onClick={checkBackendHealth}
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Check Backend Status
        </button>
      </header>

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {error ? (
          <div style={{ 
            color: 'red', 
            textAlign: 'center', 
            padding: '20px',
            backgroundColor: '#ffebee',
            borderRadius: '5px',
            margin: '20px 0'
          }}>
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <button 
              onClick={fetchPets}
              style={{
                margin: '10px',
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <h2>Available Pets ({pets.length})</h2>
            {pets.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>
                No pets available at the moment.
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '20px'
              }}>
                {pets.map((pet) => (
                  <div 
                    key={pet.id || pet._id} 
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      padding: '20px',
                      backgroundColor: '#f9f9f9',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                      {pet.name}
                    </h3>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Species:</strong> {pet.species}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Breed:</strong> {pet.breed}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Age:</strong> {pet.age} years old
                    </p>
                    {pet.description && (
                      <p style={{ margin: '10px 0', color: '#555', fontStyle: 'italic' }}>
                        {pet.description}
                      </p>
                    )}
                    <p style={{ 
                      margin: '10px 0 0 0', 
                      fontWeight: 'bold', 
                      color: '#4CAF50',
                      fontSize: '18px'
                    }}>
                      Adoption Fee: ${pet.adoptionFee}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        marginTop: '40px'
      }}>
        <p>© 2024 Pet Adoption Center - Built with MERN Stack</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Backend: Node.js + Express + MongoDB | Frontend: React.js
        </p>
      </footer>
    </div>
  );
}

export default App;