import './WatchedStatusFilter.css';

export const WatchedStatusFilter = ({ value, onChange }) => {
    const options = [
        { value: 'all', label: 'Todos' },
        { value: 'watched', label: 'Assistidos' },
        { value: 'unwatched', label: 'Não Assistidos' }
    ];

    return (
        <div className="watched-status-filter">
            {options.map(option => (
                <button
                    key={option.value}
                    className={`filter-btn ${value === option.value ? 'active' : ''}`}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
