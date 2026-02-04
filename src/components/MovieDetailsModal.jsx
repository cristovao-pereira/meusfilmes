import { X, Play, Check, Calendar, Star } from 'lucide-react';
import { Button } from './Button';
import './MovieDetailsModal.css';

export const MovieDetailsModal = ({ isOpen, movie, onClose, onToggleWatched, onEdit }) => {
    if (!isOpen || !movie) return null;

    const { id, titulo, categorias, ano, poster_url, assistido, observacoes } = movie;

    const handleToggleWatched = () => {
        onToggleWatched(id, !assistido);
    };

    return (
        <div className="movie-details-modal-backdrop" onClick={onClose}>
            <div className="movie-details-modal" onClick={(e) => e.stopPropagation()}>
                <button className="movie-details-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="movie-details-poster">
                    {poster_url ? (
                        <img src={poster_url} alt={titulo} />
                    ) : (
                        <div className="movie-details-poster-placeholder">
                            <span>{titulo.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>

                <div className="movie-details-content">
                    <div className="movie-details-header">
                        <h2 className="movie-details-title">{titulo}</h2>
                        <div className="movie-details-meta">
                            <span className="movie-details-year">{ano}</span>
                            <div className={`movie-details-status ${assistido ? 'watched' : 'not-watched'}`}>
                                {assistido ? (
                                    <>
                                        <Check size={16} /> Assistido
                                    </>
                                ) : (
                                    <>
                                        <Star size={16} /> Não assistido
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="movie-details-body">
                        <div className="movie-details-section">
                            <h3 className="movie-details-section-title">Gêneros</h3>
                            <div className="movie-details-categories">
                                {categorias.map((categoria) => (
                                    <span key={categoria} className="movie-details-category">
                                        {categoria}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {observacoes && (
                            <div className="movie-details-section">
                                <h3 className="movie-details-section-title">Sinopse / Observações</h3>
                                <p className="movie-details-notes">{observacoes}</p>
                            </div>
                        )}
                    </div>

                    <div className="movie-details-actions">
                        <button
                            className="movie-details-action-btn primary"
                            onClick={handleToggleWatched}
                        >
                            {assistido ? (
                                <>
                                    <Check size={20} />
                                    Não assistido
                                </>
                            ) : (
                                <>
                                    <Play size={20} fill="currentColor" />
                                    Assistido
                                </>
                            )}
                        </button>
                        <button
                            className="movie-details-action-btn secondary"
                            onClick={() => onEdit(id)}
                        >
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
