import { treeLayout } from '../Tree';

function createFiberTree(tree, parentNode) {
  const fiberNode = createFiber(tree);
  fiberNode.x = tree.x;
  fiberNode.y = tree.y;
  if (parentNode) {
    if (parentNode.child === null) {
      parentNode.child = fiberNode;
    }
    fiberNode.return = parentNode;
  }
  if (tree.children && tree.children.length > 0) {
    let sibling = createFiberTree(tree.children[0], fiberNode);
    for (let i = 1; i < tree.children.length; i++) {
      let currentNode = createFiberTree(tree.children[i], fiberNode);
      
      if (sibling) {
        sibling.sibling = currentNode;
        sibling = currentNode;
      }
    }
  }
  
  return fiberNode;
}

function createFiber(node) {
  return new FiberNode(node.name || node.data.name);
}

function FiberNode(name) {
  this.name = name;
  this.child = null;
  this.sibling = null;
  this.return = null;
}

let FiberTree = createFiberTree(treeLayout);

export default FiberTree;