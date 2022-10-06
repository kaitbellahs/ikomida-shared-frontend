<script lang="ts">
  import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
  import FloatButton from './FloatButton.svelte'
  import Alert from './Alert.svelte'

  export let callback: (() => void) | (() => Promise<void>) | undefined | null = null
  export let color: string | null = null
  export let background: string | null = null
  export let top = 0
  export let right = 0

  let showAlert = false

  function toggleAlert() {
    showAlert = !showAlert
  }

  function execCallback() {
    callback?.()
    toggleAlert()
  }
</script>

<FloatButton icon={faTrashAlt} callback={toggleAlert} {color} {background} {top} {right} />

{#if showAlert}
  <Alert
    title="Alerta"
    message={`Você realmente quer deletar este item? Esta operação é permanente!`}
    closeCallBack={toggleAlert}
    buttons={[
      {
        name: 'Sim',
        callback: execCallback
      },
      {
        name: 'Não quero',
        callback: toggleAlert,
        principal: true
      }
    ]}
  />
{/if}
