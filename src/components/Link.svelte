<script lang="ts">
  import { Clipboard } from '@capacitor/clipboard'
  import { AppLauncher } from '@capacitor/app-launcher'
  import MessageAlert from '../Stores/MessageAlert'

  export let url: string
  export let title: string | null = null

  async function open() {
    const { value } = await AppLauncher.canOpenUrl({ url })
    await AppLauncher.openUrl({ url })
    if (!value) {
      await Clipboard.write({ string: url })
      MessageAlert.instance.show(
        `Se seu navegador não abriu: abre-o e digitar essa URL: ${url}, também foi copiado para sua área de transferência para colá-lo!`
      )
    }
  }
</script>

<a href={url} on:click|preventDefault={open} {title}><slot /></a>
