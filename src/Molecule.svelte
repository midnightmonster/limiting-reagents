<script>
  export let n = 1
  export let mol
</script>

<span class="molecule">
{#if n > 1}<span class="coefficient">{n}</span>{/if}
{#each mol as element}
  <span class="element">{element.el}{#if element.sub > 1}<sub>{element.sub}</sub>{/if}</span>
{/each}
</span>

<style>
  .molecule {
    display:inline-flex;
  }
  .coefficient {
    margin-right:0.2em;
  }
</style>
