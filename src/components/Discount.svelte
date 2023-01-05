<script lang="ts">
  import { currency, percent } from '../Utils/Strings.js'
  import { Types } from '@ikomida/shared-types'

  export let top = 0
  export let right = 0
  export let value: number
  export let type: Types.TDiscount
</script>

<discount class="shadow" style="--top:{top}pt;--right:{right}pt;"
  >-{Types.TDiscount.VALUE === type ? currency(value) : percent(value)}</discount
>

<style>
  discount {
    position: absolute;
    top: var(--top);
    right: var(--right);
    padding: 8px;
    font-size: 12px;
    -webkit-border-radius: 0 4px 0 4px;
    -moz-border-radius: 0 4px 0 4px;
    border-radius: 0 4px 4px 0;
    background: #16b516;
    color: white;
    z-index: 99;
    font-family: RobotoBold, sans-serif;
    line-height: 1;
    text-shadow: 0px 4px 8px #000000;
    box-shadow: 0 4px 8px #0000009e;
  }

  discount:after {
    right: 100%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    border-color: rgba(136, 183, 213, 0);
    border-width: 12px;
    top: 50%;
    margin-top: -12px;
    border-right-color: #16b516;
  }

  discount:before {
    content: '';
    z-index: 2;
    position: absolute;
    top: calc(50% - 3px);
    right: 100%;
    width: 6px;
    height: 6px;
    opacity: 0.95;
    background: #ffffff;
    border-radius: 7px;
    -webkit-box-shadow: inset 0.5px 0 rgba(0, 0, 0, 0.6);
    box-shadow: inset 0.5px 0 rgba(0, 0, 0, 0.6);
  }
</style>
