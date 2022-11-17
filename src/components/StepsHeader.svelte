<script lang="ts">
  import { onMount } from 'svelte'

  export let steps: string[] = []
  export let step = 0
</script>

<div class="shadow steps" style="--steps:{steps.length};">
  <div class="shadow line" />
  <div class="circles">
    {#each steps as item, i}
      <div class="step {i < step ? 'concluded' : i === step ? 'active' : 'inactive'}">
        <div class="shadow {i === step ? 'legend' : ''}">
          {#if i === step}
            {item}
          {/if}
        </div>
        <div class="ball" />
      </div>
    {/each}
  </div>
</div>

<style>
  .steps {
    height: 40pt;
    background: #fff;
    width: 100%;
    position: relative;
    display: flex;
    border-radius: 8pt;
  }
  .steps > .line {
    position: absolute;
    bottom: 12pt;
    left: calc(100% / (var(--steps) * 2));
    right: calc(100% / (var(--steps) * 2));
    height: 4pt;
    background-color: #ccc;
  }
  .steps > .circles {
    display: flex;
    justify-content: space-around;
    place-items: center;
    width: 100%;
  }
  .steps > .circles > .step {
    position: relative;
    background-color: transparent;
  }
  .steps > .circles > .step > .ball {
    width: 24pt;
    height: 24pt;
    border-radius: 12pt;
    position: relative;
  }
  .steps > .circles > .step.concluded > .ball {
    background-color: green;
    border: 2pt solid rgb(0, 84, 0);
  }
  .steps > .circles > .step.active > .ball {
    background-color: #4c0708;
    border: 2pt solid #320505;
  }
  .steps > .circles > .step.inactive > .ball {
    background-color: #ccc;
    border: 2pt solid rgb(127, 127, 127);
  }
  .steps > .circles > .step > .legend {
    position: absolute;
    top: 16pt;
    left: 50%;
    transform: translateX(-50%);
    padding: 8pt 4pt 4pt 4pt;
    border-radius: 0 0 4pt 4pt;
    background: linear-gradient(to bottom, #0000001c, #00000000, #fff, #fff, #fff);
  }
</style>
