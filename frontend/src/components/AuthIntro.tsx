import { Box, Typography, Paper, Chip } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const checkpoints = [
  "JWT-secured authentication with bcrypt hashing",
  "Strict validation and predictable 20% overload simulation",
  "Retry, abort, and history restore workflows for rapid iteration",
];

const AuthIntro = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Chip
          label="Modelia AI Studio"
          sx={{
            alignSelf: 'flex-start',
            fontWeight: 700,
            textTransform: 'uppercase',
            bgcolor: 'primary.light',
            color: 'white',
            px: 2,
            py: 1,
            fontSize: '0.75rem',
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #1f2937 0%, #7c3aed 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Professional fashion generation platform
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: '42rem',
              lineHeight: 1.7,
              fontWeight: 500,
            }}
          >
            Upload reference images, craft detailed prompts, and explore multiple style directions. Built with TypeScript, React, and a production-ready Express API with JWT authentication.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {checkpoints.map((item) => (
          <Paper
            key={item}
            elevation={0}
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 2,
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: 4,
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                flexShrink: 0,
              }}
            >
              <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, pt: 0.5, lineHeight: 1.6 }}>
              {item}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 3,
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
              transform: 'scale(1.02)',
            },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'text.secondary',
              mb: 2,
              display: 'block',
            }}
          >
            Processing time
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            1–2 seconds
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Simulated delay for consistent UX testing
          </Typography>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 3,
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
              transform: 'scale(1.02)',
            },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'text.secondary',
              mb: 2,
              display: 'block',
            }}
          >
            History retention
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Latest 5
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Auto-pruned with instant restore capability
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthIntro;
