import React from 'react';
import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { AudioPlayButton } from '@/core/ui/audio-play-button';
import type { VoiceRecording } from '../api/schemas';

interface HomeVoiceRecordingsProps {
  recordings: VoiceRecording[];
  loading: boolean;
  onViewAll?: () => void;
}

// Backend returns English enum values (Mood enum in enums.py)
const MOOD_LABELS: Record<string, string> = {
  happy: 'POSITIVO',
  calm: 'TRANQUILO',
  sad: 'TRISTE',
  lonely: 'SOLO/A',
  anxious: 'ANSIOSO',
  stressed: 'ESTRESADO',
  tired: 'CANSANCIO',
};

const MOOD_COLORS: Record<string, string> = {
  happy: '#4CAF50',
  calm: '#2196F3',
  sad: '#607D8B',
  lonely: '#9C27B0',
  anxious: '#FF9800',
  stressed: '#F44336',
  tired: '#FF6F00',
};

// ─── Time helpers ─────────────────────────────────────────────────────────────

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  if (diffDays === 1) {
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `Ayer, ${time}`;
  }
  return `Hace ${diffDays} días`;
}

// ─── RecordingItem ─────────────────────────────────────────────────────────────

function RecordingItem({ recording }: { recording: VoiceRecording }) {
  const createdAt = new Date(recording.created_at);
  const timeAgo = formatTimeAgo(createdAt);
  const moodKey = recording.mood ?? '';
  const moodLabel = MOOD_LABELS[moodKey] ?? null;
  const moodColor = MOOD_COLORS[moodKey] ?? '#9E9E9E';

  return (
    <View className="flex-row items-center gap-3 bg-white rounded-2xl p-4 mb-3 border border-black/5 shadow-sm">
      {/* Play button — only interactive when we have a presigned URL */}
      {recording.audio_url ? (
        <AudioPlayButton
          audioUrl={recording.audio_url}
          testID={`play-recording-${recording.id}`}
        />
      ) : (
        <View className="w-11 h-11 rounded-full items-center justify-center bg-black/5">
          <IconSymbol name="mic.slash.fill" size={18} color="#9CA3AF" />
        </View>
      )}

      {/* Info */}
      <View className="flex-1">
        <Text
          className="font-headline font-bold text-raices-text text-sm"
          numberOfLines={1}
        >
          {recording.description || 'Registro de voz'}
        </Text>
        <Text className="font-body text-xs text-raices-text-muted mt-0.5">
          {timeAgo}
        </Text>
      </View>

      {/* Mood badge */}
      {moodLabel ? (
        <View
          className="px-2 py-1 rounded-lg"
          style={{ backgroundColor: `${moodColor}22` }}
        >
          <Text
            className="font-label font-bold text-[10px]"
            style={{ color: moodColor }}
          >
            {moodLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── HomeVoiceRecordings ───────────────────────────────────────────────────────

/**
 * List of the most recent voice recordings for the selected older adult.
 * Returns null when the list is empty (no section rendered).
 */
export function HomeVoiceRecordings({
  recordings,
  loading,
  onViewAll,
}: HomeVoiceRecordingsProps) {
  if (recordings.length === 0 && !loading) return null;

  return (
    <View className="px-5 mb-6">
      {/* Section header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-headline font-bold text-raices-text text-lg">
          Registros de voz recientes
        </Text>
        {onViewAll ? (
          <Pressable onPress={onViewAll}>
            <Text className="font-body text-sm text-raices-primary font-semibold">
              Ver todos
            </Text>
          </Pressable>
        ) : null}
      </View>

      {recordings.map((r) => (
        <RecordingItem key={r.id} recording={r} />
      ))}
    </View>
  );
}
