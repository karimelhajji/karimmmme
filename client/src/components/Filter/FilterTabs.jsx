const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'recent', label: 'Plus récents' },
    { id: 'popular', label: 'Populaires' },
    { id: 'following', label: 'Abonnements' }
  ]

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter.id
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
