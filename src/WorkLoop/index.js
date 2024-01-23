import FiberTree from '../Fiber';
import {
  paintCircle,
  paintCompleteLink, reset, setLastChild, setPrevSibling,
} from '../Tree';

let workInProgress = FiberTree;
let frameInterval = 1;
let startTime = -1;
let scheduledHostCallback;
let schedulePerformWorkUntilDeadline;
let currentTask = null;
let getCurrentTime = () => performance.now();

function renderRootConcurrent() {
  do {
    try {
      workLoopConcurrent();
      break;
    } catch (error) {
      console.log(error);
    }
  } while (true);
  
  if (workInProgress !== null) {
    return 0;
  }
  
  return null;
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
  
  console.log('break');
}

function renderRootSync() {
  do {
    try {
      workLoopSync();
      break;
    } catch (error) {
      console.log(error);
    }
  } while (true);
  
  // 重置
  workInProgress = FiberTree;
  
  return null;
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  let next = beginWork(unitOfWork);
  
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const returnFiber = completedWork.return;
    let next = completeWork(completedWork);
    
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      setPrevSibling(completedWork);
      setLastChild(null);
      
      workInProgress = siblingFiber;
      return;
    }
    
    setPrevSibling(null);
    setLastChild(completedWork);
    
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
}

function beginWork(workInProgress) {
  console.log('Begin work: ', workInProgress.name);
  
  paintCircle(workInProgress);
  
  if (workInProgress.child !== null) {
    return workInProgress.child;
  }
  
  return null;
}

function completeWork(workInProgress) {
  console.log('Complete work: ', workInProgress.name);
  
  paintCompleteLink(workInProgress);
  
  return null;
}

function shouldYield() {
  const timeElapsed = getCurrentTime() - startTime;
  
  if (timeElapsed < frameInterval) {
    return false;
  }
  
  return true;
}

function performConcurrentWorkOnRoot(root) {
  const originalCallbackNode = root.callbackNode;
  
  const shouldTimeSlice = startSyncOrConcurrent();
  let exitStatus = shouldTimeSlice ? renderRootConcurrent() : renderRootSync();
  
  if (exitStatus !== 0) {
    root.callbackNode = null;
  }
  
  if (root.callbackNode === originalCallbackNode) {
    return performConcurrentWorkOnRoot.bind(null, root);
  }
  
  return null;
}

const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    startTime = currentTime;
    const hasTimeRemaining = true;
    let hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline();
      } else {
        scheduledHostCallback = null;
      }
    }
  }
};

if (typeof MessageChannel !== 'undefined') {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
}

function ensureRootIsScheduled(root) {
  const newCallbackNode = scheduleCallback(
    performConcurrentWorkOnRoot.bind(null, root),
  );
  
  root.callbackNode = newCallbackNode;
}

function scheduleCallback(callback) {
  return Scheduler_scheduleCallback(callback);
}

function Scheduler_scheduleCallback(callback) {
  let currentTime = getCurrentTime();
  startTime = currentTime;
  
  currentTask = callback;
  requestHostCallback(flushWork);
  
  return currentTask;
}

function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  schedulePerformWorkUntilDeadline();
}

function flushWork() {
  try {
    return workLoop();
  } finally {
  
  }
}

function workLoop() {
  const callback = currentTask;
  
  if (typeof callback === 'function') {
    const continuationCallback = callback();
    currentTask = continuationCallback;
  }
  
  if (currentTask !== null) {
    return true;
  }
}


let isConcurrent = true;
const startSyncOrConcurrent = () => {
  return isConcurrent;
};

export const setConcurrent = (bool) => {
  isConcurrent = bool;
};

export const start = () => {
  reset();
  ensureRootIsScheduled(FiberTree);
  workInProgress = FiberTree;
};