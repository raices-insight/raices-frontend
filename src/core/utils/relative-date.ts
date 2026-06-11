export function getRelativeTimeLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  if (eventDay.getTime() === today.getTime()) return `Hoy · ${time}`;
  if (eventDay.getTime() === tomorrow.getTime()) return `Mañana · ${time}`;

  const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
  return `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)} · ${time}`;
}
