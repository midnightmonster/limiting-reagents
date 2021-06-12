// Source: https://en.wikipedia.org/wiki/Template:Standard_atomic_weight_of_the_elements
const ATOMIC_WEIGHTS = {
  H:	1.008,
  He:	4.0026,
  Li:	6.94,
  Be:	9.0122,
  B:	10.81,
  C:	12.011,
  N:	14.007,
  O:	15.999,
  F:	18.998,
  Ne:	20.180,
  Na:	22.990,
  Mg:	24.305,
  Al:	26.982,
  Si:	28.085,
  P:	30.974,
  S:	32.06,
  Cl:	35.45,
  Ar:	39.95,
  K:	39.098,
  Ca:	40.078,
  Sc:	44.956,
  Ti:	47.867,
  V:	50.942,
  Cr:	51.996,
  Mn:	54.938,
  Fe:	55.845,
  Co:	58.933,
  Ni:	58.693,
  Cu:	63.546,
  Zn:	65.38,
  Ga:	69.723,
  Ge:	72.630,
  As:	74.922,
  Se:	78.971,
  Br:	79.904,
  Kr:	83.798,
  Rb:	85.468,
  Sr:	87.62,
  Y:	88.906,
  Zr:	91.224,
  Nb:	92.906,
  Mo:	95.95,
  Ru:	101.07,
  Rh:	102.91,
  Pd:	106.42,
  Ag:	107.87,
  Cd:	112.41,
  In:	114.82,
  Sn:	118.71,
  Sb:	121.76,
  Te:	127.60,
  I:	126.90,
  Xe:	131.29,
  Cs:	132.91,
  Ba:	137.33,
  La:	138.91,
  Ce:	140.12,
  Pr:	140.91,
  Nd:	144.24,
  Sm:	150.36,
  Eu:	151.96,
  Gd:	157.25,
  Tb:	158.93,
  Dy:	162.50,
  Ho:	164.93,
  Er:	167.26,
  Tm:	168.93,
  Yb:	173.05,
  Lu:	174.97,
  Hf:	178.49,
  Ta:	180.95,
  W:	183.84,
  Re:	186.21,
  Os:	190.23,
  Ir:	192.22,
  Pt:	195.08,
  Au:	196.97,
  Hg:	200.59,
  Tl:	204.38,
  Pb:	207.2,
  Bi:	208.98,
  Th:	232.04,
  Pa:	231.04,
  U:	238.03
}

function moleculeMass(mol){
  return mol.map(el=>el.sub*ATOMIC_WEIGHTS[el.el]).reduce((a,b)=>a+b)
}
export function balanced(a,b){
  // Check for balance conveniently using mass, hopefully avoiding floating point precision issues
  const aMass = a.map(m=>Math.round(m.unitMass * 10_000) * m.n).reduce((a,b)=>a+b)
  const bMass = b.map(m=>Math.round(m.unitMass * 10_000) * m.n).reduce((a,b)=>a+b)
  return aMass == bMass
}

export function parseMolecules(str){
  try {
    return str.replace(/\s+/g,'').split('+').map(nMolStr=>{
      const [,n,molStr] = /^(\d*)([A-Za-z0-9]+)$/.exec(nMolStr.trim())
      const mol = [...molStr.matchAll(/([A-Z][a-z]?)(\d*)/g)].map(([_,el,sub])=>{
        if(!ATOMIC_WEIGHTS[el]) throw {knownErr:`Unknown element ${el}`};
        return {el,sub:1*(sub||'1')}
      })
      return {n:1*(n||'1'),mol,unitMass:moleculeMass(mol)}
    })
  } catch(e) {
    const out = []
    out.error = e.knownErr || "Could not understand expression";
    return out
  }
}
export function stoich(reactants,products,inputs){
  const n = Math.min(...reactants.map((r,i)=>inputs[i]/(r.n*r.unitMass)));
  return products.map(p=>n*p.n*p.unitMass)
}
export function optimumFor(reactants,inputs,me){
  const myMass = reactants[me].n * reactants[me].unitMass;
  return Math.max(...reactants.map((r,i)=>myMass/(r.n*r.unitMass)*inputs[i]))
}