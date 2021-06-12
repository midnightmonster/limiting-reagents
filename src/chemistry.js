export function parseMolecules(str){
	return str.replace(/\s+/g,'').split('+').map(nMolStr=>{
		const [,n,molStr] = /^(\d+)([A-Za-z0-9]+)$/.exec(nMolStr.trim())
		const mol = [...molStr.matchAll(/([A-Z][a-z]?)(\d*)/g)].map(([_,el,sub])=>{
			return {el,sub:1*(sub||'1')}
		})
		return {n:1*(n||'1'),mol}
	})
}
export function stoich(reactants,products,inputs){
  const n = reactants.reduce((min,r,i) => {
    const q = Math.floor(inputs[i]/r.n);
    return q < min ? q : min
  },Infinity);
  return products.map(p=>n*p.n)
}
export function optimumFor(reactants,inputs,me){
  const myN = reactants[me].n;
  return reactants.map((r,i)=>myN/r.n*inputs[i]).reduce((a,b)=>a>b ? a : b)
}