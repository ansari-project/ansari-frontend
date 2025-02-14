import React from 'react'
import { Redirect, useLocalSearchParams } from 'expo-router'

// Define the NotFoundScreen component
const NotFoundScreen: React.FC = () => {
  const params = useLocalSearchParams()

  return <Redirect href={params.errorMsg ? `/404?errorMsg=${params.errorMsg}` : '/404'} />
}

export default NotFoundScreen
