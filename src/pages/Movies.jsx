import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, LogOut, AlertCircle, RefreshCw, Film, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useDebounce } from '../hooks/useDebounce';
import { CATEGORIES, ITEMS_PER_PAGE } from '../utils/constants';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { MovieCard } from '../components/MovieCard';
import { MovieModal } from '../components/MovieModal';
import { MovieDetailsModal } from '../components/MovieDetailsModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { HeroBanner } from '../components/HeroBanner';
import './Movies.css';

export const Movies = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [subscribing, setSubscribing] = useState(false);

    const handleSubscribe = async () => {
        setSubscribing(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-preference', {
                body: {
                    title: 'Assinatura Premium',
                    price: 29.90,
                    origin: window.location.origin
                }
            });

            if (error) {
                const body = await error.context?.json().catch(() => null);
                throw new Error(body?.error || error.message);
            }

            if (data?.init_point) {
                window.location.href = data.init_point;
            }
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            alert('Não foi possível iniciar o pagamento. Tente novamente.');
        } finally {
            setSubscribing(false);
        }
    };

    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [modalState, setModalState] = useState({ isOpen: false, mode: 'create', movie: null });
    const [modalLoading, setModalLoading] = useState(false);

    const [detailsModal, setDetailsModal] = useState({ isOpen: false, movieId: null });

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, movieId: null });
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 300);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Carregar filmes do Supabase
    useEffect(() => {
        loadMovies();
    }, [user]);

    // Filtrar filmes
    useEffect(() => {
        filterMovies();
    }, [movies, debouncedSearch, selectedCategories]);

    const loadMovies = async () => {
        if (!user) return;

        setIsLoading(true);
        setIsError(false);

        try {
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setMovies(data || []);
        } catch (error) {
            console.error('Erro ao carregar filmes:', error);
            setIsError(true);
            setErrorMessage('Não foi possível carregar os filmes.');
        } finally {
            setIsLoading(false);
        }
    };

    const filterMovies = () => {
        let filtered = [...movies];

        // Filtro de busca
        if (debouncedSearch) {
            filtered = filtered.filter((movie) =>
                movie.titulo.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        // Filtro de categorias
        if (selectedCategories.length > 0) {
            filtered = filtered.filter((movie) =>
                selectedCategories.some((cat) => movie.categorias.includes(cat))
            );
        }

        setFilteredMovies(filtered);
        setCurrentPage(1);
    };

    const handleToggleWatched = async (id, watched) => {
        try {
            const { error } = await supabase
                .from('movies')
                .update({ assistido: watched })
                .eq('id', id);

            if (error) throw error;

            setMovies((prev) =>
                prev.map((movie) => (movie.id === id ? { ...movie, assistido: watched } : movie))
            );
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const handleOpenCreate = () => {
        setModalState({ isOpen: true, mode: 'create', movie: null });
    };

    const handleOpenEdit = (id) => {
        const movie = movies.find((m) => m.id === id);
        setDetailsModal({ isOpen: false, movieId: null });
        setModalState({ isOpen: true, mode: 'edit', movie });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, mode: 'create', movie: null });
    };

    const handleSaveMovie = async (payload) => {
        setModalLoading(true);

        try {
            if (modalState.mode === 'create') {
                const { data, error } = await supabase
                    .from('movies')
                    .insert([{ ...payload, user_id: user.id }])
                    .select()
                    .single();

                if (error) throw error;
                setMovies((prev) => [data, ...prev]);
            } else {
                const { data, error } = await supabase
                    .from('movies')
                    .update(payload)
                    .eq('id', modalState.movie.id)
                    .select()
                    .single();

                if (error) throw error;
                setMovies((prev) => prev.map((m) => (m.id === data.id ? data : m)));
            }

            handleCloseModal();
        } catch (error) {
            console.error('Erro ao salvar filme:', error);
            alert('Não foi possível salvar. Verifique os campos e tente novamente.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleRequestDelete = (id) => {
        setConfirmDialog({ isOpen: true, movieId: id });
    };

    const handleConfirmDelete = async () => {
        setDeleteLoading(true);

        try {
            const { error } = await supabase
                .from('movies')
                .delete()
                .eq('id', confirmDialog.movieId);

            if (error) throw error;

            setMovies((prev) => prev.filter((m) => m.id !== confirmDialog.movieId));
            setConfirmDialog({ isOpen: false, movieId: null });
        } catch (error) {
            console.error('Erro ao excluir filme:', error);
            alert('Não foi possível excluir o filme.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, movieId: null });
    };

    const handleViewDetails = (id) => {
        setDetailsModal({ isOpen: true, movieId: id });
    };

    const handleCloseDetails = () => {
        setDetailsModal({ isOpen: false, movieId: null });
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // Paginação
    const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMovies = filteredMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="movies-page">
            <header className={`movies-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="movies-header-content">
                    <Link to="/movies" className="movies-logo">
                        <Film size={32} className="movies-logo-icon" />
                        <span>Meus Filmes</span>
                    </Link>

                    <nav className="movies-nav">
                        <Link to="/movies" className="movies-nav-link active">Minha Lista</Link>
                        <Link to="/populares" className="movies-nav-link">Populares</Link>
                    </nav>

                    <div className="movies-header-actions">
                        <Button variant="primary" onClick={handleOpenCreate}>
                            <Plus size={20} />
                            Adicionar Filme
                        </Button>
                        <Button variant="secondary" onClick={handleSubscribe} loading={subscribing}>
                            <CreditCard size={20} />
                            Premium
                        </Button>
                        <Button variant="ghost" onClick={handleLogout} title="Sair">
                            <LogOut size={20} />
                            <span className="movies-user-name">
                                {user?.email?.split('@')[0]}
                            </span>
                        </Button>
                    </div>
                </div>
            </header>

            <HeroBanner />

            <main className="movies-main">
                <div className="container">
                    <div className="movies-filters">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Buscar por título..."
                        />
                        <CategoryFilter
                            categories={CATEGORIES}
                            selected={selectedCategories}
                            onChange={setSelectedCategories}
                        />
                    </div>

                    {isLoading && <LoadingSpinner size="lg" text="Carregando filmes..." />}

                    {isError && (
                        <div className="movies-error">
                            <AlertCircle size={48} />
                            <h3>{errorMessage}</h3>
                            <Button variant="primary" onClick={loadMovies}>
                                <RefreshCw size={18} />
                                Tentar novamente
                            </Button>
                        </div>
                    )}

                    {!isLoading && !isError && filteredMovies.length === 0 && (
                        <EmptyState
                            title="Nenhum filme encontrado"
                            description={
                                searchTerm || selectedCategories.length > 0
                                    ? 'Tente ajustar os filtros de busca.'
                                    : 'Adicione seu primeiro filme para começar!'
                            }
                            action={
                                !searchTerm && selectedCategories.length === 0 && (
                                    <Button variant="primary" onClick={handleOpenCreate}>
                                        <Plus size={20} />
                                        Adicionar Filme
                                    </Button>
                                )
                            }
                        />
                    )}

                    {!isLoading && !isError && paginatedMovies.length > 0 && (
                        <>
                            <h2 className="movies-section-title">Minha Lista</h2>
                            <div className="movies-grid">
                                {paginatedMovies.map((movie) => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                        onToggleWatched={handleToggleWatched}
                                        onEdit={handleOpenEdit}
                                        onDelete={handleRequestDelete}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="movies-pagination">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </Button>
                                    <span className="pagination-info">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <MovieModal
                isOpen={modalState.isOpen}
                mode={modalState.mode}
                movie={modalState.movie}
                onSave={handleSaveMovie}
                onClose={handleCloseModal}
                loading={modalLoading}
            />

            <MovieDetailsModal
                isOpen={detailsModal.isOpen}
                movie={movies.find((m) => m.id === detailsModal.movieId)}
                onClose={handleCloseDetails}
                onToggleWatched={handleToggleWatched}
                onEdit={handleOpenEdit}
                onDelete={(id) => {
                    handleCloseDetails();
                    handleRequestDelete(id);
                }}
            />

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Excluir Filme"
                message="Tem certeza que deseja excluir este filme? Esta ação não pode ser desfeita."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                loading={deleteLoading}
            />
        </div>
    );
};
