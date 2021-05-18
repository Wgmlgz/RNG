let frame_counter = 1

let screenLog = document.querySelector('#screen-log');

let zoom = 1

import { btnDown, btnUp, dragTree, mouseEnter, mouseLeft  } from './InputHandler.js'
import { addBlockAndAnim, allLineAndAnim, clearTree, setAnimProgress} from './TreeConstructor.js'

var last_frame = 0
var anim_progress = 1

var anim = true
var anim_forward = true

setInterval(function () {
  zoom = document.getElementById("zoom_slider").value;
  var tree = document.getElementById('tree_ded').style;
  tree.zoom = zoom;

  // timeline
  var timeline_progress = document.getElementById('timeline_slider').value;
  var lateset_size = document.getElementById('timeline_latest_slider').value;
  
  var tmp = timeline_progress * (_EXPORT_getStackSize())
  
  var latest_frames = Math.ceil(_EXPORT_getStackSize() * (1 - lateset_size))
  if (_EXPORT_getStackSize() > latest_frames) {
    tmp = timeline_progress * latest_frames + _EXPORT_getStackSize() - latest_frames
  }
  if (anim) {
    tmp += 0.03
    var new_timeline_progress = tmp / _EXPORT_getStackSize();
    if (_EXPORT_getStackSize() > latest_frames) { 
      var new_timeline_progress = timeline_progress * latest_frames + _EXPORT_getStackSize() - latest_frames
      if (_EXPORT_getStackSize() > latest_frames) {
        new_timeline_progress = (tmp + latest_frames - _EXPORT_getStackSize()) / latest_frames
      }
    }
    if (new_timeline_progress > 0.999) {
      new_timeline_progress = 0.999
    }
    document.getElementById('timeline_slider').value = new_timeline_progress
    
  }

  var current_frame = Math.floor(tmp);
  if (current_frame != last_frame) {
    if (_EXPORT_getStackSize() > 0) {
      drawTreeFrame(tmp, current_frame);
    }
    last_frame = current_frame;
  }
  setAnimProgress(tmp, current_frame);

  document.getElementById('frame_counter').innerHTML = current_frame
  document.getElementById('frame_progress').innerHTML = Math.round((tmp - current_frame) * 100) / 100
}, 8);

document.addEventListener('mousemove', dragTree);
document.addEventListener('mousedown', btnDown);
document.addEventListener('mouseup', btnUp);

document.getElementById("tree_fill").addEventListener("mouseenter", mouseEnter)
document.getElementById("tree_fill").addEventListener("mouseleave", mouseLeft)
document.querySelector('#bnt_clear').addEventListener('click', clearTree)
// document.querySelector('#bnt_prev').addEventListener('click', prevFrame)
// document.querySelector('#bnt_next').addEventListener('click', nextFrame)

document.querySelector('#btn_insert').addEventListener('click', insertElement)
document.querySelector('#btn_insert_random').addEventListener('click', insertRandomElement)


document.querySelector('#btn_select_binTree').addEventListener('click', selectBin)
document.querySelector('#btn_select_AVLTree').addEventListener('click', selectAVL)
document.querySelector('#btn_select_RBTree').addEventListener('click', selectRB)
document.querySelector('#btn_select_Treap').addEventListener('click', selectTreap)
document.querySelector('#btn_select_SplayTree').addEventListener('click', selectSplay)
$(window).off('scroll');
var input = document.getElementById("input_insert");

input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.getElementById("btn_insert").click();
  }
});
// $(document).ready(function(){
//   $('#playlist').on('scroll',function(){
//     console.log('Scrolling...');
//   });
// });

function selectBin() {
  _EXPORT_selectTree(0);
  drawLastTree();
}
function selectAVL() {
  _EXPORT_selectTree(1);
  drawLastTree();
}
function selectRB() {
  _EXPORT_selectTree(2);
  drawLastTree();
}
function selectTreap() {
  _EXPORT_selectTree(3);
  drawLastTree();
}
function selectSplay() {
  _EXPORT_selectTree(4);
  drawLastTree();
}
// КОСТЫЛЬ!!!!
function readStr() {
  let buff = "";

  let rres = _EXPORT_readChar();
    if (rres == 0) return buff;
  buff += String.fromCharCode(rres);

  while (true) {
    rres = _EXPORT_readChar();
    if (rres == 0) return buff;
    buff += String.fromCharCode(rres);
  }
}

function insert(val) {
  clearTree()
  _EXPORT_insert(val)
  drawLastTree()
}
function insertElement() {
  insert(document.getElementById('input_insert').value)
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function insertRandomElement() {
  insert(getRandomInt(1, 100))
}
function drawTreeFrame(progress, n) {
  setAnimProgress(progress, n)
  clearTree()
  _EXPORT_getState(n)
  var str = readStr()
  drawJsonTreeStr(str)
  _EXPORT_getLines(n)
  str = readStr()
  drawJsonLinesStr(str)
}
function drawLastTree() {
  drawTreeFrame(-1)
}

function drawJsonTreeStr(json_string) {
  if (json_string == "") return 
  var data = JSON.parse(json_string);
  for (const property in data) {
    addBlockAndAnim(
      property,
      data[property].c,
      data[property].x,
      data[property].y,
      data[property].X,
      data[property].Y,
      data[property].clr
    )
  }
}

function drawJsonLinesStr(json_string) {
  if (json_string == "") return 
  var data = JSON.parse(json_string);
  for (const property in data) {
    allLineAndAnim(data[property].a, data[property].b, property)
  }
}
// main
function drawJsonTree(json_string) {
  console.log(json_string);
  json_string.json().then(data => {
    for (const property in data) {
      addBlockAndAnim(
        property,
        data[property].c,
        data[property].x,
        data[property].y,
        data[property].X,
        data[property].Y,
        data[property].clr
      )
    }
  })
}

function drawJsonLines(json_string) {
  json_string.json().then(data => {
    for (const property in data) {
      allLineAndAnim(data[property].a, data[property].b, property)
    }
  })
}
// function drawTree(num) {me
//   clearTree()
//   fetch('tree_frame_' + num + '.json').then(response => drawJsonTree(response))

//   fetch('lines_frame_' + num + '.json').then(response => drawJsonLines(response))
// }

// function test() {
//   _EXPORT_createTestTree(20)
//   _EXPORT_outputTestTree()
// }

// function prevFrame() {
//   setAnimForward(false)
//   if (current_frame < 0) current_frame = 0
//   drawTree(current_frame)
//   current_frame -= 1
// }

// function nextFrame() {
//   current_frame += 1
//   setAnimForward(true)
//   drawTree(current_frame)
// }


drawJsonTreeStr('{"1.000000":{"c":"DA","clr":"#000000","x":0,"y":0,"X":0,"Y":0}}')
