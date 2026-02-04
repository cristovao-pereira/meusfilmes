import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import './MultiSelect.css';

export const MultiSelect = ({ label, options, selected, onChange, error }) => {
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

    const toggleOption = (option) => {
        if (selected.includes(option)) {
            onChange(selected.filter((o) => o !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const removeOption = (option) => {
        onChange(selected.filter((o) => o !== option));
    };

    return (
        <div className="multi-select-container" ref={dropdownRef}>
            {label && <label className="multi-select-label">{label}</label>}

            <div
                className={`multi-select-trigger ${isOpen ? 'active' : ''} ${error ? 'error' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="multi-select-content">
                    {selected.length === 0 ? (
                        <span className="multi-select-placeholder">Selecione as categorias</span>
                    ) : (
                        <div className="multi-select-chips">
                            {selected.map((option) => (
                                <span
                                    key={option}
                                    className="multi-select-chip"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeOption(option);
                                    }}
                                >
                                    {option}
                                    <X size={14} className="chip-remove-icon" />
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="multi-select-chevron-wrapper">
                    <ChevronDown size={18} className={`multi-select-chevron ${isOpen ? 'open' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="multi-select-dropdown">
                    {options.map((option) => {
                        const isSelected = selected.includes(option);
                        return (
                            <div
                                key={option}
                                className={`multi-select-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleOption(option)}
                            >
                                <span className="option-text">{option}</span>
                                {isSelected && <div className="option-check" />}
                            </div>
                        );
                    })}
                </div>
            )}

            {error && <span className="multi-select-error-message">{error}</span>}
        </div>
    );
};
