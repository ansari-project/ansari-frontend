import { toggleInformationPopup } from '@/store'
import { useDispatch } from 'react-redux'

export const useToggleInfoPopup = () => {
  const dispatch = useDispatch()
  const toggleInfoPopup = (openInfoPopup: boolean) => {
    dispatch(toggleInformationPopup(openInfoPopup))
  }

  return toggleInfoPopup
}
