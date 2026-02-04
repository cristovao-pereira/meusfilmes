import { Edit2, Trash2, Check, X, Star } from 'lucide-react';
import './MovieCard.css';

export const MovieCard = ({ movie, onToggleWatched, onEdit, onDelete, onViewDetails }) => {
    const { id, titulo, categorias, ano, poster_url, assistido, observacoes, nota } = movie;

    const handleCardClick = () => {
        if (onViewDetails) {
            onViewDetails(id);
        }
    };

    return (
        <div className="movie-card animate-fadeIn" onClick={handleCardClick}>
            <div className="movie-poster">
                {nota && (
                    <div className="movie-rating">
                        <Star size={14} fill="#ECC94B" color="#ECC94B" />
                        <span>{nota.toFixed(1)}</span>
                    </div>
                )}
                {poster_url ? (
                    <img src={poster_url} alt={titulo} />
                ) : (
                    <div className="movie-poster-placeholder">
                        <span>{titulo.charAt(0).toUpperCase()}</span>
                    </div>
                )}
                <div className="movie-overlay">

                    {onEdit && (
                        <button
                            className="movie-action-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(id);
                            }}
                            title="Editar"
                        >
                            <Edit2 size={18} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="movie-action-btn movie-action-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(id);
                            }}
                            title="Excluir"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="movie-content">
                <div className="movie-header">
                    <h3 className="movie-title">{titulo}</h3>
                    {ano && <span className="movie-year">{ano}</span>}
                </div>

                <div className="movie-categories">
                    {categorias.slice(0, 3).map((categoria) => (
                        <span key={categoria} className="movie-category">
                            {categoria}
                        </span>
                    ))}
                    {categorias.length > 3 && (
                        <span className="movie-category-more">+{categorias.length - 3}</span>
                    )}
                </div>

                {observacoes && (
                    <p className="movie-notes">{observacoes}</p>
                )}

                <div className="movie-footer">
                    {onToggleWatched && (
                        <button
                            className={`movie-watched-toggle ${assistido ? 'watched' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleWatched(id, !assistido);
                            }}
                        >
                            {assistido ? (
                                <>
                                    <Check size={16} />
                                    <span>Assistido</span>
                                </>
                            ) : (
                                <>
                                    <X size={16} />
                                    <span>Não assistido</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
