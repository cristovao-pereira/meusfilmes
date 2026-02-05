import './CircularScore.css';

export const CircularScore = ({ score, size = 60 }) => {
    // Convert score (0-10) to percentage (0-100)
    const percentage = Math.round((score / 10) * 100);

    // Determine color based on score
    const getColor = (percent) => {
        if (percent >= 70) return '#21D07A'; // Green
        if (percent >= 40) return '#D2D531'; // Yellow
        return '#DB2360'; // Red
    };

    const color = getColor(percentage);
    const circumference = 2 * Math.PI * 16; // radius = 16
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="circular-score" style={{ width: size, height: size }}>
            <svg viewBox="0 0 36 36" className="circular-chart">
                {/* Background circle */}
                <path
                    className="circle-bg"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#204529"
                    strokeWidth="2"
                />
                {/* Progress circle */}
                <path
                    className="circle"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>
            <div className="score-text">
                <span className="score-value">{percentage}</span>
                <span className="score-percent">%</span>
            </div>
        </div>
    );
};
