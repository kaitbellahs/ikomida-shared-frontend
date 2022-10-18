<script lang="ts">
  import { v4 as uuidV4 } from 'uuid'
  import Fa from 'svelte-fa'
  import { currency, percent, formatAsName } from '../Utils/Strings'
  import { current_component, bubble, listen } from 'svelte/internal'
  import { Finances, Validations } from '@ikomida/shared-logics'
  import {
    faEye,
    faEyeSlash,
    faTriangleExclamation,
    faAt,
    faTruck,
    faIdCard,
    faMobileRetro,
    faUnlock,
    faSackDollar,
    faPercent,
    faCalendar,
    faShop,
    faHourglass
  } from '@fortawesome/free-solid-svg-icons'
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
  import TTextEdit from '../Types/TTextEdit'
  import { Layout as LayoutStore } from '../Stores'
  import { Objects } from '../Utils'
  import Image from './Image.svelte'

  let Layout = LayoutStore.instance.store

  export let type: TTextEdit = TTextEdit.GENERIC
  export let placeHolder: string | undefined = undefined
  export let initialValue: string | number | undefined = undefined
  export let value: string | Date | number | undefined | undefined = undefined
  export let buttonName: string | undefined = undefined
  export let buttonIcon: IconDefinition | undefined = undefined
  export let buttonDisabled: boolean = false
  export let callback: any | undefined = undefined
  export let icon: IconDefinition | string | undefined = undefined
  export let mask: string | undefined = undefined
  export let maskKey = '_'
  export let filter: RegExp | undefined = undefined
  export let disabled = false
  export let isValid = true
  export let validation: Function | undefined = undefined
  export let leftPadding = 0
  export let rightPadding = 0
  export let marginTop = 30
  export let element: HTMLDivElement | undefined = undefined
  export let error: string | undefined = undefined
  export let min: number | undefined = undefined
  export let max: number | undefined = undefined
  export let sizeMultiplier = 1
  export let focus = false
  export let empty = true
  export let upper = false
  export let lower = false
  export let forceUpdate = false

  const uuid = uuidV4()
  const events = getEventsAction(current_component)
  let init = true
  let showSecret = false
  let input: HTMLInputElement | HTMLTextAreaElement
  let pickerInput: HTMLInputElement
  let colorInput: HTMLInputElement
  let inputValue: string
  let secret = false

  $: if (secret) {
    icon = icon ?? faUnlock
  }

  $: switch (type) {
    case TTextEdit.PHONE:
      filter = forceUpdate || !filter ? /\d/gi : filter
      mask = forceUpdate || !mask ? '(__) _____-____' : mask
      error = forceUpdate || !error ? 'O número de telefone inserido não é válido' : error
      icon = forceUpdate || !icon ? faMobileRetro : icon
      break
    case TTextEdit.CPF:
      filter = forceUpdate || !filter ? /\d/gi : filter
      mask = forceUpdate || !mask ? '___.___.___-__' : mask
      error = forceUpdate || !error ? 'O CPF inserido não é válido' : error
      icon = forceUpdate || !icon ? faIdCard : icon
      break
    case TTextEdit.CNPJ:
      filter = forceUpdate || !filter ? /\d/gi : filter
      mask = forceUpdate || !mask ? '__.___.___/____-__' : mask
      error = forceUpdate || !error ? 'O CNPJ inserido não é válido' : error
      icon = forceUpdate || !icon ? faShop : icon
      break
    case TTextEdit.COLOR:
      filter = forceUpdate || !filter ? /[a-f0-9]/gi : filter
      mask = forceUpdate || !mask ? '#______' : mask
      error = forceUpdate || !error ? 'A cor inserida não é válida' : error
      break
    case TTextEdit.CEP:
      filter = forceUpdate || !filter ? /\d/gi : filter
      mask = forceUpdate || !mask ? '_____-___' : mask
      error = forceUpdate || !error ? 'O CEP inserido não é válido' : error
      icon = forceUpdate || !icon ? faTruck : icon
      break
    case TTextEdit.EMAIL:
      error = forceUpdate || !error ? 'O email inserido não é válido' : error
      icon = forceUpdate || !icon ? faAt : icon
      break
    case TTextEdit.NAME:
      filter = forceUpdate || !filter ? /[a-z ]/gi : filter
      break
    case TTextEdit.ALPHABET:
      filter = forceUpdate || !filter ? /[a-z]/gi : filter
      break
    case TTextEdit.PASSWORD:
      secret = true
      icon = forceUpdate || !icon ? faUnlock : icon
      break
    case TTextEdit.NUMBER:
      filter = forceUpdate || !filter ? /\d/gi : filter
      max = forceUpdate || !max ? 11 : max
      break
    case TTextEdit.CURRENCY:
      max = forceUpdate || !max ? 11 : max
      filter = forceUpdate || !filter ? /\d/gi : filter
      icon = forceUpdate || !icon ? faSackDollar : icon
      break
    case TTextEdit.PERCENT:
      max = forceUpdate || !max ? 11 : max
      filter = forceUpdate || !filter ? /\d/gi : filter
      icon = forceUpdate || !icon ? faPercent : icon
      break
    case TTextEdit.ALPHA_NUMERIC:
      filter = forceUpdate || !filter ? /[A-Za-z0-9]/gi : filter
      break
    case TTextEdit.SLUG:
      filter = forceUpdate || !filter ? /[a-z0-9\.-]/gi : filter
      break
    case TTextEdit.SPACE_ALPHA_NUMERIC:
      filter = forceUpdate || !filter ? /[A-Za-z0-9 ]/gi : filter
      break
    case TTextEdit.KEY:
      filter = forceUpdate || !filter ? /[A-Za-z0-9-]/gi : filter
      break
    case TTextEdit.DATE:
      filter = forceUpdate || !filter ? /[0-9-]/gi : filter
      icon = forceUpdate || icon ? icon : faCalendar
      break
    case TTextEdit.TIME:
      mask = '__:__'
      filter = forceUpdate || !filter ? /[0-9-]/gi : filter
      icon = forceUpdate || icon ? icon : faHourglass
      break
    default:
      break
  }

  $: if (focus && input) {
    input?.focus()
  }
  $: if (secret && input) {
    buttonIcon = showSecret ? faEye : faEyeSlash
    callback = showSecretCallBack
    input.value = inputValue
  }
  $: height = (type === TTextEdit.TEXT ? 54 : 44) * sizeMultiplier
  function update() {
    if (type === TTextEdit.COLOR && colorInput) {
      colorInput.value = input.value
    } else if (type === TTextEdit.DATE) {
      const date = value as Date
      input.value = isValid
        ? `${Finances.pad(date.getDate() + 1, 2)}/${Finances.pad(date.getMonth() + 1, 2)}/${date.getFullYear()}`
        : ''
    } else {
      input.value = doMask(removeMask(String(initialValue ?? '')))
    }
  }
  $: if (init && Objects.isTrue(initialValue) && input) {
    init = false
    update()
  }

  $: if (forceUpdate && Objects.isTrue(initialValue) && input) {
    init = false
    update()
  }

  $: if (init && !Objects.isTrue(initialValue) && input) {
    init = false
    input.value = doMask('')
    if (type === TTextEdit.COLOR && colorInput) {
      colorInput.value = input.value
    }
  }

  export function updateValue(_value: string) {
    input.value = doMask(removeMask(_value))
    if (type === TTextEdit.COLOR && colorInput) {
      colorInput.value = input.value
    }
  }

  function onKeyPress<E extends Event = Event, T extends EventTarget = Element>(
    event: E & { currentTarget: EventTarget & T }
  ) {
    try {
      event.preventDefault()
      const newValue = removeMask((event?.target as any)?.value)
      if (max && (newValue?.length ?? 0) > max) {
        input.value = inputValue
        return
      }
      if (type === TTextEdit.DATE && pickerInput) {
        const date = new Date(doMask(newValue))
        value = date
        input.value = isValid
          ? `${Finances.pad(date.getDate() + 1, 2)}/${Finances.pad(date.getMonth() + 1, 2)}/${date.getFullYear()}`
          : ''
      } else {
        input.value = doMask(newValue)
      }
      if (type === TTextEdit.COLOR && colorInput) {
        colorInput.value = input.value
      }
    } catch (error: any) {
      //TODO: -- Report errors
    }
  }

  function removeMask(__value: string | string[] | undefined) {
    __value = `${__value ?? ''}`
    if (type && [TTextEdit.CURRENCY, TTextEdit.PERCENT].includes(type)) {
      __value = `${Finances.toNumber(__value)}`
    }
    __value =
      mask != undefined ? Array.from(__value).filter((char, index) => char != mask?.[index]) : Array.from(__value)
    const matches = filter ? __value.join('').match(filter) : undefined
    if (matches) {
      __value = matches
    } else if (filter && !matches) {
      __value = []
    }
    return __value.join('')
  }

  function doMask(__value: string | undefined) {
    try {
      const valueType = typeof value
      let tmpValue: string | undefined = ''
      if (mask || (type && [TTextEdit.CURRENCY, TTextEdit.PERCENT].includes(type))) {
        let index = 0
        if (mask) {
          for (let i = 0; i < mask?.length; i++) {
            if (index >= (__value?.length ?? 0)) {
              break
            }
            if (mask?.[i] == maskKey) {
              tmpValue = `${tmpValue}${__value?.[index]}`
              index++
            } else {
              tmpValue = `${tmpValue}${mask?.[i]}`
            }
          }
          value = Array.from(tmpValue)
            .filter((char, index) => char != mask?.[index])
            .join('')
        } else if (type === TTextEdit.CURRENCY) {
          value = Finances.toNumber(__value) ?? undefined
          tmpValue = currency(Number(value))
        } else if (type === TTextEdit.PERCENT) {
          value = Finances.toNumber(__value) ?? undefined
          tmpValue = percent(Number(value))
        }
      } else {
        value = __value
        tmpValue = value
      }
      isValid = validate(String(value ?? ''))

      if (type === TTextEdit.COLOR) {
        value = `#${value}`
      }

      if (upper && valueType === 'string') {
        value = String(value)?.toUpperCase()
        tmpValue = tmpValue?.toUpperCase()
      } else if (lower && valueType === 'string') {
        value = String(value)?.toLowerCase()
        tmpValue = tmpValue?.toLowerCase()
      }

      if (type === TTextEdit.NAME && tmpValue?.trim()) {
        tmpValue = formatAsName(tmpValue) ?? ''
      }
      if (valueType === 'number') {
        value = Number(value)
      } else {
        value = String(value)?.trim()
      }
      tmpValue = tmpValue
      inputValue = tmpValue ?? ''
      return tmpValue ?? ''
    } catch (error: any) {
      //TODO: -- Report errors
      return '-'
    }
  }

  function showSecretCallBack() {
    showSecret = !showSecret
    buttonIcon = showSecret ? faEye : faEyeSlash
  }

  function validate(string: string) {
    let _isValid = true
    if (min && (string?.length ?? 0) < min) {
      _isValid = false
    } else if (max && (string?.length ?? 0) > max) {
      _isValid = false
    } else if (validation) {
      _isValid = validation(string)
    } else {
      switch (type) {
        case TTextEdit.CPF:
          _isValid = Validations.validateCPF(string)
          break
        case TTextEdit.CNPJ:
          _isValid = Validations.validateCNPJ(string)
          break
        case TTextEdit.PHONE:
          _isValid = Validations.validatePhone(string)
          break
        case TTextEdit.EMAIL:
          _isValid = Validations.validateEmail(string)
          break
        case TTextEdit.PASSWORD:
          _isValid = Validations.validatePassword(string)
          break
        case TTextEdit.CEP:
          _isValid = Validations.validateCEP(string)
          break
        case TTextEdit.DATE:
          _isValid = Validations.validateDate(string)
          break
      }
    }
    return _isValid
  }

  function getEventsAction(component: { $$: { callbacks: {} } }) {
    return (node: any) => {
      const events = Object.keys(component.$$.callbacks)
      const listeners: (() => void)[] = []
      events.forEach(event => listeners.push(listen(node, event, e => bubble(component, e))))
      return {
        destroy: () => {
          listeners.forEach(listener => listener())
        }
      }
    }
  }

  function openPickerInput() {
    pickerInput?.showPicker()
  }
