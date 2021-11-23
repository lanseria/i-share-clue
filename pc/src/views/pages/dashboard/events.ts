const events = [
  'click',
  'dblclick',
  'hotspotclick',
  'hotspotover',
  'hotspotout',
  'mousemove',
  'mousewheel',
  'mouseover',
  'mouseout',
  'mouseup',
  'mousedown',
  'rightclick',
  'touchstart',
  'touchmove',
  'touchend',
];

const addEvents = (instance: any, events: string[], hanleEvents: Function) => {
  events.forEach((event) => {
    // 注册事件，并传入通用函数处理方法
    instance.on(event, hanleEvents);
  });
};

export { events, addEvents };
