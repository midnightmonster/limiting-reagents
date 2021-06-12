const ATOMIC_WEIGHTS = {
  H:1.008,
  C:12.011,
  N:14.007,
  O:15.999
}

function moleculeMass(mol){
  return mol.map(el=>el.sub*ATOMIC_WEIGHTS[el.el]).reduce((a,b)=>a+b)
}

export function parseMolecules(str){
	return str.replace(/\s+/g,'').split('+').map(nMolStr=>{
		const [,n,molStr] = /^(\d+)([A-Za-z0-9]+)$/.exec(nMolStr.trim())
		const mol = [...molStr.matchAll(/([A-Z][a-z]?)(\d*)/g)].map(([_,el,sub])=>{
			return {el,sub:1*(sub||'1')}
		})
		return {n:1*(n||'1'),mol,unitMass:moleculeMass(mol)}
	})
}
export function stoich(reactants,products,inputs){
  const n = Math.min(...reactants.map((r,i)=>inputs[i]/(r.n*r.unitMass)));
  return products.map(p=>n*p.n*p.unitMass)
}
export function optimumFor(reactants,inputs,me){
  const myMass = reactants[me].n * reactants[me].unitMass;
  return Math.max(...reactants.map((r,i)=>myMass/(r.n*r.unitMass)*inputs[i]))
}