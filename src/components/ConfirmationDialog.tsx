import React from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

type ConfirmationDialogProps = {
  stacked?: boolean
  isRTL: boolean // Indicates if the layout direction is right-to-left
  visible: boolean // Controls the visibility of the modal
  onConfirm: () => void // Function to call when the confirm action is triggered
  onCancel: () => void // Function to call when the cancel action is triggered
  title?: string // Optional title text
  message: React.ReactNode // Message content, can be a string or a component for custom styling
}

/**
 * A dialog component to confirm or cancel an action, with support for RTL layouts.
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  stacked = false,
  isRTL,
  visible,
  onConfirm,
  onCancel,
  title,
  message,
}) => (
  <Modal visible={visible} transparent={true} animationType='fade' onRequestClose={onCancel}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        {title && <Text style={[styles.titleStyle, isRTL && styles.textAlignRight]}>{title}</Text>}
        <Text style={[styles.messageContainer, isRTL && styles.textAlignRight]}>{message}</Text>
        <View
          style={[styles.buttonContainer, isRTL && styles.buttonContainerRTL, stacked && styles.buttonContainerStacked]}
        >
          <Pressable style={[styles.button, styles.buttonCancel]} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonConfirm]} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 25,
    alignItems: 'center',
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 4,
    elevation: 5,
    maxWidth: 448,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
    width: '100%',
    justifyContent: 'right',
  },
  buttonContainerStacked: {
    flexDirection: 'column',
    width: '100%',
    gap: 12,
  },
  buttonContainerRTL: {
    justifyContent: 'left',
  },
  button: {
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  buttonCancel: {
    backgroundColor: '#E8E8E8',
  },
  buttonConfirm: {
    backgroundColor: '#D32F2F',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    width: '100%',
  },
  messageContainer: {
    marginBottom: 20,
    width: '100%',
    textAlign: 'left',
  },
  textAlignRight: {
    textAlign: 'right',
  },
})

export default ConfirmationDialog
