import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Film } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
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
    const [captchaToken, setCaptchaToken] = useState(null);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!captchaToken) {
            setError('Por favor, complete a verificação de segurança.');
            return;
        }

        setLoading(true);

        try {
            await signIn(formData.email, formData.password, captchaToken);
            navigate('/populares');
        } catch (err) {
            console.error(err);
            setError('Credenciais inválidas ou erro de verificação. Tente novamente.');
            // Resetar token em caso de erro para forçar nova verificação se necessário
            setCaptchaToken(null);
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

                    <div className="turnstile-container" style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
                        <Turnstile
                            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                            onSuccess={(token) => setCaptchaToken(token)}
                            onError={() => setError('Erro na verificação de segurança.')}
                            options={{
                                theme: 'dark',
                                size: 'normal',
                            }}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={loading}
                        disabled={!captchaToken}
                    >
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
