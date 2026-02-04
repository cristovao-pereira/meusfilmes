import { Film } from 'lucide-react';
import './EmptyState.css';

export const EmptyState = ({ icon: Icon = Film, title, description, action }) => {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                <Icon size={64} />
            </div>
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-description">{description}</p>}
            {action && <div className="empty-state-action">{action}</div>}
        </div>
    );
};
