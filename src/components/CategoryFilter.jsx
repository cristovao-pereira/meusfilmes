import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import './CategoryFilter.css';

export const CategoryFilter = ({ categories, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleCategory = (category) => {
        if (selected.includes(category)) {
            onChange(selected.filter((c) => c !== category));
        } else {
            onChange([...selected, category]);
        }
    };

    const removeCategory = (category) => {
        onChange(selected.filter((c) => c !== category));
    };

    const clearAll = () => {
        onChange([]);
    };

    return (
        <div className="category-filter" ref={dropdownRef}>
            <button
                type="button"
                className="category-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>Categorias</span>
                {selected.length > 0 && (
                    <>
                        <span className="category-count">{selected.length}</span>
                        <div
                            role="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearAll();
                            }}
                            className="category-clear-btn"
                            title="Limpar categorias"
                        >
                            <X size={14} />
                        </div>
                    </>
                )}
                <ChevronDown size={18} className={isOpen ? 'chevron-open' : ''} />
            </button>

            {selected.length > 0 && (
                <div className="category-chips">
                    {selected.map((category) => (
                        <div key={category} className="category-chip">
                            <span>{category}</span>
                            <button
                                type="button"
                                onClick={() => removeCategory(category)}
                                className="chip-remove"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={clearAll} className="chip-clear-all">
                        Limpar tudo
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="category-dropdown animate-slideDown">
                    {categories.map((category) => (
                        <label key={category} className="category-option">
                            <input
                                type="checkbox"
                                checked={selected.includes(category)}
                                onChange={() => toggleCategory(category)}
                            />
                            <span>{category}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};
