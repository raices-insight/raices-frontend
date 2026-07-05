import type { FamilyDetailsResponse, GetFamilyResponse } from '../api/schemas';

/** El estado compartido puede contener la respuesta completa de detalles o la
 *  respuesta más acotada de /family/my-family. Los consumidores solo leen
 *  presencia (=== null) o campos comunes a ambas. */
type FamilyStateValue = GetFamilyResponse | FamilyDetailsResponse;

/**
 * Módulo compartido de estado de familia.
 * Permite que useFamily y useCreateFamily (en distintas rutas) compartan
 * el mismo dato sin necesidad de un React Context a nivel root.
 */

let _family: FamilyStateValue | null = null;
const _listeners = new Set<() => void>();

function notify(): void {
  _listeners.forEach((fn) => fn());
}

export function getFamilyState(): FamilyStateValue | null {
  return _family;
}

export function setFamilyState(family: FamilyStateValue | null): void {
  _family = family;
  notify();
}

/** Suscribe un listener que se ejecutará cada vez que el estado cambie.
 *  Retorna una función para cancelar la suscripción. */
export function subscribe(listener: () => void): () => void {
  _listeners.add(listener);
  return () => {
    _listeners.delete(listener);
  };
}
