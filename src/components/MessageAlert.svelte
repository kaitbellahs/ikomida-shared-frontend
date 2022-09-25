<script lang="ts">
  import Alert from './Alert.svelte';
  import MessageAlert from '../Stores/MessageAlert';

  let messageAlert = MessageAlert.createInstance().store;

  async function closeAlert() {
    $messageAlert?.callback?.();
    MessageAlert.instance.hide();
  }
</script>

{#if $messageAlert}
  <Alert
    type="small"
    title={typeof $messageAlert?.object === 'string'
      ? 'Alerta'
      : $messageAlert?.object?.code
      ? `Erro ${$messageAlert?.object.code}`
      : $messageAlert?.object?.title ?? 'Alerta'}
    closeCallBack={closeAlert}
    buttons={[{ name: 'OK', callback: closeAlert, principal: true }]}
  >
    {typeof $messageAlert?.object === 'string'
      ? $messageAlert?.object
      : $messageAlert?.object?.error
      ? $messageAlert?.object.error
      : $messageAlert?.object?.message ?? 'Ocurreu um erro inesperado, entre em contato com o suporte!'}
  </Alert>
{/if}
