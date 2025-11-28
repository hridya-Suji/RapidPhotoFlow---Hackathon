import { useEffect, useRef } from "react"

/**
 * Custom hook for polling an async function at regular intervals
 * @param {Function} callback - Async function to call
 * @param {number} interval - Polling interval in milliseconds (default: 2000ms)
 */
const usePolling = (callback, interval = 2000) => {
  const callbackRef = useRef(callback)
  const intervalRef = useRef(null)

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    // Run callback immediately
    callbackRef.current()

    // Set up interval to run callback every interval
    intervalRef.current = setInterval(() => {
      callbackRef.current()
    }, interval)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [interval])
}

export default usePolling

