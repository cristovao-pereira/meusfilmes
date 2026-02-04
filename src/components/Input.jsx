import './Input.css';

export const Input = ({
    label,
    error,
    icon: Icon,
    type = 'text',
    fullWidth = false,
    ...props
}) => {
    return (
        <div className={`input-wrapper ${fullWidth ? 'input-full-width' : ''}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-container">
                {Icon && (
                    <div className="input-icon">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    className={`input ${Icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};
