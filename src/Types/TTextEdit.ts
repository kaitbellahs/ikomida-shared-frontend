import { Types } from '@ikomida/shared-types'

export default class TTextEdit extends Types.TBaseType {
  static GENERIC = new TTextEdit('GENERIC')
  static TEXT = new TTextEdit('TEXT')
  static PHONE = new TTextEdit('PHONE')
  static CPF = new TTextEdit('CPF')
  static CNPJ = new TTextEdit('CNPJ')
  static COLOR = new TTextEdit('COLOR')
  static CEP = new TTextEdit('CEP')
  static EMAIL = new TTextEdit('EMAIL')
  static NAME = new TTextEdit('NAME')
  static ALPHABET = new TTextEdit('ALPHABET')
  static PASSWORD = new TTextEdit('PASSWORD')
  static NUMBER = new TTextEdit('NUMBER')
  static CURRENCY = new TTextEdit('CURRENCY')
  static PERCENT = new TTextEdit('PERCENT')
  static ALPHA_NUMERIC = new TTextEdit('ALPHA_NUMERIC')
  static SPACE_ALPHA_NUMERIC = new TTextEdit('SPACE_ALPHA_NUMERIC')
  static SLUG = new TTextEdit('SLUG')
  static KEY = new TTextEdit('KEY')
  static DATE = new TTextEdit('DATE')
  static TIME = new TTextEdit('TIME')

  isNumeric() {
    switch (this) {
      case TTextEdit.CEP:
      case TTextEdit.PHONE:
      case TTextEdit.CEP:
      case TTextEdit.CPF:
      case TTextEdit.CNPJ:
      case TTextEdit.NUMBER:
      case TTextEdit.CURRENCY:
      case TTextEdit.PERCENT:
        return true
    }
    return false
  }
  isDate() {
    return this === TTextEdit.DATE
  }
  isTime() {
    return this === TTextEdit.TIME
  }
}
