'use strict';

let conf = {width: 800, height: 600, samples: 1000, a: .5, b: 3};

let curr = {};

let fN = (x, N) => [...Array(N+1).keys()]
      .map(n=>Math.pow(conf.a,n)*Math.cos(Math.pow(conf.b,n)*Math.PI*x))
      .reduce((a,b)=>a+b);

let draw = (cx, cy, width, height) => {
  let N = Math.min(Math.max(Math.floor(100/width), 100), 500);
  console.log(`${cx},${cy}; ${width}x${height}; N=${N}`);

  curr.cx = cx;
  curr.cy = cy;
  curr.width = width;
  curr.height = height;

  let graph = document.getElementById('graph');
  graph.setAttribute('viewBox', `0 0 ${conf.width} ${conf.height}`);
  graph.style.width = `${conf.width}px`;
  graph.style.height = `${conf.height}px`;

  let pts = [];
  for(let gx of Array(conf.samples+1).keys()) {
    let ax = ((gx - (conf.samples/2)) / (conf.samples/2)) * (width/2) + cx,
        ay = fN(ax, N),
        rx = (ax - (cx -  width/2)) / width  * conf.width,
        ry = (ay - (cy - height/2)) / height * conf.height;
    pts.push((pts.length ? 'L' : 'M') + `${rx},${conf.height-ry}`);
  }

  document.getElementById('curve').setAttribute('d', pts.join(' '));
};

draw(0, 0, 4, 4);

document.getElementById('graph').addEventListener('wheel', ev => {
  let rect = ev.target.getBoundingClientRect(),
      mx =  (ev.clientX -  rect.width/2)/( rect.width/2),
      my = -(ev.clientY - rect.height/2)/(rect.height/2),
      scale = ev.deltaY < 0 ? .5 : 2,
      w = scale * curr.width,
      h = scale * curr.height,
      cx = mx * (curr.width  / 2) + curr.cx - mx*(w/2),
      cy = my * (curr.height / 2) + curr.cy - my*(w/2);

  draw(cx, cy, w, h);
});
