
export interface Song {
  id: number;
  title: string;
  desc: string;
  bpm: number;
  mood: string;
}

export interface SongLyrics {
  title: string;
  intro: string;
  verse1: string;
  chorus: string;
  instrumentalBreak: string;
  verse2: string;
  bridge: string;
  finalChorus: string;
  outro: string;
}

export interface SunoPrompt {
  style: string;
  description: string;
  tags: string;
  weirdness: number;
  styleInfluence: number;
  bpm: number;
  mood: string;
}

export interface GenerationResult {
  lyrics: SongLyrics;
  suno: SunoPrompt;
}

export enum RnBStyle {
  CLASSIC = 'Classic R&B / Soul',
  CONTEMPORARY = 'Contemporary R&B',
  NEO_SOUL = 'Neo-Soul',
  ALTERNATIVE = 'Alternative R&B',
  HIPHOP_SOUL = 'Hip-Hop Soul / R&B Hip-Hop',
  FUNK = 'Funk-Influenced R&B',
  QUIET_STORM = 'Quiet Storm'
}

export enum Language {
  ENGLISH = 'English',
  INDONESIAN = 'Indonesian',
  KOREAN = 'Korean (K-R&B Style)',
  SPANISH = 'Spanish (Latin Soul)',
  JAPANESE = 'Japanese (City Pop/R&B Mix)',
  CUSTOM = 'Custom (Tentukan Sendiri)'
}
