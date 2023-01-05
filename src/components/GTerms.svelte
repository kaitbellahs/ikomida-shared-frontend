<script lang="ts">
  import Link from './Link.svelte'
</script>

<small class="terms"
  >Esta página é protegido por reCAPTCHA e <Link
    url="https://policies.google.com/privacy"
    title="política de privacidade">política de privacidade</Link
  > e <Link url="https://policies.google.com/terms" title="termos de uso">termos de uso</Link> da google se aplicam</small
>

<style>
  small.terms {
    margin-top: 28px;
    font-size: 0.6em;
  }
  small.terms > :global(a) {
    font-size: 1em;
  }
</style>
