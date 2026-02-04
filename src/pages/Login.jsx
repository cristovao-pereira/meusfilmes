import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import './Login.css';

export const Login = () => {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(formData.email, formData.password);
            navigate('/movies');
        } catch (err) {
            setError('Credenciais inválidas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container animate-scaleIn">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Film size={40} />
                    </div>
                    <h1 className="auth-title">Meus Filmes</h1>
                    <p className="auth-subtitle">Entre para gerenciar sua lista de filmes</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error animate-slideDown">
                            <p>{error}</p>
                        </div>
                    )}

                    <Input
                        label="E-mail"
                        type="email"
                        icon={Mail}
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        fullWidth
                    />

                    <Input
                        label="Senha"
                        type="password"
                        icon={Lock}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                        fullWidth
                    />

                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Entrar
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>
                        Não tem uma conta?{' '}
                        <Link to="/signup" className="auth-link">
                            Criar conta
                        </Link>
                    </p>
                    <a href="#" className="auth-link-secondary">
                        Esqueci minha senha
                    </a>
                </div>
            </div>
        </div>
    );
};
