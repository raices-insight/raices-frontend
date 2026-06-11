export function getTimeGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  const salutation =
    hour >= 6 && hour < 12 ? 'Buenos días' :
    hour >= 12 && hour < 20 ? 'Buenas tardes' :
    'Buenas noches';
  return name ? `${salutation}, ${name}` : salutation;
}
