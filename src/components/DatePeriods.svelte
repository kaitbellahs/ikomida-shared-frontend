<script lang="ts">
  import { Classes, TTextEdit } from '../Types'
  import Divider from './Divider.svelte'
  import TextEdit from './TextEdit.svelte'
  import { v4 as uuid } from 'uuid'
  import FloatRemove from './FloatRemove.svelte'
  import { faAdd } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import FloatButton from '@ikomida/shared-frontend/lib/components/FloatButton.svelte'
  import { days } from '../Utils/Strings'
  import ExpandableBox from './ExpandableBox.svelte'

  export let value: Classes.CBusinessTime[] | undefined
  export let title: string | undefined = undefined
  export let startTitle: string | undefined = undefined
  export let endTitle: string | undefined = undefined
  export let mandatory = false

  let scope = false

  $: if (value && !scope) {
    value = Classes.CBusinessTime.fromObject([
      getDay(0) ? getDay(0) : { day: 0, hours: [] },
      getDay(1) ? getDay(1) : { day: 1, hours: [] },
      getDay(2) ? getDay(2) : { day: 2, hours: [] },
      getDay(3) ? getDay(3) : { day: 3, hours: [] },
      getDay(4) ? getDay(4) : { day: 4, hours: [] },
      getDay(5) ? getDay(5) : { day: 5, hours: [] },
      getDay(6) ? getDay(6) : { day: 6, hours: [] }
    ])
  }
  function getDay(day: number) {
    return value?.filter(item => item.day === day)?.[0]?.toJSON()
  }
  const addHours = async (businessTime: Classes.CBusinessTime) => {
    scope = true
    const index = value?.indexOf(businessTime) ?? -1
    if (businessTime && index >= 0) {
      if (!businessTime?.hours && value) {
        value[index].hours = []
      }
      value?.[index].hours?.push(Classes.CBusinessTimeHours.fromObject({ id: uuid(), start: '08:00', end: '23:59' }))
    }
    value = value
  }

  async function onRemoveClick(businessTime: Classes.CBusinessTime, id?: string) {
    scope = true
    const index = value?.indexOf(businessTime) ?? -1
    if (businessTime && index >= 0 && value) {
      value[index].hours = value[index].hours?.filter(businessHour => businessHour.id !== id)
    }
    value = value
  }
  onMount(() => {})
</script>

{#if value && value.length > 0}
  {#each value as businessDay}
    {#if businessDay.day}
      <div class="shadow day">
        <FloatButton icon={faAdd} top={0} right={1} callback={() => addHours(businessDay)} />
        <h3>{days[businessDay.day]}</h3>
        {#if businessDay.hours && businessDay.hours.length > 0}
          {#each businessDay.hours ?? [] as businessHour}
            <div class="shadow busninessHours">
              <FloatRemove top={-8} right={-7} callback={() => onRemoveClick(businessDay, businessHour.id)} />
              <div class="twoCells">
                <TextEdit
                  placeHolder={startTitle ? startTitle : 'Abertura'}
                  initialValue={businessHour.start}
                  bind:value={businessHour.start}
                  type={TTextEdit.TIME}
                  sizeMultiplier={0.7}
                  marginTop={8}
                  rightPadding={8}
                />
                <TextEdit
                  sizeMultiplier={0.7}
                  marginTop={8}
                  placeHolder={endTitle ? endTitle : 'Fechamento'}
                  bind:value={businessHour.end}
                  initialValue={businessHour.end}
                  type={TTextEdit.TIME}
                  leftPadding={8}
                />
              </div>
            </div>
          {/each}
        {:else}
          <span class="noExpedient">sem horário de expediente</span>
        {/if}
      </div>
    {/if}
  {/each}
{:else if mandatory}
  <Divider />
  <span>Você precisa definir seus {title ? title : 'horários de funcionamento'}</span>
{/if}

<style>
  .busninessHours {
    position: relative;
    border-radius: 8pt;
    margin-top: 12pt;
    padding: 12pt;
  }
  .day {
    flex: 1;
    border-radius: 4pt;
    margin: 0;
    margin-top: 16pt;
    padding: 8pt;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    position: relative;
  }
  .day > h3 {
    text-shadow: 0.8pt 1pt #18056b66;
    border-bottom: 1pt solid #ccc;
  }
  .day > .noExpedient {
    margin-top: 8pt;
  }
  .twoCells {
    display: flex;
  }
</style>
