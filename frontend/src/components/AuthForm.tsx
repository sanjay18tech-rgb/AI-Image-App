import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { Security } from "@mui/icons-material";
import { api } from "../lib/api";
import { useAuthStore } from "../stores/authStore";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

type FormValues = z.infer<typeof schema>;

const modeCopy = {
  signup: {
    title: "Create your Modelia account",
    submit: "Sign up",
    toggle: "Already have an account?",
    toggleCta: "Log in",
  },
  login: {
    title: "Welcome back",
    submit: "Log in",
    toggle: "Need a new account?",
    toggleCta: "Sign up",
  },
} as const;

type Mode = keyof typeof modeCopy;

export const AuthForm = () => {
  const [mode, setMode] = useState<Mode>("signup");
  const [serverError, setServerError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";

    try {
      type AuthResponse = { user: { id: string; email: string; createdAt: string }; token: string };
      const response = await api.post(endpoint, values);
      const { user, token } = response.data as AuthResponse;
      setAuth({ user, token });
      reset();
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const data = error.response.data;
        // Handle field-level validation errors
        if (data.errors && typeof data.errors === "object") {
          const fieldErrors = Object.values(data.errors) as string[];
          setServerError(fieldErrors[0] || data.message || "Validation failed");
        } else if (data.message) {
          setServerError(String(data.message));
        } else {
          setServerError(mode === "signup" ? "Unable to create account. Please try a different email" : "Login failed. Please check your email and password");
        }
      } else if (mode === "signup") {
        setServerError("Unable to create account. Please try a different email");
      } else {
        setServerError("Login failed. Please check your email and password");
      }
      console.error("Auth error:", error);
    }
  });

  const copy = modeCopy[mode];

  return (
    <Card sx={{ p: 5 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Chip
            label={mode === "signup" ? "Create account" : "Welcome back"}
            size="small"
            sx={{
              mb: 2,
              fontWeight: 700,
              textTransform: 'uppercase',
              bgcolor: 'primary.light',
              color: 'white',
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1f2937 0%, #7c3aed 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {copy.title}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
          }}
        >
          <Security sx={{ color: 'white', fontSize: 28 }} />
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
        Secure authentication with JWT tokens and bcrypt password hashing.
      </Typography>

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email address"
              type="email"
              fullWidth
              placeholder="you@example.com"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              placeholder="••••••••"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? "Processing..." : copy.submit}
        </Button>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          type="button"
          variant="text"
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setServerError(null);
          }}
          sx={{
            alignSelf: 'flex-start',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          {copy.toggle} <Typography component="span" sx={{ fontWeight: 700, ml: 0.5 }}>{copy.toggleCta}</Typography>
        </Button>

        {serverError && (
          <Alert severity="error" sx={{ minHeight: 24 }}>
            {serverError}
          </Alert>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          By continuing, you agree to Modelia's terms of service.
        </Typography>
      </Box>
    </Card>
  );
};

export default AuthForm;
