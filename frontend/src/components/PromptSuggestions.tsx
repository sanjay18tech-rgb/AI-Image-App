import { Box, Typography, Chip } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

type PromptSuggestion = {
  text: string;
  style: string;
  category: string;
};

const promptSuggestions: PromptSuggestion[] = [
  {
    text: "Elegant evening gown with flowing silk fabric, dramatic lighting, high fashion editorial photography, Vogue style",
    style: "Editorial",
    category: "Evening Wear",
  },
  {
    text: "Bold statement jacket with architectural shoulders, monochromatic palette, studio lighting, fashion magazine cover",
    style: "Editorial",
    category: "Outerwear",
  },
  {
    text: "Oversized hoodie with graphic print, baggy cargo pants, chunky sneakers, urban street style, natural daylight",
    style: "Streetwear",
    category: "Casual",
  },
  {
    text: "Vintage denim jacket with patches, distressed jeans, retro sneakers, 90s hip-hop aesthetic, street photography",
    style: "Streetwear",
    category: "Vintage",
  },
  {
    text: "Haute couture gown with intricate embroidery, dramatic train, runway lighting, Paris Fashion Week aesthetic",
    style: "Runway",
    category: "Couture",
  },
  {
    text: "Bold power suit with sharp tailoring, statement accessories, catwalk setting, professional runway presentation",
    style: "Runway",
    category: "Tailoring",
  },
  {
    text: "Clean white shirt with perfectly tailored black trousers, minimal accessories, neutral tones, Scandinavian aesthetic",
    style: "Minimalist",
    category: "Classic",
  },
  {
    text: "Flowing linen dress in muted earth tones, simple silhouette, natural lighting, understated elegance, timeless style",
    style: "Minimalist",
    category: "Casual",
  },
];

type PromptSuggestionsProps = {
  currentStyle: string;
  onSelectPrompt: (prompt: string) => void;
};

export const PromptSuggestions = ({ currentStyle, onSelectPrompt }: PromptSuggestionsProps) => {
  const filteredSuggestions = promptSuggestions.filter((s) => s.style === currentStyle);

  if (filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          }}
        >
          <AutoAwesome sx={{ color: 'white', fontSize: 16 }} />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Suggestions for {currentStyle}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {filteredSuggestions.map((suggestion, index) => (
          <Chip
            key={index}
            label={suggestion.text.length > 50 ? `${suggestion.text.slice(0, 50)}...` : suggestion.text}
            onClick={() => onSelectPrompt(suggestion.text)}
            sx={{
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.4)',
              background: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 600,
              fontSize: '0.75rem',
              '&:hover': {
                borderColor: 'primary.main',
                background: 'linear-gradient(135deg, rgba(139, 92, 236, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                color: 'primary.main',
                transform: 'scale(1.05)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PromptSuggestions;
