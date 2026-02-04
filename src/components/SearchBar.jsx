import { Search, X } from 'lucide-react';
import './SearchBar.css';

export const SearchBar = ({ value, onChange, placeholder = 'Buscar filmes...' }) => {
    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="search-bar">
            <div className="search-icon">
                <Search size={20} />
            </div>
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button type="button" className="search-clear" onClick={handleClear}>
                    <X size={18} />
                </button>
            )}
        </div>
    );
};
