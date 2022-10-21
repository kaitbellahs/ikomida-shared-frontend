import { Types } from '@ikomida/shared-types'

export default class TUploadablePhoto extends Types.TBaseType {
  static VENDOR = new TUploadablePhoto('VENDOR')
  static PROFILE = new TUploadablePhoto('PROFILE')
  static THUMB = new TUploadablePhoto('THUMB')
}
