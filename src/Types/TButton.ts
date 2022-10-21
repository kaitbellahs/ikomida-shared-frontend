import { Types } from '@ikomida/shared-types'

export default class TButton extends Types.TBaseType {
  static TRANSPARENT = new TButton('TRANSPARENT')
  static SECONDARY = new TButton('SECONDARY')
  static PRIMARY = new TButton('PRIMARY')
}
