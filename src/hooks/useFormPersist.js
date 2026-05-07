import { useState, useEffect } from 'react'

/**
 * Igual que useState pero persiste el valor en sessionStorage.
 * sessionStorage se borra cuando el usuario cierra la pestaña,
 * pero sobrevive si cambia de ruta o minimiza el navegador.
 *
 * @param {string} key   - clave única en sessionStorage
 * @param {any} initial  - valor inicial si no hay nada guardado
 */
export function useFormPersist(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = sessionStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // sessionStorage lleno o bloqueado — se ignora silenciosamente
    }
  }, [key, value])

  function clear() {
    sessionStorage.removeItem(key)
    setValue(initial)
  }

  return [value, setValue, clear]
}
