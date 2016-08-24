// Issue:
// * 浮動小数点の精度問題
//   * fn()中のb^n*pi*xで精度が落ちる
//   * cx, cyの精度

'use strict';

let conf = {width: 800, height: 600, samples: 1000, a: .5, b: 3};

let curr = {};

let range = n=>[...Array(n).keys()];

let fn = (x, n) => Math.pow(conf.a,n)*Math.cos(Math.pow(conf.b,n)*Math.PI*x);
let fN = (x, N) => range(N+1).map(n=>fn(x,n)).reduce((a,b)=>a+b);

let draw = (cx, cy, width, height) => {
  curr.cx = cx;
  curr.cy = cy;
  curr.width = width;
  curr.height = height;

  let graph = document.getElementById('graph');
  graph.setAttribute('viewBox', `0 0 ${conf.width} ${conf.height}`);
  graph.style.width = `${conf.width}px`;
  graph.style.height = `${conf.height}px`;



  // n=0..10と1周期が窓の100倍程度(b^n*pi*width*100=2pi)から
  // conf.samplesで定義される解像度程度(b^n*pi*width/samples=2pi)までのnで近似
  let imin = Math.floor(Math.log(2/(width*100))/Math.log(conf.b)),
      imax = Math.ceil(Math.log(2/(width/conf.samples))/Math.log(conf.b));

  console.log(`${cx},${cy}; ${width}x${height}; n=0..10,${imin}..${imax}`);

  document.getElementById('curve').setAttribute(
    'd',
    range(conf.samples+1).map(gx => {
      let ax = ((gx - (conf.samples/2)) / (conf.samples/2)) * (width/2) + cx,
          ay = fN(ax, 10),
          rx = (ax - (cx -  width/2)) / width  * conf.width,
          ry = (ay - (cy - height/2)) / height * conf.height;

      if (imax > 10) {
        for(let i = Math.max(imin, 11); i < imax; i++) {
          ry += fn(ax, i) / height * conf.height;
        }
      }

      return (gx ? 'L' : 'M') + `${rx},${conf.height-ry}`;
    }).join(' ')
  );
};

draw(0, 0, 4, 4);


let calcpos = (x, y) => [(x -  conf.width/2)/( conf.width/2),
                         (y - conf.height/2)/(conf.height/2)*(-1)];

document.getElementById('graph').addEventListener('wheel', ev => {
  let [mx, my] = calcpos(ev.clientX, ev.clientY),
      scale = ev.deltaY < 0 ? .5 : 2,
      w = scale * curr.width,
      h = scale * curr.height,
      cx = mx * (curr.width  / 2) + curr.cx - mx*(w/2),
      cy = my * (curr.height / 2) + curr.cy - my*(w/2);

  draw(cx, cy, w, h);
});


let dragging;

document.getElementById('graph').addEventListener('mousedown', ev => {
  dragging = [[ev.clientX, ev.clientY], [curr.cx, curr.cy]];
  ev.preventDefault();
});

document.getElementById('graph').addEventListener('mouseup', ev => {
  dragging = null;
});

document.getElementById('graph').addEventListener('mousemove', ev => {
  if (dragging) {
    let [[mx, my], [cx, cy]] = dragging,
        ox = (mx - ev.clientX) *  curr.width /  conf.width,
        oy = (my - ev.clientY) * curr.height / conf.height;
    draw(cx + ox, cy - oy, curr.width, curr.height);
  }
});