</script>

<div
  class="form-cell"
  style="--sizeMultiplier: {sizeMultiplier};--sizeMultiplierPow:{(
    sizeMultiplier * (sizeMultiplier !== 1 ? 0.85 : 1)
  ).toFixed(
    2
  )};--marginTop: {marginTop}px;--leftPadding: {leftPadding}px; --rightPadding: {rightPadding}; --height: {height}px;--leftPaddingPlaceHolder: {type ===
  TTextEdit.COLOR
    ? 161 + leftPadding
    : 6.5 + leftPadding}px;--color:{$Layout?.button?.background ?? '#350101'};"
  bind:this={element}
>
  {#if placeHolder}<label
      for={uuid}
      class="name"
      class:hasIcon={icon && !input?.value}
      class:placeHolder={placeHolder && !input?.value}
      >{placeHolder ?? ''}{placeHolder && input?.value ? ':' : ''}</label
    >
  {/if}
  <div>
    {#if icon}
      <div class="icon">
        {#if typeof icon === 'string'}
          <Image source={icon} name={placeHolder ?? undefined} />
        {:else}
          <Fa style="font-size: 1.3em; color: {$Layout?.button?.background ?? '#350101'};" {icon} />
        {/if}
      </div>
    {/if}
    {#if type === TTextEdit.PASSWORD}
      {#if showSecret}
        <input
          bind:this={input}
          use:events
          on:input={onKeyPress}
          class:hasIcon={icon}
          class:hasButton={buttonName || buttonIcon}
          autocomplete="off"
          id={uuid}
          type="text"
          {disabled}
        />
      {:else}
        <input
          bind:this={input}
          use:events
          on:input={onKeyPress}
          class:hasIcon={icon}
          class:hasButton={buttonName || buttonIcon}
          autocomplete="off"
          id={uuid}
          type="password"
          {disabled}
        />
      {/if}
    {:else if type === TTextEdit.TEXT}
      <textarea on:input={onKeyPress} bind:this={input} use:events autocomplete="off" id={uuid} {disabled} />
    {:else if [TTextEdit.DATE, TTextEdit.TIME].includes(type)}
      <input
        bind:this={pickerInput}
        on:input={onKeyPress}
        autocomplete="off"
        type={type === TTextEdit.DATE ? 'date' : 'time'}
        {disabled}
      />
      <input
        readonly
        bind:this={input}
        use:events
        on:click={openPickerInput}
        class:hasIcon={icon}
        class:hasButton={buttonName || buttonIcon}
        autocomplete="off"
        id={uuid}
        type="text"
        {disabled}
      />
    {:else if type === TTextEdit.COLOR}
      <div class="input" class:hasIcon={icon} class:hasButton={buttonName || buttonIcon}>
        <input bind:this={colorInput} on:input={onKeyPress} autocomplete="off" type="color" {disabled} />
        <input on:input={onKeyPress} bind:this={input} use:events autocomplete="off" id={uuid} type="text" {disabled} />
      </div>
    {:else}
      <input
        bind:this={input}
        use:events
        on:input={onKeyPress}
        class:hasIcon={icon}
        class:hasButton={buttonName || buttonIcon}
        autocomplete="off"
        id={uuid}
        type={type === TTextEdit.EMAIL ? 'email' : type.isNumeric() ? 'tel' : 'text'}
        {disabled}
      />
    {/if}
    {#if buttonName}
      <button class="button" on:click={callback} disabled={buttonDisabled}>{buttonName}</button>
    {:else if buttonIcon}
      <button class="button icon" on:click={callback}>
        <Fa style="font-size: 1.3em; color: {$Layout?.button?.background ?? '#350101'};" icon={buttonIcon} />
      </button>
    {/if}
  </div>
  {#if (error || min || max) && ((!isValid && value) || (!empty && !value))}
    <div class="error">
      <Fa style="font-size: 1.3em;" icon={faTriangleExclamation} /><span
        >{#if error}
          {error}
        {:else}
          O campo "{placeHolder}" deve ter um tamanho {min == max ? `de ${max}` : `entre ${min} e ${max}`} caracteres
        {/if}</span
      >
    </div>
  {/if}
</div>

<style>
  button {
    border: 0;
    background-color: transparent;
  }
  input[type='date'],
  input[type='time'] {
    display: none;
  }
  input:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }
  div.form-cell {
    width: 100%;
    position: relative;
    margin-top: var(--marginTop);
    padding: 0;
    padding-left: var(--leftPadding);
    padding-right: var(--rightPadding);
    line-height: 11px;
  }
  div.form-cell > .name {
    position: absolute;
    top: -15px;
    left: calc(var(--leftPadding) + 5px);
    font-size: 0.8em;
    transition: linear 200ms;
    display: flex;
  }
  div.form-cell > .name.placeHolder {
    top: calc(16.5px * var(--sizeMultiplierPow));
    left: calc(var(--leftPadding) + var(--leftPaddingPlaceHolder));
    color: #757575;
    font-size: 1em;
  }
  div.form-cell > .name.hasIcon {
    left: calc(var(--leftPadding) + calc(56.5px * var(--sizeMultiplier)));
  }
  div.form-cell > div:not(.error) {
    display: flex;
    width: 100%;
    margin: 0;
    height: var(--height);
  }
  div.form-cell > div > .input > input {
    height: 100%;
    flex: 1;
  }
  div.form-cell > div > .input {
    display: flex;
  }
  div.form-cell > div > .input,
  div.form-cell > div > input,
  div.form-cell > div > textarea {
    resize: none;
    width: 100%;
    background-color: #f2f2f2;
    height: var(--height);
    max-height: var(--height);
    border-radius: calc(4px * var(--sizeMultiplier));
    border: 0;
    margin: 0;
    -webkit-touch-callout: all;
    -webkit-user-select: all;
    -khtml-user-select: all;
    -moz-user-select: all;
    -ms-user-select: all;
    user-select: all;
  }
  .button {
    background-color: #f2f2f2;
    border: 0;
    border-radius: 0;
    border-left: 1px solid #ccc;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    margin: 0;
  }
  .icon {
    border-right: 1px solid #ccc;
    background-color: #f2f2f2;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    width: calc(50px * var(--sizeMultiplier));
    margin: 0;
    place-content: center;
    place-items: center;
    justify-items: center;
    display: flex;
    overflow: hidden;
    flex-grow: 0;
    flex-shrink: 0;
  }
  .button.icon {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    display: flex;
    place-content: center;
    place-content: center;
    place-items: center;
    justify-items: center;
  }
  .icon > :global(img) {
    object-fit: fill;
    max-height: 100%;
    overflow: hidden;
    max-width: 100%;
  }
  .input,
  input:disabled,
  textarea:disabled {
    background: #ccc;
    color: #5d5c5c;
  }
  input::-ms-reveal,
  input::-ms-clear {
    display: none;
  }
  button.button:disabled {
    background: #ccc;
    color: #5d5c5c;
  }
  div.error {
    color: red;
    margin-top: 2px;
    display: flex;
    text-align: left;
    place-items: center;
  }
  .error > span {
    font-size: 0.75em;
    line-height: 15px;
    margin-left: 10px;
  }
  div.form-cell > div > input.hasButton {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  div.form-cell > div > input.hasIcon {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>
