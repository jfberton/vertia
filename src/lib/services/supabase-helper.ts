/**
 * Helper de Resiliencia para Supabase en Arquitectura Híbrida
 *
 * Si la red o Supabase tardan más del límite de tiempo prudencial (timeout),
 * la operación es abortada rápidamente para permitir que el sistema
 * conmute de forma transparente e instantánea a los datos locales (localStorage / in-memory).
 */

export const SUPABASE_TIMEOUT_MS = 1200;

export async function withSupabaseTimeout<T>(
  promiseLike: PromiseLike<T>,
  timeoutMs: number = SUPABASE_TIMEOUT_MS
): Promise<T> {
  let timer: NodeJS.Timeout | number | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`[SupabaseTimeout] Operación abortada tras ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([Promise.resolve(promiseLike), timeoutPromise]);
    return result;
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer as any);
    }
  }
}
