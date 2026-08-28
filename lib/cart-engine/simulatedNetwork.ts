/**
 * Stands in for a real cart API call. Both the delay and whether it fails
 * are caller-controlled, so demo behaviour and tests never depend on real
 * network timing or randomness.
 */
export function simulateNetwork<T>(
  value: T,
  options: { forceFail?: boolean; delayMs?: number } = {},
): Promise<T> {
  const { forceFail = false, delayMs = 550 } = options;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (forceFail) {
        reject(new Error("The connection to the store was interrupted."));
      } else {
        resolve(value);
      }
    }, delayMs);
  });
}
