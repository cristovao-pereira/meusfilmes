import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { MultiSelect } from './MultiSelect';
import { CATEGORIES } from '../utils/constants';
import './MovieModal.css';

export const MovieModal = ({ isOpen, mode, movie, onSave, onClose, loading }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        categorias: [],
        ano: '',
        poster_url: '',
        observacoes: '',
        assistido: false,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && mode === 'edit' && movie) {
            setFormData({
                titulo: movie.titulo || '',
                categorias: movie.categorias || [],
                ano: movie.ano || '',
                poster_url: movie.poster_url || '',
                observacoes: movie.observacoes || '',
                assistido: movie.assistido || false,
            });
        } else if (isOpen && mode === 'create') {
            setFormData({
                titulo: '',
                categorias: [],
                ano: '',
                poster_url: '',
                observacoes: '',
                assistido: false,
            });
        }
        setErrors({});
    }, [isOpen, mode, movie]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.titulo.trim()) {
            newErrors.titulo = 'Título é obrigatório';
        }

        if (formData.categorias.length === 0) {
            newErrors.categorias = 'Selecione pelo menos uma categoria';
        }

        if (formData.ano && (isNaN(formData.ano) || formData.ano < 1800 || formData.ano > 2100)) {
            newErrors.ano = 'Ano inválido';
        }

        if (formData.poster_url && !isValidUrl(formData.poster_url)) {
            newErrors.poster_url = 'URL inválida';
        }

        return newErrors;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            ...formData,
            ano: formData.ano ? parseInt(formData.ano) : null,
        };

        onSave(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="movie-modal-backdrop" onClick={onClose}>
            <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
                <div className="movie-modal-header">
                    <h2 className="movie-modal-title">
                        {mode === 'create' ? 'Adicionar Filme' : 'Editar Filme'}
                    </h2>
                    <button className="movie-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="movie-modal-body">
                    <form onSubmit={handleSubmit} className="movie-modal-form">
                        <Input
                            label="Título *"
                            type="text"
                            placeholder="Nome do filme"
                            value={formData.titulo}
                            onChange={(e) => handleChange('titulo', e.target.value)}
                            error={errors.titulo}
                            fullWidth
                        />

                        <MultiSelect
                            label="Categorias *"
                            options={CATEGORIES}
                            selected={formData.categorias}
                            onChange={(value) => handleChange('categorias', value)}
                            error={errors.categorias}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Input
                                label="Ano"
                                type="number"
                                placeholder="Ex: 2024"
                                value={formData.ano}
                                onChange={(e) => handleChange('ano', e.target.value)}
                                error={errors.ano}
                                fullWidth
                            />

                            <div className="checkbox-wrapper" style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    id="assistido"
                                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E50914' }}
                                    checked={formData.assistido}
                                    onChange={(e) => handleChange('assistido', e.target.checked)}
                                />
                                <label htmlFor="assistido" style={{ color: '#E5E5E5', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    Já assisti este filme
                                </label>
                            </div>
                        </div>

                        <Input
                            label="URL do Pôster"
                            type="url"
                            placeholder="https://exemplo.com/poster.jpg"
                            value={formData.poster_url}
                            onChange={(e) => handleChange('poster_url', e.target.value)}
                            error={errors.poster_url}
                            fullWidth
                        />

                        <div className="input-group">
                            <label className="input-label">Observações</label>
                            <textarea
                                className="input"
                                placeholder="Suas anotações sobre o filme..."
                                value={formData.observacoes}
                                onChange={(e) => handleChange('observacoes', e.target.value)}
                                rows={4}
                            />
                        </div>
                    </form>
                </div>

                <div className="movie-modal-footer">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="button" variant="primary" loading={loading} onClick={handleSubmit}>
                        {mode === 'create' ? 'Adicionar' : 'Salvar'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
