import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    backgroundColor: '#F2F2F2',
    height: '100vh',
    fontFamily: 'Roboto',
  },
  appHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 56,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff', // f2f2f2
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  appContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    // marginBottom: 32,
  },
  infoIcon: {
    fontSize: 24,
    color: '#08786b',
  },
  infoPopup: {
    position: 'absolute',
    top: 56, // Position below the header
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 56,
    paddingHorizontal: 16,
    boxShadowColor: '#000',
    boxShadowOffset: { width: 0, height: 8 },
    boxShadowOpacity: 0.2,
    boxShadowRadius: 16,
    zIndex: 1001,
  },
  appFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    width: '100vh',
    // backgroundColor: '#fff',
    // Add your background color, padding, etc.
  },
})

export default styles
