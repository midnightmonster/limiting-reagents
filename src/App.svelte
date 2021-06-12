<script>
import {parseMolecules, stoich, optimumFor} from './chemistry'
import Formula from './Formula.svelte'
import Molecule from './Molecule.svelte';

const reactions = [
	{name:"Make water",reactants:"2 H2 + 1 O2",products:"2 H2O"},
	{name:"Make ammonia",reactants:"1 N2 + 3 H2",products:"2 NH3"},
	{name:"Combust methane",reactants:"1 CH4 + 2 O2",products:"1 CO2 + 2 H2O"},
]
const maxInput = 100
let reaction = reactions[0], reactants, products, inputs, maxOutput, outputHtmlFor, scaleCss, outputs
$:{
	reactants = parseMolecules(reaction.reactants);
	products = parseMolecules(reaction.products);
	if(!reaction.inputs){
		reaction.inputs = reactants.map(r=>0)
	}
	outputHtmlFor = reactants.map((_,i)=>`input${i}`).join(' ')
	maxOutput = Math.max(...stoich(reactants, products, reactants.map(r=>maxInput)))
	scaleCss = maxOutput > maxInput ? `--outputScale:1;--inputScale:${(maxInput/maxOutput).toFixed(3)}` : `--outputScale:${(maxOutput/maxInput).toFixed(3)};--inputScale:1;`
	inputs = reaction.inputs
}
$:{
	outputs = stoich(reactants,products,inputs);
}
const htmlOptimum = (optimum,value)=>(optimum > maxInput && value==maxInput) ? maxInput - 1 : optimum
</script>

<main style={scaleCss}>
<div>
	<select bind:value={reaction}>
		{#each reactions as r}
			<option value={r}>{r.name}</option>
		{/each}
	</select>
	<Formula f={reactants} /> → <Formula f={products} />
</div>
<div class="cols">
	<fieldset>
		<legend>Before</legend>
		<div class="meters">
			{#each reactants as r, i}
				<div class="labeled-meter">
					<div class="meter-container">
						<meter class="input"
							value={inputs[i]}
							optimum={htmlOptimum(optimumFor(reactants,inputs,i),inputs[i])}
							low={Math.min(maxInput,optimumFor(reactants,inputs,i))-0.1}
							min="0"
							max={maxInput}
						>{inputs[i]}</meter>
					</div>
					<label>
						<input id="input{i}" type="number" bind:value={inputs[i]} min="0" max={maxInput}>g<br />
						<Molecule mol={r.mol} />
					</label>
				</div>
			{/each}
		</div>
	</fieldset>
	<big>→</big>
	<fieldset>
		<legend>After</legend>
		<div class="meters">
			{#each products as p, i}
				<div class="labeled-meter">
					<div class="meter-container">
						<meter class="output" value={outputs[i]} min="0" max={maxOutput}>{outputs[i]}</meter>
					</div>
					<label>
						<output for={outputHtmlFor}>{outputs[i].toFixed(3)}</output>g<br />
						<Molecule mol={p.mol} />
					</label>
				</div>
			{/each}
		</div>
	</fieldset>
</div>
<p>By <a href="https://letterblock.com/">Joshua Paine</a>. <a href="https://github.com/midnightmonster/limiting-reagents">Source code available</a>.</p>
</main>

<style>
select {
	margin-right:1em;
}
.cols {
	display:flex;
	flex-direction: row;
	align-items: center;
}
big { font-size: 3em; font-weight: bold; margin:0 0.5em; }
.meters {
	display: flex;
	flex-direction: row;
}
.labeled-meter {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.labeled-meter + .labeled-meter {
	margin-left: 1em;
}
.meter-container {
	--mheight: 300px;
	--mwidth: 40px;
	margin:0.5em 0;
	width:var(--mwidth);
	height:var(--mheight);
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}
meter {
	box-sizing: border-box;
	height:var(--mwidth);
	transform-origin: calc(var(--mwidth) / 2) calc(var(--mwidth) / 2);
	transform: rotate(-90deg);
}
meter.input {
	width:calc(var(--mheight) * var(--inputScale));
}
meter.output {
	width:calc(var(--mheight) * var(--outputScale));
}
label {
	display:block;
	text-align: center;
}
input, output {
	width:70px;
	display: inline-block;
}
</style>