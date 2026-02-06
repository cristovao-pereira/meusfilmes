import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, TrendingUp, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Bookmark, Plus, LogOut } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SearchBar } from '../components/SearchBar';
import { WatchedStatusFilter } from '../components/WatchedStatusFilter';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MovieDetailsModal } from '../components/MovieDetailsModal';
import './Populares.css';

const GENRES = {
    28: "Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    99: "Documentário",
    18: "Drama",
    10751: "Família",
    14: "Fantasia",
    36: "História",
    27: "Terror",
    10402: "Música",
    9648: "Mistério",
    10749: "Romance",
    878: "Ficção científica",
    10770: "Cinema TV",
    53: "Thriller",
    10752: "Guerra",
    37: "Faroeste"
};

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const Populares = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [userMovies, setUserMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [detailsModal, setDetailsModal] = useState({ isOpen: false, movieId: null });
    const [selectedMovieFullDetails, setSelectedMovieFullDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [watchedFilter, setWatchedFilter] = useState('all');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Load user movies to check 'watched' status and potential duplicates
    const loadUserMovies = async () => {
        if (!user) return;
        try {
            const { data } = await supabase
                .from('movies')
                .select('*')
                .eq('user_id', user.id);
            setUserMovies(data || []);
        } catch (err) {
            console.error("Erro ao carregar filmes do usuário", err);
        }
    };

    const fetchPopularMovies = async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            await loadUserMovies();

            const response = await fetch(`https://n8n-service-j3k0.onrender.com/webhook/tmdb?language=pt-BR&page=${page}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_N8N_WEBHOOK_TOKEN}`
                },
                body: ''
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar filmes populares');
            }

            const json = await response.json();
            const data = Array.isArray(json) ? json[0] : json;

            // TMDB limits pages to 500 for non-commercial API keys usually, or just high number
            // We'll trust the API but maybe cap display if needed
            setTotalPages(Math.min(data.total_pages, 500));

            const formattedMovies = data.results.map(movie => ({
                id: movie.id, // TMDB ID
                tmdb_id: movie.id, // Explicit TMDB ID for external linking
                titulo: movie.title,
                ano: new Date(movie.release_date).getFullYear().toString(),
                poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                categorias: movie.genre_ids.map(id => GENRES[id]).filter(Boolean),
                assistido: false,
                observacoes: movie.overview,
                nota: movie.vote_average
            }));

            setMovies(formattedMovies);
        } catch (err) {
            console.error(err);
            setError('Não foi possível carregar os filmes populares. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch single movie full details
    const fetchMovieDetails = async (id) => {
        setIsLoadingDetails(true);
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=pt-BR`, {
                headers: {
                    'Authorization': `Bearer ${TMDB_API_KEY}`,
                    'accept': 'application/json'
                }
            });

            if (!response.ok) return null;

            const data = await response.json();
            return data;
        } catch (err) {
            console.error("Failed to load details", err);
            return null;
        } finally {
            setIsLoadingDetails(false);
        }
    }

    useEffect(() => {
        fetchPopularMovies(currentPage);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [user, currentPage]);

    // Check if a movie is already in user's list (by title match as ID is different)
    const getMovieStatus = (tmdbMovie) => {
        if (!tmdbMovie) return { inList: false, assistido: false, dbId: null };
        const userMovie = userMovies.find(m => m.titulo === tmdbMovie.titulo);
        if (userMovie) {
            return {
                inList: true,
                assistido: userMovie.assistido,
                dbId: userMovie.id
            };
        }
        return {
            inList: false,
            assistido: false,
            dbId: null
        };
    };

    const handleToggleWatched = async (tmdbId) => {
        // Find movie either in list or in details
        let movieToToggle = movies.find(m => m.id === tmdbId);

        // If toggling from modal details (might be full data), fallback to basic list info if needed logic?
        // Actually, if we are in details view, selectedMovieFullDetails might be active.
        // But tmdbId passed from modal is consistent.

        if (!movieToToggle && selectedMovieFullDetails && selectedMovieFullDetails.id === tmdbId) {
            // Reconstruct basic shape from full details if needed, but 'getMovieStatus' relies on 'titulo'
            movieToToggle = {
                ...selectedMovieFullDetails,
                id: selectedMovieFullDetails.id,
                titulo: selectedMovieFullDetails.title, // TMDB uses title
                // ... other fields mismatch?
                // Let's rely on the list data which is consistent for this action usually.
            };
        }

        if (!movieToToggle) {
            // Fallback if toggling inside modal but movie not in current page list (rare but possible)
            return;
        }

        const status = getMovieStatus(movieToToggle);
        const newWatchedStatus = !status.assistido;

        try {
            if (status.inList) {
                // Update existing movie
                const { error } = await supabase
                    .from('movies')
                    .update({ assistido: newWatchedStatus })
                    .eq('id', status.dbId);

                if (error) throw error;
            } else {
                // Add new movie to list
                const { error } = await supabase
                    .from('movies')
                    .insert([{
                        user_id: user.id,
                        titulo: movieToToggle.titulo,
                        categorias: movieToToggle.categorias,
                        ano: parseInt(movieToToggle.ano) || null,
                        poster_url: movieToToggle.poster_url,
                        observacoes: movieToToggle.observacoes,
                        assistido: newWatchedStatus,
                        nota: movieToToggle.nota
                    }]);

                if (error) throw error;
            }

            // Refresh user movies to update UI
            await loadUserMovies();

        } catch (err) {
            console.error("Erro ao atualizar status", err);
            alert("Erro ao salvar alteração.");
        }
    };

    const handleAddToWatchlist = async (tmdbId) => {
        const movieToAdd = movies.find(m => m.id === tmdbId);

        if (!movieToAdd) {
            alert("Filme não encontrado.");
            return;
        }

        const status = getMovieStatus(movieToAdd);

        if (status.inList) {
            alert("Este filme já está na sua lista!");
            return;
        }

        try {
            const { error } = await supabase
                .from('movies')
                .insert([{
                    user_id: user.id,
                    titulo: movieToAdd.titulo,
                    categorias: movieToAdd.categorias,
                    ano: parseInt(movieToAdd.ano) || null,
                    poster_url: movieToAdd.poster_url,
                    observacoes: movieToAdd.observacoes,
                    assistido: false,
                    nota: movieToAdd.nota
                }]);

            if (error) throw error;

            // Refresh user movies to update UI
            await loadUserMovies();
            alert("Filme adicionado à sua lista!");

        } catch (err) {
            console.error("Erro ao adicionar à lista", err);
            alert("Erro ao adicionar filme à lista.");
        }
    };


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleViewDetails = async (id) => {
        setDetailsModal({ isOpen: true, movieId: id });
        setSelectedMovieFullDetails(null); // Clear previous

        const details = await fetchMovieDetails(id);
        if (details) {
            setSelectedMovieFullDetails(details);
        }
    };

    const handleCloseDetails = () => {
        setDetailsModal({ isOpen: false, movieId: null });
        setSelectedMovieFullDetails(null);
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const getDisplayMovie = (movie) => {
        if (!movie) return null;
        const status = getMovieStatus(movie);
        return {
            ...movie,
            assistido: status.assistido,
        };
    };

    // Merge basic info with full details if available
    const getModalMovieData = () => {
        const basicMovie = movies.find(m => m.id === detailsModal.movieId);
        if (!basicMovie) return null;

        let merged = { ...basicMovie };
        if (selectedMovieFullDetails && selectedMovieFullDetails.id === basicMovie.id) {
            merged = {
                ...merged,
                backdrop_url: selectedMovieFullDetails.backdrop_path ? `https://image.tmdb.org/t/p/original${selectedMovieFullDetails.backdrop_path}` : null,
                tagline: selectedMovieFullDetails.tagline,
                duracao: selectedMovieFullDetails.runtime,
                total_votos: selectedMovieFullDetails.vote_count,
                // Overwrite generic categories with detailed ones if needed, but GENRES usually covers it
            };
        }

        return getDisplayMovie(merged);
    }

    // Filter movies by search term and watched status
    const filterMoviesBySearchAndStatus = (moviesToFilter) => {
        let filtered = [...moviesToFilter];

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(movie =>
                movie.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by watched status
        if (watchedFilter !== 'all') {
            filtered = filtered.filter(movie => {
                const status = getMovieStatus(movie);
                if (watchedFilter === 'watched') {
                    return status.assistido === true;
                } else {
                    return status.assistido === false;
                }
            });
        }

        return filtered;
    };

    const filteredMovies = filterMoviesBySearchAndStatus(movies);

    return (
        <div className="populares-page">
            <header className={`populares-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="populares-header-content">
                    <Link to="/watchlist" className="populares-logo">
                        <Film size={32} className="populares-logo-icon" />
                        <span>Meus Filmes</span>
                    </Link>

                    <nav className="populares-nav">
                        <Link to="/watchlist" className="populares-nav-link">Minha Lista</Link>
                        <Link to="/populares" className="populares-nav-link active">Populares</Link>
                    </nav>

                    <div className="populares-header-actions">
                        <Button variant="ghost" onClick={handleLogout} title="Sair">
                            <LogOut size={20} />
                            <span className="populares-user-name">
                                {user?.email?.split('@')[0]}
                            </span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="populares-main">
                <div className="container">
                    <div className="movies-filters" style={{ marginBottom: '24px' }}>
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Buscar por título..."
                        />
                        <WatchedStatusFilter
                            value={watchedFilter}
                            onChange={setWatchedFilter}
                        />
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-red-500" size={32} />
                        <h1 className="populares-section-title mb-0">Populares no Momento</h1>
                    </div>

                    {isLoading && <LoadingSpinner size="lg" text="Carregando sucessos..." />}

                    {error && (
                        <div className="populares-error">
                            <AlertCircle size={48} className="mx-auto mb-4" />
                            <h3>{error}</h3>
                            <Button variant="primary" onClick={() => fetchPopularMovies(currentPage)} className="mt-4">
                                <RefreshCw size={18} />
                                Tentar Novamente
                            </Button>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            <div className="populares-grid">
                                {filteredMovies.map(movie => {
                                    const displayMovie = getDisplayMovie(movie);
                                    const status = getMovieStatus(movie);

                                    return (
                                        <MovieCard
                                            key={movie.id}
                                            movie={displayMovie}
                                            onToggleWatched={() => handleToggleWatched(movie.id)}
                                            onViewDetails={handleViewDetails}
                                            onAddToWatchlist={handleAddToWatchlist}
                                            inWatchlist={status.inList}
                                        />
                                    );
                                })}
                            </div>

                            <div className="movies-pagination">
                                <Button
                                    variant="secondary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} style={{ marginRight: '4px' }} />
                                    Anterior
                                </Button>
                                <span className="movies-pagination-info">
                                    Página {currentPage}
                                </span>
                                <Button
                                    variant="secondary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    Próxima
                                    <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <MovieDetailsModal
                isOpen={detailsModal.isOpen}
                movie={getModalMovieData()}
                onClose={handleCloseDetails}
                onToggleWatched={(id) => handleToggleWatched(id)}
                onAddToWatchlist={handleAddToWatchlist}
                inWatchlist={detailsModal.movieId ? getMovieStatus(movies.find(m => m.id === detailsModal.movieId)).inList : false}
            />
        </div>
    );
};
