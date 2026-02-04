import './LoadingSpinner.css';

export const LoadingSpinner = ({ size = 'md', text }) => {
    return (
        <div className="loading-spinner-container">
            <div className={`loading-spinner loading-spinner-${size}`}></div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
};
