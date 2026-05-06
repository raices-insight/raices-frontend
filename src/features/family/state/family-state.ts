import type { CreateFamilyResponse } from '../api/schemas';

/**
 * Módulo compartido de estado de familia.
 * Permite que useFamily y useCreateFamily (en distintas rutas) compartan
 * el mismo dato sin necesidad de un React Context a nivel root.
 */

let _family: CreateFamilyResponse | null = null;
const _listeners = new Set<() => void>();

function notify(): void {
  _listeners.forEach((fn) => fn());
}

export function getFamilyState(): CreateFamilyResponse | null {
  return _family;
}

export function setFamilyState(family: CreateFamilyResponse | null): void {
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
