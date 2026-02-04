import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import './Login.css';

export const Signup = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '', general: '' }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Você deve aceitar os termos';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            await signUp(formData.email, formData.password, formData.name);
            navigate('/movies');
        } catch (err) {
            setErrors({ general: 'Não foi possível concluir o cadastro. Verifique os dados.' });
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
                    <h1 className="auth-title">Criar Conta</h1>
                    <p className="auth-subtitle">Comece a organizar seus filmes hoje</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {errors.general && (
                        <div className="auth-error animate-slideDown">
                            <p>{errors.general}</p>
                        </div>
                    )}

                    <Input
                        label="Nome"
                        type="text"
                        icon={User}
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        error={errors.name}
                        required
                        fullWidth
                    />

                    <Input
                        label="E-mail"
                        type="email"
                        icon={Mail}
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        error={errors.email}
                        required
                        fullWidth
                    />

                    <Input
                        label="Senha"
                        type="password"
                        icon={Lock}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        error={errors.password}
                        required
                        fullWidth
                    />

                    <Input
                        label="Confirmar Senha"
                        type="password"
                        icon={Lock}
                        placeholder="Digite a senha novamente"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        error={errors.confirmPassword}
                        required
                        fullWidth
                    />

                    <div className="auth-checkbox-wrapper">
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            className="auth-checkbox"
                            checked={formData.acceptTerms}
                            onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                        />
                        <label htmlFor="acceptTerms" className="auth-checkbox-label">
                            Aceito os termos e condições
                        </label>
                    </div>
                    {errors.acceptTerms && (
                        <span style={{ color: 'var(--danger-500)', fontSize: 'var(--font-size-sm)' }}>
                            {errors.acceptTerms}
                        </span>
                    )}

                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Criar Conta
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>
                        Já tem uma conta?{' '}
                        <Link to="/login" className="auth-link">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
