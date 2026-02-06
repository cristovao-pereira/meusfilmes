import { useState, useEffect } from 'react';
import { X, Play, Check, Star, Clock, Heart, Bookmark, List, Edit2, Trash2 } from 'lucide-react';
import { CircularScore } from './CircularScore';
import './MovieDetailsModal.css';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const MovieDetailsModal = ({ isOpen, movie, onClose, onToggleWatched, onEdit, onDelete, onAddToWatchlist, inWatchlist }) => {
    const [trailerKey, setTrailerKey] = useState(null);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        if (isOpen && movie?.tmdb_id) {
            fetchTrailer(movie.tmdb_id);
        }
        return () => {
            setTrailerKey(null);
            setShowTrailer(false);
        };
    }, [isOpen, movie?.tmdb_id]);

    const fetchTrailer = async (tmdbId) => {
        setIsLoadingTrailer(true);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${tmdbId}/videos?language=pt-BR`,
                {
                    headers: {
                        'Authorization': `Bearer ${TMDB_API_KEY}`,
                        'accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                // Find first YouTube trailer
                const trailer = data.results.find(
                    video => video.site === 'YouTube' && video.type === 'Trailer'
                );

                if (trailer) {
                    setTrailerKey(trailer.key);
                } else {
                    // Try English if no Portuguese trailer
                    const enResponse = await fetch(
                        `https://api.themoviedb.org/3/movie/${tmdbId}/videos?language=en-US`,
                        {
                            headers: {
                                'Authorization': `Bearer ${TMDB_API_KEY}`,
                                'accept': 'application/json'
                            }
                        }
                    );
                    if (enResponse.ok) {
                        const enData = await enResponse.json();
                        const enTrailer = enData.results.find(
                            video => video.site === 'YouTube' && video.type === 'Trailer'
                        );
                        if (enTrailer) setTrailerKey(enTrailer.key);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching trailer:', error);
        } finally {
            setIsLoadingTrailer(false);
        }
    };

    const handlePlayTrailer = () => {
        if (trailerKey) {
            setShowTrailer(true);
        }
    };

    const handleToggleWatched = () => {
        onToggleWatched(movie.id);
    };

    if (!isOpen || !movie) return null;

    const {
        titulo,
        categorias,
        ano,
        poster_url,
        backdrop_url,
        assistido,
        observacoes,
        nota,
        duracao,
        tagline
    } = movie;

    const bannerImage = backdrop_url || poster_url;
    const formattedDuration = duracao ? `${Math.floor(duracao / 60)}h ${duracao % 60}m` : null;

    return (
        <div className="tmdb-modal-backdrop" onClick={onClose}>
            <div className="tmdb-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="tmdb-modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                {/* Backdrop Image */}
                {bannerImage && (
                    <div className="tmdb-backdrop">
                        <img src={bannerImage} alt={titulo} />
                        <div className="tmdb-backdrop-gradient" />
                    </div>
                )}

                <div className="tmdb-modal-inner">
                    {/* Poster */}
                    <div className="tmdb-poster-section">
                        {poster_url ? (
                            <img src={poster_url} alt={titulo} className="tmdb-poster" />
                        ) : (
                            <div className="tmdb-poster-placeholder">
                                <span>{titulo.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="tmdb-info-section">
                        {/* Title */}
                        <h1 className="tmdb-title">
                            {titulo} {ano && <span className="tmdb-year">({ano})</span>}
                        </h1>

                        {/* Meta Info */}
                        <div className="tmdb-meta">
                            {categorias && categorias.length > 0 && (
                                <span className="tmdb-genres">{categorias.join(', ')}</span>
                            )}
                            {formattedDuration && (
                                <span className="tmdb-duration">
                                    <Clock size={14} /> {formattedDuration}
                                </span>
                            )}
                        </div>

                        {/* Actions Row */}
                        <div className="tmdb-actions-row">
                            {nota && (
                                <div className="tmdb-score-container">
                                    <CircularScore score={nota} size={60} />
                                    <span className="tmdb-score-label">Avaliação dos usuários</span>
                                </div>
                            )}

                            <button
                                className={`tmdb-icon-btn ${assistido ? 'watched' : ''}`}
                                onClick={handleToggleWatched}
                                title={assistido ? "Marcar como não visto" : "Marcar como assistido"}
                            >
                                <div className="icon-circle">
                                    <Check size={18} />
                                </div>
                            </button>

                            {onAddToWatchlist && !inWatchlist && (
                                <button
                                    className="tmdb-icon-btn add-to-list"
                                    onClick={() => onAddToWatchlist(movie.id)}
                                    title="Adicionar à minha lista"
                                >
                                    <div className="icon-circle">
                                        <Bookmark size={18} />
                                    </div>
                                </button>
                            )}

                            {trailerKey && (
                                <button
                                    className="tmdb-play-trailer-btn"
                                    onClick={handlePlayTrailer}
                                >
                                    <Play size={18} fill="currentColor" />
                                    Reproduzir trailer
                                </button>
                            )}
                        </div>

                        {/* Tagline */}
                        {tagline && <p className="tmdb-tagline">{tagline}</p>}

                        {/* Synopsis */}
                        {observacoes && (
                            <div className="tmdb-synopsis">
                                <h3>Sinopse</h3>
                                <p>{observacoes}</p>
                            </div>
                        )}

                        {/* Additional Actions */}
                        <div className="tmdb-additional-actions">
                            {onEdit && (
                                <button
                                    className="tmdb-action-btn secondary"
                                    onClick={() => onEdit(movie.id)}
                                >
                                    <Edit2 size={18} />
                                    Editar
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    className="tmdb-action-btn danger"
                                    onClick={() => onDelete(movie.id)}
                                    title="Excluir filme"
                                >
                                    <Trash2 size={18} />
                                    Excluir
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal Overlay */}
            {showTrailer && (
                <div className="trailer-modal-overlay" onClick={() => setShowTrailer(false)}>
                    <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="trailer-modal-close" onClick={() => setShowTrailer(false)}>
                            <X size={24} />
                        </button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};
