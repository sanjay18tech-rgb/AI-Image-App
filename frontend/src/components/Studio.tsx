import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Close,
  Favorite,
  Lightbulb,
  PhotoCamera,
  Refresh,
  Replay,
  RestartAlt,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerate, type GenerationRecord } from "../hooks/useGenerate";
import PromptSuggestions from "./PromptSuggestions";
import { resizeImage } from "../utils/imageResize";

const styles = ["Editorial", "Streetwear", "Runway", "Minimalist"] as const;
const colorThemes = ["Vibrant", "Neutral", "Monochrome", "Pastel"] as const;

type FormValues = {
  prompt: string;
  style: (typeof styles)[number];
  colorTheme: (typeof colorThemes)[number];
};

const formSchemaDefaults: FormValues = {
  prompt: "",
  style: styles[0],
  colorTheme: colorThemes[0],
};

type StatusState = {
  severity: "success" | "info" | "warning" | "error";
  message: string;
};

const examplePrompt = "A matchmaking platform that connects individuals based on shared passions and interests.";

const createObjectUrl = (file: File) => URL.createObjectURL(file);

export const Studio = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: formSchemaDefaults,
  });

  const {
    generate,
    abort,
    resetError,
    isGenerating,
    error,
    history,
    attemptsRemaining: _attemptsRemaining,
    maxAttempts: _maxAttempts,
    attemptNumber: _attemptNumber,
    buildAssetUrl,
  } = useGenerate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GenerationRecord[]>([]);
  const [status, setStatus] = useState<StatusState | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<{ values: FormValues; image: File } | null>(
    null,
  );

  const promptValue = watch("prompt");
  const promptLength = promptValue?.length ?? 0;

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGeneratedImages(history);
  }, [history]);

  useEffect(() => {
    if (error) {
      setStatus({ severity: "error", message: error });
    }
  }, [error]);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 5000); // Auto-dismiss after 5 seconds

      return () => {
        clearTimeout(timer);
      };
    }
  }, [status]);

  useEffect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const handleImageSelect = (file: File | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setImageError(null);
    resetError();

    if (file) {
      setPreviewUrl(createObjectUrl(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const clearSubmissionInputs = () => {
    setValue("prompt", "", { shouldDirty: false, shouldTouch: false });
    handleImageSelect(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submitWithValues = async (values: FormValues, file: File) => {
    resetError();
    setStatus({ severity: "info", message: "Generating your fashion design…" });

    try {
      const result = await generate({ ...values, image: file });
      setStatus({ severity: "success", message: "Generation completed successfully" });
      setLastSubmission({ values, image: file });
      clearSubmissionInputs();
      return result;
    } catch {
      if (!status || status.severity !== "error") {
        setStatus({ severity: "error", message: "Generation failed. Please try again" });
      }
      setLastSubmission({ values, image: file });
      return null;
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!imageFile) {
      setImageError("Please upload a reference image to continue");
      return;
    }

    await submitWithValues(values, imageFile);
  });

  const handleRetry = async () => {
    if (!lastSubmission || !_attemptsRemaining || _attemptsRemaining <= 0) {
      return;
    }

    await submitWithValues(lastSubmission.values, lastSubmission.image);
  };

  const handleAbort = () => {
    abort();
    setStatus({ severity: "info", message: "Generation aborted" });
  };

  const handleTryExample = () => {
    setValue("prompt", examplePrompt, { shouldDirty: true, shouldTouch: true });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError("Image size must be less than 10MB");
      event.target.value = "";
      return;
    }

    if (!/image\/(png|jpeg)/.test(file.type)) {
      setImageError("Please upload a JPEG or PNG image");
      event.target.value = "";
      return;
    }

    // Resize image before upload (max width 1920px)
    try {
      setStatus({ severity: "info", message: "Processing image..." });
      const resizedFile = await resizeImage(file, 1920);
      handleImageSelect(resizedFile);
      setStatus(null);
    } catch (error) {
      console.error("Image resize error:", error);
      setImageError("Failed to process image. Please try again.");
      setStatus(null);
    }
    
    event.target.value = "";
  };

  const handleRestore = async (generation: GenerationRecord) => {
    setIsRestoring(true);
    resetError();

    try {
      setValue("prompt", generation.prompt, { shouldDirty: true });
      setValue("style", generation.style as FormValues["style"], { shouldDirty: true });

      const response = await fetch(buildAssetUrl(generation.imageUrl));
      const blob = await response.blob();
      const restoredFile = new File([blob], `generation-${generation.id}.png`, {
        type: blob.type || "image/png",
      });

      handleImageSelect(restoredFile);
      setLastSubmission({
        values: {
          prompt: generation.prompt,
          style: generation.style as FormValues["style"],
          colorTheme: getValues("colorTheme"),
        },
        image: restoredFile,
      });

      setStatus({ severity: "success", message: "Generation restored. Ready to tweak or regenerate" });
    } catch (restoreError) {
      console.error("Failed to restore generation", restoreError);
      setStatus({
        severity: "error",
        message: "Unable to restore the image. Please upload a new reference image",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box>
            <Box
              sx={{
                mb: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #1f2937 0%, #7c3aed 50%, #ec4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Generate Fashion Designs
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Create stunning fashion visuals with AI-powered generation
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Favorite />}
                  sx={{
                    borderRadius: 2,
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(20px)",
                    fontWeight: 600,
                  }}
                >
                  Favorites
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  sx={{
                    borderRadius: 2,
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(20px)",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    resetError();
                    setStatus({ severity: "info", message: "History refreshed." });
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity={status.severity} sx={{ mb: 3 }}>
                    {status.message}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ p: 4, mb: 4 }}>
                <Box component="form" onSubmit={onSubmit} sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* <Box
                  sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  }}
                >
                  <Box>
                    <Controller
                      name="style"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="style-label">Design Style</InputLabel>
                          <Select
                            {...field}
                            labelId="style-label"
                            label="Design Style"
                            disabled={isGenerating}
                          >
                            {styles.map((style) => (
                              <MenuItem key={style} value={style}>
                                {style}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      name="colorTheme"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="theme-label">Color Theme</InputLabel>
                          <Select
                            {...field}
                            labelId="theme-label"
                            label="Color Theme"
                            disabled={isGenerating}
                          >
                            {colorThemes.map((theme) => (
                              <MenuItem key={theme} value={theme}>
                                {theme}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>
                </Box> */}

                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                    Reference Image
                  </Typography>
                  {previewUrl ? (
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <CardMedia
                        component="img"
                        image={previewUrl}
                        alt="Reference"
                        sx={{
                          width: 200,
                          height: 200,
                          borderRadius: 3,
                          border: "2px solid",
                          borderColor: "primary.main",
                          boxShadow: 3,
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        aria-label="Remove selected image"
                        onClick={() => {
                          handleImageSelect(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: "error.main",
                          color: "white",
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                        size="small"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      component="label"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px dashed",
                        borderColor: "primary.main",
                        borderRadius: 3,
                        p: 5,
                        cursor: "pointer",
                        background:
                          "linear-gradient(135deg, rgba(139, 92, 236, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                        transition: "all 0.3s",
                        "&:hover": {
                          borderColor: "primary.dark",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleFileSelect}
                        disabled={isGenerating}
                        style={{ display: "none" }}
                      />
                      <PhotoCamera sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Click to upload
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        JPEG or PNG (max. 10MB)
                      </Typography>
                    </Box>
                  )}
                  {imageError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {imageError}
                    </Alert>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                    Write prompt
                  </Typography>
                  <Controller
                    name="prompt"
                    control={control}
                    rules={{
                      validate: (value) =>
                        value && value.trim().length >= 5
                          ? true
                          : "Prompt must be at least 5 characters long",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Write prompt"
                        multiline
                        rows={6}
                        fullWidth
                        placeholder="Describe your fashion vision in detail..."
                        disabled={isGenerating}
                        error={!!errors.prompt}
                        helperText={errors.prompt?.message}
                      />
                    )}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Min. 5 characters
                    </Typography>
                    <Chip
                      size="small"
                      label={`${promptLength} chars`}
                      color={promptLength < 5 ? "warning" : "primary"}
                      variant={promptLength < 5 ? "outlined" : "filled"}
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Lightbulb />}
                      onClick={handleTryExample}
                      sx={{
                        bgcolor: "primary.light",
                        color: "white",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "primary.main" },
                      }}
                    >
                      Try example prompt
                    </Button>
                  </Box>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 236, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <PromptSuggestions
                    currentStyle={getValues("style")}
                    onSelectPrompt={(prompt) => {
                      setValue("prompt", prompt, { shouldDirty: true, shouldTouch: true });
                    }}
                  />
                </Paper>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={
                        isGenerating ||
                        !imageFile ||
                        !getValues("prompt")?.trim() ||
                        promptLength < 5
                      }
                      startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : undefined}
                      sx={{
                        color: "#ffffff",
                        "&.Mui-disabled": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    >
                      {isGenerating ? "Generating..." : "Generate fashion design"}
                    </Button>
                  </Box>

                  {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Chip
                      color="primary"
                      label={`Attempt ${attemptNumber || 0} of ${maxAttempts}`}
                      variant={attemptNumber ? "filled" : "outlined"}
                    />
                    <Chip
                      color={attemptsRemaining > 0 ? "success" : "warning"}
                      label={`${attemptsRemaining} retries remaining`}
                      variant="outlined"
                    />
                  </Box> */}

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<Replay />}
                      disabled={!lastSubmission || _attemptsRemaining <= 0 || isGenerating}
                      onClick={handleRetry}
                    >
                      Retry last generation
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      color="error"
                      startIcon={<RestartAlt />}
                      disabled={!isGenerating}
                      onClick={handleAbort}
                    >
                      Stop generation
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
            </motion.div>

            {generatedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Recent Generations
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 3,
                      gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
                    }}
                  >
                    {generatedImages.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      >
                        <Card
                          sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                            position: "relative",
                          }}
                        >
                        <CardActionArea
                          onClick={() => void handleRestore(item)}
                          disabled={isRestoring || isGenerating}
                          aria-label={`Restore generation ${item.prompt}`}
                        >
                          <CardMedia
                            component="img"
                            image={buildAssetUrl(item.imageUrl)}
                            alt={item.prompt}
                            sx={{ height: 180, objectFit: "cover" }}
                          />
                          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Chip
                              size="small"
                              label={item.style}
                              sx={{
                                alignSelf: "flex-start",
                                fontWeight: 600,
                                bgcolor: "primary.main",
                                color: "white",
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.prompt}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(item.createdAt).toLocaleString()}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        {isRestoring && (
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            <CircularProgress size={32} />
                          </Box>
                        )}
                      </Card>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Studio;
