import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import './HeroBanner.css';

const FEATURED_MOVIES = [
    {
        id: 1,
        title: 'Duna: Parte Dois',
        description: 'Paul Atreides une forças com Chani e os Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.',
        image: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        year: 2024,
        rating: '8.8',
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        tmdbUrl: 'https://www.themoviedb.org/movie/693134-dune-part-two'
    },
    {
        id: 2,
        title: 'Oppenheimer',
        description: 'A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial.',
        image: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
        year: 2023,
        rating: '8.5',
        trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        tmdbUrl: 'https://www.themoviedb.org/movie/872585-oppenheimer'
    },
    {
        id: 3,
        title: 'Pobres Criaturas',
        description: 'A fantástica evolução de Bella Baxter, uma jovem trazida de volta à vida pelo brilhante e pouco ortodoxo cientista Dr. Godwin Baxter.',
        image: 'https://image.tmdb.org/t/p/original/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
        year: 2023,
        rating: '8.3',
        trailerUrl: 'https://www.youtube.com/watch?v=RlbR5N6veqw',
        tmdbUrl: 'https://www.themoviedb.org/movie/792307-poor-things'
    }
];

export const HeroBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % FEATURED_MOVIES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % FEATURED_MOVIES.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + FEATURED_MOVIES.length) % FEATURED_MOVIES.length);
        setIsAutoPlaying(false);
    };

    const currentMovie = FEATURED_MOVIES[currentSlide];

    return (
        <div className="hero-banner">
            {FEATURED_MOVIES.map((movie, index) => (
                <div
                    key={movie.id}
                    className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                >
                    <img src={movie.image} alt={movie.title} className="hero-image" />
                    <div className="hero-overlay"></div>

                    <div className="hero-content">
                        <div className="hero-text-content">
                            <h1 className="hero-title">{movie.title}</h1>
                            <div className="hero-meta">
                                <div className="hero-rating">
                                    <span>★</span>
                                    <span>{movie.rating}</span>
                                </div>
                                <span className="hero-year">{movie.year}</span>
                            </div>
                            <p className="hero-description">{movie.description}</p>
                            <div className="hero-actions">
                                <a
                                    href={movie.trailerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-lg"
                                >
                                    <Play size={24} fill="currentColor" />
                                    Veja o trailer
                                </a>
                                <a
                                    href={movie.tmdbUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary btn-lg"
                                >
                                    <Info size={24} />
                                    Mais Informações
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="hero-nav">
                <button className="hero-nav-btn" onClick={prevSlide}>
                    <ChevronLeft size={24} />
                </button>
                <button className="hero-nav-btn" onClick={nextSlide}>
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="hero-indicators">
                {FEATURED_MOVIES.map((_, index) => (
                    <button
                        key={index}
                        className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};
