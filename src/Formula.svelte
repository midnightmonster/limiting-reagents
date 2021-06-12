<script>
import Molecule from './Molecule.svelte'
export let f
</script>
<span class="formula">
{#each f as nMol, i}
  {#if i}<span class="plus">+</span>{/if}<Molecule n={nMol.n} mol={nMol.mol} />
{:else}
  {#if f.error}<span class="error">{f.error}</span>{:else}?{/if}
{/each}
</span>

<style>
  .formula {
    display:inline-flex;
  }
  .plus {
    margin:0 0.2em;
  }
  .error { color: red; }
</style>