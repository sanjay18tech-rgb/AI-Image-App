import { useEffect, lazy, Suspense } from "react";
import { Box, AppBar, Toolbar, Typography, Button, Container, Paper, Chip, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useAuthStore } from "./stores/authStore";

const AuthForm = lazy(() => import("./components/AuthForm"));
const AuthIntro = lazy(() => import("./components/AuthIntro"));
const Studio = lazy(() => import("./components/Studio"));

const App = () => {
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const hydrated = useAuthStore((state) => state.hydrated);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={64} sx={{ mb: 3, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary" role="status" aria-live="polite">
            Preparing your Modelia studio…
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #ec4899 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                }}
              >
                M
              </Box>
            </motion.div>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #1f2937 0%, #6b7280 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Modelia AI Studio
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Fashion Design & Generation
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <Paper
                  elevation={0}
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    px: 2,
                    py: 1,
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 2,
                    textAlign: 'right',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Paper>
                <Button
                  variant="outlined"
                  onClick={signOut}
                  sx={{
                    borderRadius: 2,
                    borderColor: 'grey.300',
                    color: 'text.primary',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'grey.400',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Chip
                label="Sign in required"
                size="small"
                sx={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Suspense
          fallback={
            <Box
              sx={{
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          {user ? (
            <Studio />
          ) : (
            <Container maxWidth="xl" sx={{ py: 6 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { lg: '1.15fr 1fr' }, gap: 4 }}>
                <Suspense fallback={<Box sx={{ minHeight: 400 }} />}>
                  <AuthIntro />
                </Suspense>
                <Suspense fallback={<Box sx={{ minHeight: 400 }} />}>
                  <AuthForm />
                </Suspense>
              </Box>
            </Container>
          )}
        </Suspense>
      </Box>

      <Paper
        component="footer"
        elevation={0}
        sx={{
          mt: 'auto',
          py: 3,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              © {new Date().getFullYear()} Modelia Labs. Built for the Modelia hiring challenge.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['React', 'TypeScript', 'Tailwind', 'Express', 'Prisma'].map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default App;
