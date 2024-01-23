import { start, setConcurrent } from './WorkLoop';
import { init } from './Tree';

document.getElementById('concurrent').addEventListener('click', function () {
  setConcurrent(true);
});

document.getElementById('sync').addEventListener('click', function () {
  setConcurrent(false);
});

document.getElementById('start').addEventListener('click', function () {
  start();
});

init();