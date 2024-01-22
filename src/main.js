import { start, setConcurrent } from './WorkLoop';

document.getElementById('concurrent').addEventListener('click', function () {
  setConcurrent(true);
});

document.getElementById('sync').addEventListener('click', function () {
  setConcurrent(false);
});

document.getElementById('start').addEventListener('click', function () {
  start();
});