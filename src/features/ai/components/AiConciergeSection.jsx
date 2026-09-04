import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { requestAiRecommendation, requestServiceHealth } from '../services/aiConciergeService';

const EVENT_OPTIONS = [
  ['birthday', 'Aniversário'],
  ['wedding', 'Casamento'],
  ['corporate', 'Evento corporativo'],
  ['baby_shower', 'Chá de bebê'],
  ['celebration', 'Celebração'],
  ['other', 'Outro evento'],
];

const BUDGET_OPTIONS = [
  ['economical', 'Essencial'],
  ['balanced', 'Equilibrado'],
  ['premium', 'Especial'],
];

const PREFERENCE_OPTIONS = [
  ['traditional', 'Clássicos'],
  ['premium', 'Doces finos'],
  ['chocolate', 'Chocolate'],
  ['fruity', 'Frutados'],
  ['no_nuts', 'Sem castanhas'],
  ['lactose_free', 'Sem lactose'],
];

const INITIAL_BRIEF = {
  eventType: 'birthday',
  guests: 30,
  budget: 'balanced',
  preferences: ['traditional', 'chocolate'],
  notes: '',
};

function HealthBadge({ status }) {
  const config = {
    checking: { color: 'default', label: 'Verificando serviço' },
    ready: { color: 'success', label: 'Concierge disponível' },
    degraded: { color: 'warning', label: 'Modo resiliente ativo' },
    unreachable: { color: 'default', label: 'Disponibilidade sob consulta' },
  }[status];

  return <Chip size="small" variant="outlined" color={config.color} label={config.label} />;
}

export default function AiConciergeSection({ whatsappNumber }) {
  const [brief, setBrief] = useState(INITIAL_BRIEF);
  const [healthStatus, setHealthStatus] = useState('checking');
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    requestServiceHealth({ signal: controller.signal })
      .then((health) => setHealthStatus(health.status === 'ready' ? 'ready' : 'degraded'))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setHealthStatus('unreachable');
      });
    return () => controller.abort();
  }, []);

  const updateField = (field, value) => {
    setBrief((current) => ({ ...current, [field]: value }));
  };

  const togglePreference = (preference) => {
    setBrief((current) => ({
      ...current,
      preferences: current.preferences.includes(preference)
        ? current.preferences.filter((item) => item !== preference)
        : [...current.preferences, preference],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setRecommendation(null);
    setIsLoading(true);

    try {
      const result = await requestAiRecommendation({
        ...brief,
        guests: Number(brief.guests),
      });
      setRecommendation(result);
    } catch (requestError) {
      setError({
        message:
          requestError.message ||
          'Não foi possível criar a sugestão agora. Tente novamente mais tarde.',
        requestId: requestError.requestId || '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappHref = recommendation
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(recommendation.whatsappMessage)}`
    : '#';

  return (
    <Paper
      component="section"
      className="ai-concierge"
      elevation={0}
      aria-labelledby="ai-concierge-title"
    >
      <Box className="ai-concierge-glow" aria-hidden="true" />
      <Box className="ai-concierge-layout">
        <Box className="ai-concierge-copy">
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
            <Chip className="ai-kicker" label="✨ IA + curadoria Carliz" size="small" />
            <HealthBadge status={healthStatus} />
          </Stack>
          <Typography id="ai-concierge-title" component="h2" variant="h3">
            Doce Concierge
          </Typography>
          <Typography className="ai-concierge-lead">
            Conte como será a comemoração e receba uma sugestão de sabores e quantidades em poucos
            segundos.
          </Typography>
          <Box className="ai-trust-list" component="ul">
            <li>Recomendação limitada ao cardápio real</li>
            <li>Plano alternativo automático se a IA estiver fora do ar</li>
            <li>Confirmação humana antes de qualquer pedido</li>
          </Box>
          <Typography className="ai-privacy-note" variant="body2">
            Privacidade: não informe nome, telefone, endereço ou outros dados pessoais no campo de
            observações.
          </Typography>
        </Box>

        <Box component="form" className="ai-concierge-form" onSubmit={handleSubmit} noValidate>
          <Box className="ai-form-grid">
            <FormControl fullWidth>
              <InputLabel id="event-type-label">Tipo de evento</InputLabel>
              <Select
                labelId="event-type-label"
                label="Tipo de evento"
                value={brief.eventType}
                onChange={(event) => updateField('eventType', event.target.value)}
              >
                {EVENT_OPTIONS.map(([value, label]) => (
                  <MenuItem value={value} key={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Número de convidados"
              type="number"
              value={brief.guests}
              onChange={(event) => updateField('guests', event.target.value)}
              inputProps={{ min: 5, max: 5000 }}
              required
            />
            <FormControl fullWidth>
              <InputLabel id="budget-label">Estilo do orçamento</InputLabel>
              <Select
                labelId="budget-label"
                label="Estilo do orçamento"
                value={brief.budget}
                onChange={(event) => updateField('budget', event.target.value)}
              >
                {BUDGET_OPTIONS.map(([value, label]) => (
                  <MenuItem value={value} key={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography component="p" className="ai-field-label">
              Preferências
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {PREFERENCE_OPTIONS.map(([value, label]) => {
                const selected = brief.preferences.includes(value);
                return (
                  <Chip
                    key={value}
                    label={label}
                    color={selected ? 'primary' : 'default'}
                    variant={selected ? 'filled' : 'outlined'}
                    onClick={() => togglePreference(value)}
                    aria-pressed={selected}
                  />
                );
              })}
            </Stack>
          </Box>

          <TextField
            label="Observações opcionais"
            placeholder="Ex.: evento à tarde, mesa com outras sobremesas"
            value={brief.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            inputProps={{ maxLength: 240 }}
            helperText={`${brief.notes.length}/240 — não inclua dados pessoais`}
            multiline
            minRows={2}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            className="ai-submit-button"
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" /> Criando sugestão…
              </>
            ) : (
              'Montar minha seleção'
            )}
          </Button>

          {error && (
            <Alert severity="error" className="ai-state-panel">
              <strong>Não conseguimos montar sua sugestão agora.</strong> {error.message} Tente
              novamente mais tarde.
              {error.requestId && <small> Referência: {error.requestId}</small>}
            </Alert>
          )}

          {recommendation && (
            <Box className="ai-result" aria-live="polite">
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1}
                alignItems="flex-start"
              >
                <Box>
                  <Typography component="h3" variant="h5">
                    {recommendation.headline}
                  </Typography>
                  <Typography>{recommendation.summary}</Typography>
                </Box>
                <Chip
                  size="small"
                  label={
                    recommendation.source === 'ai' ? 'Sugestão por IA' : 'Estimativa inteligente'
                  }
                  color="secondary"
                />
              </Stack>
              <Box component="ul" className="ai-result-items">
                {recommendation.items.map((item) => (
                  <li key={item.productId}>
                    <strong>
                      {item.quantity} × {item.name}
                    </strong>
                    <span>{item.reason}</span>
                  </li>
                ))}
              </Box>
              <Alert severity="info">
                A sugestão é uma estimativa. Disponibilidade, alergênicos, valores e quantidades
                finais devem ser confirmados com a equipe.
              </Alert>
              <Button
                component="a"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                color="secondary"
                size="large"
              >
                Confirmar com a Carliz no WhatsApp
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
