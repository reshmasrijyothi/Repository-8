import React, { useState, useEffect } from 'react';
import petService from '../services/petService';

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    species: '',
    size: '',
    gender: '',
    minAge: '',
    maxAge: '',
    search: '',
    page: 1,
    limit: 12
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await petService.getPets(filters);
      setPets(response.pets || []);
      setTotalPages(Math.ceil((response.total || 0) / filters.limit));
    } catch (err) {
      setError(err.message || 'Failed to fetch pets');
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1 // Reset to first page when filters change
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search will trigger automatically due to useEffect
  };

  const clearFilters = () => {
    setFilters({
      species: '',
      size: '',
      gender: '',
      minAge: '',
      maxAge: '',
      search: '',
      page: 1,
      limit: 12
    });
  };

  const renderPetCard = (pet) => (
    <div key={pet._id} style={styles.petCard}>
      <div style={styles.petImageContainer}>
        {pet.photos && pet.photos.length > 0 ? (
          <img 
            src={pet.photos[0]} 
            alt={pet.name}
            style={styles.petImage}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x200/4CAF50/white?text=${pet.name}`;
            }}
          />
        ) : (
          <div style={styles.petImagePlaceholder}>
            <span style={styles.petEmoji}>
              {pet.species === 'dog' ? '🐕' : 
               pet.species === 'cat' ? '🐱' : '🐾'}
            </span>
            <span>{pet.name}</span>
          </div>
        )}
        
        {pet.featured && (
          <div style={styles.featuredBadge}>⭐ Featured</div>
        )}
        
        <div style={styles.statusBadge}>
          {pet.adoptionStatus === 'available' ? '✅ Available' :
           pet.adoptionStatus === 'pending' ? '⏳ Pending' : '❌ Adopted'}
        </div>
      </div>

      <div style={styles.petInfo}>
        <h3 style={styles.petName}>{pet.name}</h3>
        
        <div style={styles.petDetails}>
          <span style={styles.petDetail}>
            🏷️ {pet.breed} • {pet.size}
          </span>
          <span style={styles.petDetail}>
            🎂 {pet.age} years • {pet.gender}
          </span>
          {pet.shelter && (
            <span style={styles.petDetail}>
              🏠 {pet.shelter.name}
            </span>
          )}
        </div>

        <p style={styles.petDescription}>
          {pet.description && pet.description.length > 100 
            ? `${pet.description.substring(0, 100)}...`
            : pet.description || 'No description available'}
        </p>

        <div style={styles.petTraits}>
          {pet.temperament && pet.temperament.slice(0, 3).map((trait, index) => (
            <span key={index} style={styles.traitTag}>
              {trait}
            </span>
          ))}
        </div>

        <div style={styles.cardActions}>
          <button 
            style={styles.viewButton}
            onClick={() => window.location.href = `/pets/${pet._id}`}
          >
            👁️ View Details
          </button>
          
          {pet.adoptionStatus === 'available' && (
            <button 
              style={styles.adoptButton}
              onClick={() => window.location.href = `/adopt/${pet._id}`}
            >
              ❤️ Adopt Me
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Find Your Perfect Companion 🐾</h1>
        <p style={styles.subtitle}>
          Browse our amazing pets waiting for their forever homes
        </p>
      </div>

      {/* Filters Section */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersHeader}>
          <h3 style={styles.filtersTitle}>Filter & Search</h3>
          <button onClick={clearFilters} style={styles.clearButton}>
            🗑️ Clear All
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by name, breed, or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            🔍 Search
          </button>
        </form>

        <div style={styles.filtersGrid}>
          <select
            value={filters.species}
            onChange={(e) => handleFilterChange('species', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Species</option>
            <option value="dog">Dogs</option>
            <option value="cat">Cats</option>
            <option value="bird">Birds</option>
            <option value="rabbit">Rabbits</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Sizes</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>

          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <div style={styles.ageRange}>
            <input
              type="number"
              placeholder="Min age"
              value={filters.minAge}
              onChange={(e) => handleFilterChange('minAge', e.target.value)}
              style={styles.ageInput}
              min="0"
              max="20"
            />
            <span style={styles.ageRangeSeparator}>to</span>
            <input
              type="number"
              placeholder="Max age"
              value={filters.maxAge}
              onChange={(e) => handleFilterChange('maxAge', e.target.value)}
              style={styles.ageInput}
              min="0"
              max="20"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div style={styles.resultsContainer}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}>🔄</div>
            <p>Loading adorable pets...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>😿</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchPets} style={styles.retryButton}>
              🔄 Try Again
            </button>
          </div>
        ) : pets.length === 0 ? (
          <div style={styles.noResultsContainer}>
            <div style={styles.noResultsIcon}>🔍</div>
            <h3>No pets found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} style={styles.clearFiltersButton}>
              🗑️ Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div style={styles.resultsHeader}>
              <h3 style={styles.resultsTitle}>
                Found {pets.length} adorable pets
              </h3>
            </div>

            <div style={styles.petsGrid}>
              {pets.map(renderPetCard)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  disabled={filters.page <= 1}
                  style={{
                    ...styles.pageButton,
                    ...(filters.page <= 1 ? styles.disabledButton : {})
                  }}
                >
                  ← Previous
                </button>

                <span style={styles.pageInfo}>
                  Page {filters.page} of {totalPages}
                </span>

                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={filters.page >= totalPages}
                  style={{
                    ...styles.pageButton,
                    ...(filters.page >= totalPages ? styles.disabledButton : {})
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    color: '#2E7D32',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
    margin: 0
  },
  filtersContainer: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  filtersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  filtersTitle: {
    color: '#333',
    margin: 0
  },
  clearButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  searchInput: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  searchButton: {
    backgroundColor: '#2E7D32',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    alignItems: 'end'
  },
  filterSelect: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '0.9rem',
    backgroundColor: 'white'
  },
  ageRange: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  ageInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '0.9rem',
    width: '80px'
  },
  ageRangeSeparator: {
    color: '#666',
    fontSize: '0.9rem'
  },
  resultsContainer: {
    minHeight: '400px'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  loadingSpinner: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '15px'
  },
  noResultsContainer: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  noResultsIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  clearFiltersButton: {
    backgroundColor: '#FF6F00',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '15px'
  },
  resultsHeader: {
    marginBottom: '25px'
  },
  resultsTitle: {
    color: '#333',
    fontSize: '1.3rem',
    margin: 0
  },
  petsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
    marginBottom: '30px'
  },
  petCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  },
  petImageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden'
  },
  petImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  petImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4CAF50',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  petEmoji: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  featuredBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '#FF6F00',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  statusBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem'
  },
  petInfo: {
    padding: '20px'
  },
  petName: {
    color: '#2E7D32',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  },
  petDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '12px'
  },
  petDetail: {
    color: '#666',
    fontSize: '0.9rem'
  },
  petDescription: {
    color: '#555',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    marginBottom: '15px'
  },
  petTraits: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '20px'
  },
  traitTag: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  cardActions: {
    display: 'flex',
    gap: '10px'
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  adoptButton: {
    flex: 1,
    backgroundColor: '#FF6F00',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '30px'
  },
  pageButton: {
    backgroundColor: '#2E7D32',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  pageInfo: {
    color: '#666',
    fontSize: '1rem'
  }
};

// Add hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .pet-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
  }
  
  @media (max-width: 768px) {
    .filters-grid {
      grid-template-columns: 1fr !important;
    }
    
    .pets-grid {
      grid-template-columns: 1fr !important;
    }
    
    .search-form {
      flex-direction: column !important;
    }
    
    .card-actions {
      flex-direction: column !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default PetsPage;