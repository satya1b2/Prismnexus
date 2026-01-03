
export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface UseCase {
  title: string;
  description: string;
  iconName: string;
}

export type NexusModel = 
  | 'gemini-3-flash-preview' 
  | 'gemini-3-pro-preview' 
  | 'gemini-flash-lite-latest'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-flash-image'
  | 'gemini-3-pro-image-preview'
  | 'veo-3.1-fast-generate-preview'
  | 'gemini-2.5-flash-native-audio-preview-09-2025'
  | 'gemini-2.5-flash-preview-tts';

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  instructions: string;
  model: NexusModel;
  tools: {
    search: boolean;
    maps: boolean;
    thinking: boolean;
  };
  status: 'draft' | 'deployed' | 'archived';
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '2:3' | '3:2' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';
