<script>
import {parseMolecules, stoich, optimumFor, balanced} from './chemistry'
import Formula from './Formula.svelte'
import Molecule from './Molecule.svelte';

const getInputs = ()=>[200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200]
const custom = {name:"Custom",reactants:"",products:"",inputs:getInputs()}
const reactions = [
	{name:"Make water",reactants:"2 H2 + 1 O2",products:"2 H2O",inputs:getInputs()},
	{name:"Make ammonia",reactants:"1 N2 + 3 H2",products:"2 NH3",inputs:getInputs()},
	{name:"Combust methane",reactants:"1 CH4 + 2 O2",products:"1 CO2 + 2 H2O",inputs:getInputs()},
	{name:"Neutralize acid & base",reactants:"HCl + NaOH",products:"H2O + NaCl",inputs:getInputs()},
	custom
]
const maxInput = 1000
let maxOutput = maxInput
let reaction = reactions[0]
let s_reactants, _reactants, reactants=[],
		s_products,  _products,  products=[]
let inputs, outputHtmlFor, scaleCss, outputs, error

const setCustom = ()=>{
	console.log('setCustom')
	if(reaction !== custom && (s_reactants != reaction.reactants || s_products != reaction.products)){
		console.log("setting custom")
		custom.reactants = s_reactants
		custom.products = s_products
		custom.inputs = reaction.inputs
		reaction = custom
	}
	return true
}

$:{
	s_reactants = reaction.reactants
	s_products = reaction.products
	inputs = reaction.inputs
	console.log("setting strings 'cause reaction changed")
}

$:{
	_reactants = parseMolecules(s_reactants);
	_products = parseMolecules(s_products);

	if(_reactants.length && _products.length){
		error = balanced(_reactants,_products) ? false : {global:"Reaction is not balanced"}
		if(!error){
			reactants = _reactants
			products = _products
			outputHtmlFor = reactants.map((_,i)=>`input${i}`).join(' ')
			maxOutput = Math.max(...stoich(reactants, products, reactants.map(r=>maxInput)))
		}
	} else {
		error = true
	}
	scaleCss = maxOutput > maxInput ? `--outputScale:1;--inputScale:${(maxInput/maxOutput).toFixed(3)}` : `--outputScale:${(maxOutput/maxInput).toFixed(3)};--inputScale:1;`
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
	<span class="custom">
		<input bind:value={s_reactants} class:error={!_reactants.length} on:input={reaction != custom && setCustom} /> → <input bind:value={s_products} class:error={!_products.length} on:input={reaction != custom && setCustom} />
	</span>
</div>
<div class="cols">
	<fieldset>
		<legend>Before</legend>
		<Formula f={_reactants} />
		<div class="meters" class:inactive={error}>
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
	<big class:inactive={error}>→</big>
	<fieldset>
		<legend>After</legend>
		<Formula f={_products} />
		<div class="meters" class:inactive={error}>
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
	{#if error?.global}
		<p class="error">
			{error.global}
		</p>
	{/if}
</div>
<p>By <a href="https://letterblock.com/">Joshua Paine</a>. <a href="https://github.com/midnightmonster/limiting-reagents">Source code available</a>.</p>
</main>

<style>

main {
	display: inline-flex;
	flex-direction: column;
	align-items: stretch;
	background:#f5f5f5;
}
select {
	margin-right:0.4em;
}
.custom input {
  width: 150px;
}
p.error {
	background: red;
	color: white;
	position:absolute;
	left:50%;
	top:50%;
	transform: translate(-50%,-50%);
	padding: 0.2em 1em;
	margin:0;
	border-radius: 2em;
}
.cols {
	display:flex;
	flex-direction: row;
	align-items: center;
	justify-content:space-between;
	position:relative;
}
.inactive {
	pointer-events: none;
	opacity:0.5;
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
.meters input, .meters output {
	width:75px;
	display: inline-block;
	margin-right:3px;
}
.meters output {
	text-align:center;
	padding-left:0;
	padding-right:0;
}
input.error {
	border-color: red;
}
</style>