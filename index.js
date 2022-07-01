import G6 from '@antv/g6';

G6.registerNode('card-node', {
  anchorPoints: [0.5, 1],
  getAnchorPoints(cfg) {
    return [0.5, 1];
  },
  draw: function drawShape(cfg, group) {
    const r = 2;
    const color = '#5B8FF9';
    const w = cfg.size[0];
    const h = cfg.size[1];
    const shape = group.addShape('rect', {
      attrs: {
        x: -w / 2,
        y: -h / 2,
        width: w, //200,
        height: h, // 60
        stroke: color,
        radius: r,
        fill: '#fff',
      },
      name: 'main-box',
      draggable: true,
    });

    group.addShape('rect', {
      attrs: {
        x: -w / 2,
        y: -h / 2,
        width: w, //200,
        height: h / 2, // 60
        fill: color,
        radius: [r, r, 0, 0],
      },
      name: 'title-box',
      draggable: true,
    });

    // title text
    group.addShape('text', {
      attrs: {
        textBaseline: 'top',
        x: -w / 2 + 8,
        y: -h / 2 + 2,
        lineHeight: 20,
        text: cfg.id,
        fill: '#fff',
      },
      name: 'title',
    });

    group.addShape('text', {
      attrs: {
        textBaseline: 'top',
        x: -w / 2 + 8,
        y: -h / 2 + 24,
        lineHeight: 20,
        text: 'description',
        fill: 'rgba(0,0,0, 1)',
      },
      name: `description`,
    });
    return shape;
  },
  setState(name, value, item) {
    if (name === 'collapsed') {
      const marker = item
        .get('group')
        .find((ele) => ele.get('name') === 'collapse-icon');
      const icon = value ? G6.Marker.expand : G6.Marker.collapse;
      marker.attr('symbol', icon);
    }
  },
});

const data = {
  id: 'A',
  children: [
    {
      id: 'A1',
      children: [{ id: 'A11' }, { id: 'A12' }, { id: 'A13' }, { id: 'A14' }],
    },
    {
      id: 'A2',
      children: [
        {
          id: 'A21',
          children: [{ id: 'A211' }, { id: 'A212' }],
        },
        {
          id: 'A22',
        },
      ],
    },
  ],
};

const container = document.getElementById('container');
const width = container.scrollWidth;
const height = container.scrollHeight || 500;

const graph = new G6.TreeGraph({
  container: 'container',
  width,
  height,
  modes: {
    default: ['drag-canvas'],
  },
  defaultNode: {
    type: 'card-node',
    size: [100, 40],
  },
  defaultEdge: {
    type: 'line',
    style: {
      // endArrow: true,
      // startArrow: true,
    },
  },
  animate: false,
  layout: {
    direction: 'TB',
    dropCap: false,
    nodeSep: 150,
    rankSep: 100,
    indent: 200,
    getHeight: () => {
      return 10000;
    },
  },
});

graph.data(data);
graph.render();
graph.fitView();
graph.on('node:click', (e) => {
  if (e.target.get('name') === 'collapse-icon') {
    e.item.getModel().collapsed = !e.item.getModel().collapsed;
    graph.setItemState(e.item, 'collapsed', e.item.getModel().collapsed);
    graph.layout();
  }
});

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };
