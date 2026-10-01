import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'

/**
 * Maximum number of images that can be attached to one message (must match the backend's MAX_IMAGES_PER_MESSAGE).
 */
export const MAX_IMAGES_PER_MESSAGE = 4

/**
 * Longest side, in pixels, that images are resized to before upload. Claude downscales anything larger anyway.
 */
const MAX_IMAGE_DIMENSION = 1568

/**
 * Maximum decoded image size accepted by the backend (MAX_IMAGE_BYTES).
 */
const MAX_IMAGE_BYTES = 3_750_000

/**
 * An image picked by the user and prepared for sending.
 */
export interface PendingImage {
  /** A data URI that can be used directly as an <Image> source. */
  uri: string
  mediaType: 'image/jpeg'
  /** Base64-encoded JPEG data, without the data URI prefix. */
  base64: string
}

export class ImageTooLargeError extends Error {}

/**
 * Resizes an image so its longest side is at most MAX_IMAGE_DIMENSION and re-encodes it as JPEG.
 *
 * @param asset - The asset returned by the image picker.
 * @returns The prepared image.
 */
const prepareImage = async (asset: ImagePicker.ImagePickerAsset): Promise<PendingImage> => {
  const context = ImageManipulator.manipulate(asset.uri)
  const longestSide = Math.max(asset.width, asset.height)
  if (longestSide > MAX_IMAGE_DIMENSION) {
    context.resize(asset.width >= asset.height ? { width: MAX_IMAGE_DIMENSION } : { height: MAX_IMAGE_DIMENSION })
  }

  const rendered = await context.renderAsync()
  const result = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.8, base64: true })
  const base64 = (result.base64 ?? '').replace(/^data:[^,]*,/, '')
  if (!base64 || (base64.length * 3) / 4 > MAX_IMAGE_BYTES) {
    throw new ImageTooLargeError('Image is too large')
  }

  return { uri: `data:image/jpeg;base64,${base64}`, mediaType: 'image/jpeg', base64 }
}

/**
 * Opens the photo library and returns the selected images, prepared for sending.
 *
 * @param limit - The maximum number of images the user may select.
 * @returns The prepared images; empty if the user cancelled.
 */
export const pickImages = async (limit: number): Promise<PendingImage[]> => {
  if (limit <= 0) {
    return []
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: limit > 1,
    selectionLimit: limit,
    quality: 1,
  })
  if (result.canceled) {
    return []
  }

  return Promise.all(result.assets.slice(0, limit).map(prepareImage))
}
