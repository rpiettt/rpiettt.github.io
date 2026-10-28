'use strict';
const YEARS = 73, WEEKS = 52;
const NS = 'http://www.w3.org/2000/svg';
const grid = document.querySelector('#circles');
const dateFormatter = new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',year:'numeric',month:'numeric',day:'numeric'});
let renderedDay = null;
let selected = null;

function ringRadius(year) {
 return 11+(year-1)*2.45;
}

function updateDiagram() {
const todayParts = dateFormatter.formatToParts(new Date());
const datePart = name => Number(todayParts.find(p => p.type === name).value);
const today = Date.UTC(datePart('year'), datePart('month')-1, datePart('day'));
if (today === renderedDay) return;
const focusedYear = grid.contains(document.activeElement) ? document.activeElement.dataset.year : null;
let age = datePart('year') - 1994;
if (today < Date.UTC(datePart('year'),3,11)) age--;
const anniversary = Date.UTC(1994 + age,3,11);
const nextBirthday = Date.UTC(1995 + age,3,11);
// 52 equal slices of each birthday-to-birthday year keep the rings aligned with birthdays.
const progress = (today-anniversary)/(nextBirthday-anniversary)*WEEKS;
const completeWeeks = Math.floor(progress);
const currentWeek = Math.min(WEEKS, completeWeeks+1);
const summary = `${age} years · week ${currentWeek} of year ${age+1}`;
function svgElement(name,attrs){const el=document.createElementNS(NS,name);for(const [key,value] of Object.entries(attrs))el.setAttribute(key,value);return el;}
const svg = svgElement('svg',{viewBox:'11.5 11.5 377 377',role:'group','shape-rendering':'geometricPrecision','aria-label':`73 concentric year rings, filling in 52 weekly increments from April 11. ${summary}; ${completeWeeks} of 52 increments filled.`});
const tooltip = document.createElement('span');
tooltip.className = 'ring-tooltip';
tooltip.setAttribute('aria-hidden','true');
tooltip.hidden = true;
let hoveredYear = null;
function describe(year){return `Year ${year}`;}
function showTooltip(year, x, y) {
 tooltip.textContent = describe(year);
 tooltip.hidden = false;
 const bounds = tooltip.getBoundingClientRect();
 tooltip.style.left = `${Math.max(8,Math.min(window.innerWidth-bounds.width-8,x+10))}px`;
 tooltip.style.top = `${Math.max(8,Math.min(window.innerHeight-bounds.height-8,y+12))}px`;
}
function hideTooltip(){tooltip.hidden=true;}
for(let year=1;year<=YEARS;year++){
 const radius=ringRadius(year);
 const group=svgElement('g',{'data-year':year,role:'button',tabindex:year===(focusedYear ? Number(focusedYear) : Math.min(YEARS, age+1))?'0':'-1','aria-label':describe(year),'aria-pressed':String(year===selected)});
 const futureOpacity=Math.max(.14,.38-(year-age-1)/Math.max(1,YEARS-age-1)*.24);
 // Every completed year has the same weight; only future years fade outward.
 const guideOpacity = year<=age ? 1 : futureOpacity;
 const ringStyle={cx:200,cy:200,r:radius,fill:'none',stroke:'#000','stroke-width':.45,'pointer-events':'none'};
 group.append(svgElement('circle',{...ringStyle,opacity:guideOpacity,class:'ring-track'}));
 if(year===age+1 && completeWeeks>0){
  // A single continuous arc advances by 1/52 of the circumference per completed increment.
  group.append(svgElement('circle',{...ringStyle,pathLength:WEEKS,'stroke-dasharray':`${completeWeeks} ${WEEKS-completeWeeks}`,'stroke-linecap':'butt',transform:'rotate(-90 200 200)',class:'ring-progress'}));
 }
 // Hit areas meet halfway between neighboring rings.
 const inner=year===1 ? radius-1.225 : (ringRadius(year-1)+radius)/2;
 const outer=year===YEARS ? radius+1.225 : (radius+ringRadius(year+1))/2;
 group.append(svgElement('circle',{cx:200,cy:200,r:(inner+outer)/2,fill:'none',stroke:'transparent','stroke-width':outer-inner,'pointer-events':'stroke',class:'ring-hit'}));
 group.append(svgElement('circle',{cx:200,cy:200,r:radius,fill:'none',stroke:'transparent','stroke-width':1.2,'pointer-events':'none',class:'ring-target'}));
 function hover(event){hoveredYear=year;showTooltip(year,event.clientX,event.clientY);}
 group.addEventListener('pointerenter',hover);
 group.addEventListener('pointermove',hover);
 group.addEventListener('pointerleave',()=>{if(hoveredYear===year){hoveredYear=null;hideTooltip();}});
 group.addEventListener('focus',()=>{
  if(!group.matches(':focus-visible'))return;
  const bounds=group.getBoundingClientRect();
  showTooltip(year,bounds.right,bounds.top+bounds.height/2);
 });
 group.addEventListener('blur',()=>{if(hoveredYear===null)hideTooltip();});
 function select(){selected=selected===year?null:year;svg.querySelectorAll('[data-year]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.year)===selected)));}
 group.addEventListener('click',select);
 group.addEventListener('keydown',event=>{
  if(['Enter',' '].includes(event.key)){event.preventDefault();select();}
  const offsets={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};
  let target;
  if(event.key in offsets)target=Math.max(1,Math.min(YEARS,year+offsets[event.key]));
  if(event.key==='Home')target=1;if(event.key==='End')target=YEARS;
  if(target){event.preventDefault();group.setAttribute('tabindex','-1');const next=svg.querySelector(`[data-year="${target}"]`);next.setAttribute('tabindex','0');next.focus();}
  if(event.key==='Escape'){clear();hideTooltip();}
 });
 svg.append(group);
}
function clear(){selected=null;svg.querySelectorAll('[data-year]').forEach(el=>el.setAttribute('aria-pressed','false'));}
grid.replaceChildren(svg,tooltip);
renderedDay = today;
if (focusedYear) svg.querySelector(`[data-year="${focusedYear}"]`)?.focus({preventScroll:true});
}

updateDiagram();
// Timers can pause in sleeping/background tabs; recheck when the visitor returns.
setInterval(updateDiagram, 60_000);
document.addEventListener('visibilitychange', () => {
 if (document.visibilityState === 'visible') updateDiagram();
});
window.addEventListener('focus', updateDiagram);
window.addEventListener('pageshow', updateDiagram);

// Keep the diagram container and footer aligned with the poem after resizing.
const poemText = document.querySelector('blockquote');
const sidebar = document.querySelector('.sidebar');
function matchPoemWidth() {
 sidebar.style.setProperty('--poem-width', `${poemText.getBoundingClientRect().width}px`);
}
matchPoemWidth();
new ResizeObserver(matchPoemWidth).observe(poemText);

// Soften crowded rings at small sizes while keeping their hit areas sharp.
function smoothSmallRings() {
 const width = grid.getBoundingClientRect().width;
 if (!width) return;
 // Include zooming out on low-density screens and pinch zooming on phones.
 const zoom = Math.min(1, window.devicePixelRatio || 1) * (window.visualViewport?.scale || 1);
 const displayedWidth = width * zoom;
 const blur = Math.max(0, Math.min(.6, (190 - displayedWidth) / 140));
 grid.style.setProperty('--ring-smoothing', blur ? `blur(${blur * 377 / displayedWidth}px)` : 'none');
}
smoothSmallRings();
new ResizeObserver(smoothSmallRings).observe(grid);
window.addEventListener('resize', smoothSmallRings);
window.visualViewport?.addEventListener('resize', smoothSmallRings);
