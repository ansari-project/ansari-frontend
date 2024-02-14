import React from 'react'
import { View, StyleSheet } from 'react-native'
import Subscription from './Subscription'

const Footer: React.FC = () => {
  return (
    <View styles={styles.container}>
      <Subscription />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 300,
    backgroundColor: '#fff', // Assuming you want a white background
    paddingVertical: 20, // Example padding, adjust as needed
    borderTopWidth: 1, // Optional, for a top border
    borderColor: '#ccc', // Border color, if border is desired
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
})

export default Footer
