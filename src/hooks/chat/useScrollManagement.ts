import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

type UseScrollManagementType = {
  isScrolledUp: boolean
  // eslint-disable-next-line no-unused-vars
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollToBottom: () => void
}

export const useScrollManagement = (scrollThreshold: number = 50): UseScrollManagementType => {
  const [isScrolledUp, setIsScrolledUp] = useState<boolean>(false)

  const handleScrollDebounced = useCallback(
    debounce((isScrolledUp: boolean) => {
      setIsScrolledUp(isScrolledUp)
    }, 100),
    [],
  )

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent

      // Use a threshold to determine if the user is "close enough" to the bottom to auto-scroll.
      // This can help account for minor discrepancies in scroll position calculations.
      const closeToBottom = contentSize.height - contentOffset.y - layoutMeasurement.height < scrollThreshold
      handleScrollDebounced(!closeToBottom)
    },
    [handleScrollDebounced],
  )

  const scrollToBottom = useCallback(() => {
    setIsScrolledUp(false)
  }, [])

  // Clean up the handleScrollDebounced on unmount or when the component is no longer active
  useEffect(() => {
    return () => {
      handleScrollDebounced.cancel()
    }
  }, [])

  return { isScrolledUp, handleScroll, scrollToBottom }
}
