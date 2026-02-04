import { X, Play, Check, Star, Clock, Globe, Award, ImageIcon, Trash2, Edit2 } from 'lucide-react';
import './MovieDetailsModal.css';

export const MovieDetailsModal = ({ isOpen, movie, onClose, onToggleWatched, onEdit, onDelete }) => {
    if (!isOpen || !movie) return null;

    const {
        id,
        titulo,
        categorias,
        ano,
        poster_url,
        backdrop_url,
        assistido,
        observacoes,
        nota,
        duracao,
        tagline,
        total_votos
    } = movie;

    const handleToggleWatched = () => {
        onToggleWatched(id, !assistido);
    };

    // Use backdrop if available, otherwise fallback to poster for the background effect
    const bannerImage = backdrop_url || poster_url;
    const isFallbackBanner = !backdrop_url && !!poster_url;

    return (
        <div className="movie-details-modal-backdrop" onClick={onClose}>
            <div className="movie-details-modal wide" onClick={(e) => e.stopPropagation()}>
                <button className="movie-details-close" onClick={onClose}>
                    <X size={24} />
                </button>

                {bannerImage && (
                    <div className={`movie-details-backdrop ${isFallbackBanner ? 'fallback' : ''}`}>
                        <img src={bannerImage} alt={titulo} />
                        <div className="movie-details-backdrop-overlay"></div>
                    </div>
                )}

                <div className={`movie-details-container ${!bannerImage ? 'no-banner' : ''}`}>
                    <div className="movie-details-poster large">
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
                            {tagline && <p className="movie-details-tagline">"{tagline}"</p>}

                            <div className="movie-details-meta">
                                {ano && <span className="movie-details-year">{ano}</span>}
                                {duracao && (
                                    <span className="movie-details-duration">
                                        <Clock size={14} /> {duracao} min
                                    </span>
                                )}
                                {nota && (
                                    <span className="movie-details-rating-badge">
                                        <Star size={14} fill="#ECC94B" color="#ECC94B" />
                                        {typeof nota === 'number' ? nota.toFixed(1) : nota}
                                    </span>
                                )}
                                <div className={`movie-details-status ${assistido ? 'watched' : 'not-watched'}`}>
                                    {assistido ? (
                                        <>
                                            <Check size={16} /> Assistido
                                        </>
                                    ) : (
                                        <>
                                            <Clock size={16} /> Não assistido
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="movie-details-body">
                            <div className="movie-details-section">
                                <h3 className="movie-details-section-title">Gêneros</h3>
                                <div className="movie-details-categories">
                                    {categorias && categorias.map((categoria) => (
                                        <span key={categoria} className="movie-details-category">
                                            {categoria}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {observacoes && (
                                <div className="movie-details-section">
                                    <h3 className="movie-details-section-title">Sinopse</h3>
                                    <p className="movie-details-notes">{observacoes}</p>
                                </div>
                            )}

                            {total_votos && (
                                <div className="movie-details-section extra-info">
                                    <div className="info-item">
                                        <Award size={16} className="text-gray-400" />
                                        <span>Total de votos: {total_votos}</span>
                                    </div>
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
                            {movie.tmdb_id && (
                                <a
                                    href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="movie-details-action-btn secondary"
                                    title="Ver no TMDB"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Globe size={18} />
                                    TMDB
                                </a>
                            )}
                            {onEdit && (
                                <button
                                    className="movie-details-action-btn secondary"
                                    onClick={() => onEdit(id)}
                                >
                                    <Edit2 size={18} />
                                    Editar
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    className="movie-details-action-btn danger" // styling needs addition
                                    onClick={() => onDelete(id)}
                                    title="Excluir filme"
                                    style={{ flex: '0 0 auto', borderColor: '#DC2626', color: '#DC2626' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
