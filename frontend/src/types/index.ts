export interface SystemInfo {
  cpu_percent: number;
  memory_percent: number;
  memory_total: number;
  memory_used: number;
  server_name: string;
  version: string;
  os: string;
}

export interface TranscodeInfo {
  is_transcoding: boolean;
  video_codec: string;
  audio_codec: string;
  completion_percentage: number;
}

export interface MediaInfo {
  bitrate: number;
  container: string;
  resolution: string;
}

export interface PlayState {
  position_ticks: number;
  runtime_ticks: number;
  is_paused: boolean;
  is_muted: boolean;
}

export interface Session {
  id: string;
  user_name: string;
  client: string;
  device_name: string;
  now_playing_name: string;
  now_playing_type: string;
  now_playing_year: number;
  play_state: PlayState;
  transcode_info: TranscodeInfo;
  media_info: MediaInfo;
}

export interface LibraryCounts {
  movie_count: number;
  series_count: number;
  episode_count: number;
  music_count: number;
  total_count: number;
}

export interface MostWatchedItem {
  name: string;
  type: string;
  play_count: number;
  image_url?: string;
}

export interface HistoryEntry {
  id: string;
  user_name: string;
  item_name: string;
  item_type: string;
  date_played: string;
  play_duration: string;
}

export interface RecentItem {
  id: string;
  name: string;
  type: string;
  year: number;
  date_added: string;
  image_url?: string;
}
