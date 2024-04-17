const withSmartLoadingUx = (fetchOperation, options) => {
  const {
    delay = 500, // Delay before showing loading state (default 500ms)
    minimumDisplayTime = 1000, // Minimum display time for the loading state (default 1000ms)
    setLoadingState // Function to set the loading state
  } = options

  return async (...args) => {
    let startTime
    const timeoutId = setTimeout(() => {
      setLoadingState(true)
      startTime = Date.now()
    }, delay)

    try {
      const response = await fetchOperation(...args)
      clearTimeout(timeoutId)

      if (startTime) {
        const elapsedTime = Date.now() - startTime
        const remainingTime = minimumDisplayTime - elapsedTime

        if (remainingTime > 0) {
          await new Promise((resolve) =>
            setTimeout(() => {
              setLoadingState(false)
              resolve()
            }, remainingTime)
          )
        } else {
          setLoadingState(false)
        }
      } else {
        setLoadingState(false)
      }

      return response
    } catch (error) {
      console.error('Failed to fetch:', error)
      clearTimeout(timeoutId)
      setLoadingState(false)
      throw error
    }
  }
}

export default withSmartLoadingUx
