import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import './ConfirmDialog.css';

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-backdrop animate-fadeIn" onClick={onCancel}>
            <div className="dialog-container animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-icon">
                    <AlertTriangle size={48} />
                </div>

                <h2 className="dialog-title">{title}</h2>
                <p className="dialog-message">{message}</p>

                <div className="dialog-actions">
                    <Button variant="secondary" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={onConfirm} loading={loading}>
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
};
