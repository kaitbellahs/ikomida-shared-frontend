<script lang="ts">
  import { faEdit } from '@fortawesome/free-solid-svg-icons';
  import FloatButton from './FloatButton.svelte';
  export let callback: (() => void) | null = null;
  export let color: string | null = null;
  export let background: string | null = null;
  export let top = 0;
  export let right = 0;
</script>

<FloatButton icon={faEdit} {callback} {color} {background} {top} {right} />
