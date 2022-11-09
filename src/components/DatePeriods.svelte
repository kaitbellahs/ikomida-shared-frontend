<script lang="ts">
  import { Classes, TTextEdit } from '../Types'
  import Button from './Button.svelte'
  import Checkbox from './Checkbox.svelte'
  import Divider from './Divider.svelte'
  import TextEdit from './TextEdit.svelte'
  import { v4 as uuid } from 'uuid'
  import FloatRemove from './FloatRemove.svelte'
  import Fa from 'svelte-fa'
  import { faClock } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'

  interface IDay {
    name: string
    checked: boolean
  }
  export let business: Classes.CBusinessTime = Classes.CBusinessTime.fromObject({
    days: [],
    hours: []
  })
  export let title: string | undefined = undefined
  export let startTitle: string | undefined = undefined
  export let endTitle: string | undefined = undefined
  export let mandatory = false

  const days: IDay[] = [
    { name: 'Domingo', checked: false },
    { name: 'Segunda-feira', checked: false },
    { name: 'Terça-feira', checked: false },
    { name: 'Quarta-feira', checked: false },
    { name: 'Quinta-feira', checked: false },
    { name: 'Sexta-feira', checked: false },
    { name: 'Sabado', checked: false }
  ]

  function check(index: number) {
    return (event: CustomEvent) => {
      if (!Array.isArray(business.days)) {
        business.days = []
      }
      const indexOfDay = business.days?.indexOf(index) ?? -1
      if (event.detail.checked && indexOfDay < 0) {
        business?.days?.push(index)
      } else if (!event.detail.checked && indexOfDay >= 0) {
        business?.days?.splice(indexOfDay, 1)
      }
      business = business
    }
  }

  $: if (business?.days) {
    for (let index = 0; index < days.length; index++) {
      days[index].checked = business.days.includes(index)
    }
  }
  const addHours = () => {
    if (business) {
      if (!business?.hours) {
        business.hours = []
      }
      business.hours.push(Classes.CBusinessTimeHours.fromObject({ id: uuid(), start: '08:00', end: '23:59' }))
      business.hours = business?.hours
    }
    business = business
  }

  function onRemoveClick(id?: string) {
    if (business) {
      business.hours = business?.hours?.filter(businessHour => businessHour.id !== id)
    }
    business = business
  }
  onMount(() => {
    for (const index of business?.days ?? []) {
      days[index].checked = true
    }
  })
</script>

<h2>{title ? title : 'horário de funcionamento'}</h2>
{#if (business?.hours?.length ?? 0) > 0}
  {#each business?.hours ?? [] as businessHour}
    <div class="busninessHours">
      <FloatRemove callback={() => onRemoveClick(businessHour.id)} />
      <div class="twoCells">
        <TextEdit
          placeHolder={startTitle ? startTitle : 'Abertura'}
          initialValue={businessHour.start}
          bind:value={businessHour.start}
          type={TTextEdit.TIME}
          rightPadding={10}
        />
        <TextEdit
          placeHolder={endTitle ? endTitle : 'Fechamento'}
          bind:value={businessHour.end}
          initialValue={businessHour.end}
          type={TTextEdit.TIME}
          leftPadding={10}
        />
      </div>
    </div>
  {/each}
{:else if mandatory}
  <Divider />
  <span>Você precisa definir seus {title ? title : 'horário de funcionamento'}</span>
{/if}
<Divider />
<Button on:click={addHours}><Fa icon={faClock} /><span>Adicionar horários</span></Button>
<div class="days">
  {#each days as day, index}
    <div class="day">
      <Checkbox marginTop={0} checked={day.checked} on:check={check(index)} label={day.name} />
    </div>
  {/each}
</div>

<style>
  .busninessHours {
    position: relative;
  }
  .days {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .days > .day {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 5px;
    width: 50%;
    display: flex;
    flex-direction: column;
    flex-basis: 40%;
    text-shadow: 0.5px 1px #18056b66;
    box-shadow: 1px 1.5px #00000099;
  }
  .twoCells {
    display: flex;
  }
</style>
