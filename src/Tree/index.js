import { select, zoom, tree, hierarchy } from 'd3';
import Tree from '../Fiber/data';

const width = 1400;
const height = 800;

const d3tree = tree()
  .nodeSize([90, 90])
  .separation((a, b) => {
    return a.parent === b.parent ? 1 : 2;
  });
const root = hierarchy(Tree);
export const treeLayout = d3tree(root);

let r = 20;
let prevSibling = null;
let lastChild = null;
let svg, gNode, gLink;

export function init() {
  svg = select('#container')
    .append('svg')
    .classed('chart', true)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `${ -(width / 2) } ${ -(height / 2) } ${ width } ${ height }`);
  
  gNode = svg.append('g')
    .attr('id', 'circles');
  
  gLink = svg.append('g')
    .attr('id', 'links');
  
  svg.call(
    zoom().on('zoom', ev => {
      gNode.attr('transform', ev.transform);
      gLink.attr('transform', ev.transform);
    })
  );
  
  select('#container > svg')
    .append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('refX', 0)
    .attr('refY', 5)
    .attr('markerWidth', 100)
    .attr('markerHeight', 100)
    .attr('orient', 'auto') // 这个属性设置后可以根据线条方向进行旋转
    .append('path')
    .attr('d', 'M5,0 L5,10 L0,5 Z')
    .attr('fill', 'black');
}

export function paintCircle(workInProgress) {
  const { x, y, name } = workInProgress;
  gNode.append('g')
    .attr('id', name)
    .attr('transform', `translate(${ x }, ${ y })`)
    .append('circle')
    .attr('stroke', 'black')
    .attr('stroke-width', '2')
    .style('fill', '#ffffff')
    .attr('r', r);
  gNode.select(`#${ name }`)
    .append('text')
    .text(name);
  paintBeginLink(workInProgress);
}

function paintBeginLink(workInProgress) {
  if (!workInProgress.return) {
    return;
  }
  
  let prevX, prevY, prevName;
  const { x, y, name } = workInProgress;
  
  if (prevSibling) {
    prevX = prevSibling.x;
    prevY = prevSibling.y;
    prevName = prevSibling.name;
    
    appendPath(
      `${ prevName }To${ name }`,
      `M ${ x - r } ${ y } L ${ prevX + r } ${ prevY }`
    )
    
    if (!workInProgress.sibling) {
      setPrevSibling(null);
    }
    
    return;
  }
  
  prevX = workInProgress.return.x;
  prevY = workInProgress.return.y;
  prevName = workInProgress.return.name;
  const dx = prevX - x;
  const dy = y - prevY;
  
  if (dx < 0 || (dx === 0 && workInProgress.sibling)) return;
  
  const dAngle = Math.atan(dy / Math.abs(dx)) * 180 / Math.PI;
  const dxx = Math.cos(dAngle / 180 * Math.PI) * r;
  const dyy = Math.sin(dAngle / 180 * Math.PI) * r;
  
  appendPath(
    `${ prevName }To${ name }`,
    `M ${ x + dxx } ${ y - dyy } L ${ prevX - dxx } ${ prevY + dyy }`
  )
}

export function paintCompleteLink(workInProgress) {
  const { x, y, name } = workInProgress;
  if (!workInProgress.child) {
    const dz = Math.sqrt(r ** 2 - (r / 2) ** 2);
    appendPath(
      `${ name }Complete`,
      `M ${ x + (r / 2) } ${ y + dz } C ${ x + (2.5 * r) } ${ y + (2 * r) + dz } ${ x - (2.5 * r) } ${ y + (2 * r) + dz } ${ x - (r / 2) } ${ y + dz }`
    )
  }
  if (lastChild) {
    const lastChildX = lastChild.x;
    const lastChildY = lastChild.y;
    const lastChildName = lastChild.name;
    
    const a = gLink.select(`#${ name }To${ lastChildName }`);
    
    const dx = x - lastChildX;
    const dy = lastChildY - y;
    const dAngle = Math.atan(dy / Math.abs(dx)) * 180 / Math.PI;
    
    if (!a.empty()) {
      a.remove();
      const dAngle1 = dAngle - 10;
      const dx1 = Math.cos(dAngle1 / 180 * Math.PI) * r;
      const dy1 = Math.sin(dAngle1 / 180 * Math.PI) * r;
      const dAngle2 = 90 - dAngle - 10;
      const dx2 = Math.sin(dAngle2 / 180 * Math.PI) * r;
      const dy2 = Math.cos(dAngle2 / 180 * Math.PI) * r;
      
      appendPath(
        `${ name }To${ lastChildName }`,
        `M ${ lastChildX - dx1 } ${ lastChildY - dy1 } L ${ x + dx2 } ${ y + dy2 }`
      )
      
      appendPath(
        `${ name }Complete`,
        `M ${ x - dx2 } ${ y + dy2 } L ${ lastChildX + dx1 } ${ lastChildY - dy1 }`
      )
      
      return;
    }
    
    const dxx = Math.cos(dAngle / 180 * Math.PI) * r;
    const dyy = Math.sin(dAngle / 180 * Math.PI) * r;
    
    appendPath(
      `${ name }Complete`,
      `M ${ x + dxx } ${ y + dyy } L ${ lastChildX - dxx } ${ lastChildY - dyy }`
    )
  }
}

function appendPath(id, path) {
  gLink.append('path')
    .attr('id', id)
    .attr('fill', 'none')
    .attr('stroke', '#313131')
    .attr('d', _ => {
      return path;
    })
    .attr('marker-start', 'url(#arrowhead)');
}

export function setPrevSibling(fiber) {
  prevSibling = fiber;
}

export function setLastChild(fiber) {
  lastChild = fiber;
}
