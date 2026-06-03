import React from 'react';
import { BoxGeometry, MeshBasicMaterial, Mesh, BoxHelper, CanvasTexture, SpriteMaterial, Sprite } from 'three';
import { ReactPlannerSharedStyle } from 'react-planner';

export default {
  name: 'cube',
  prototype: 'items',

  info: {
    title: 'Electric Board',
    tag: ['electrical'],
    description: 'Smart Electric Board',
    image: require('./cube.png')
  },

  properties: {
    color: {
      label: 'Color',
      type: 'color',
      defaultValue: '#ff0000' // Red color wires/boards ke liye
    },
    width: {
      label: 'Width',
      type: 'length-measure',
      defaultValue: { length: 20, unit: 'cm' }
    },
    height: {
      label: 'Height',
      type: 'length-measure',
      defaultValue: { length: 20, unit: 'cm' }
    },
    depth: {
      label: 'Depth (Thickness)',
      type: 'length-measure',
      defaultValue: { length: 2, unit: 'cm' } // Plaster ke andar ki gehrai
    },
    altitude: {
      label: 'Floor se Unchai (Altitude)',
      type: 'length-measure',
      defaultValue: { length: 100, unit: 'cm' } // Default lagbhag 3 feet
    }
  },

  render2D: (element, layer, scene) => {
    let style = {
      stroke: !element.selected ? ReactPlannerSharedStyle.LINE_MESH_COLOR.unselected : ReactPlannerSharedStyle.MESH_SELECTED,
      strokeWidth: 2,
      fill: element.properties.get('color')
    };

    let w = element.properties.getIn(['width', 'length']);
    let d = element.properties.getIn(['depth', 'length']);
    let w2 = w / 2;
    let d2 = d / 2;

    return (
      <g transform={`translate(-${w2}, -${d2})`}>
        <rect x="0" y="0" width={w} height={d} style={style} />
      </g>
    );
  },

  render3D: (element, layer, scene) => {
    let w = element.properties.getIn(['width', 'length']);
    let h = element.properties.getIn(['height', 'length']);
    let d = element.properties.getIn(['depth', 'length']);
    
    // Altitude check (Zameen se kitna upar uthana hai)
    let altitude = element.properties.has('altitude') ? element.properties.getIn(['altitude', 'length']) : 0;
    
    let geometry = new BoxGeometry(w, h, d);
    let material = new MeshBasicMaterial({
      color: element.properties.get('color')
    });

    let mesh = new Mesh(geometry, material);

    let box = new BoxHelper(mesh, !element.selected ? ReactPlannerSharedStyle.LINE_MESH_COLOR.unselected : ReactPlannerSharedStyle.MESH_SELECTED );
    box.material.linewidth = 2;
    box.renderOrder = 1000;
    mesh.add(box);

    // 1. Board ki Zameen se unchai (Height) set karna
    mesh.position.y = (h / 2) + altitude;

    // 2. Smart Dimension Label Banana (Sprite Text)
    let canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    let context = canvas.getContext('2d');
    
    // Label ka background aur text design
    context.fillStyle = "rgba(0, 0, 0, 0.7)"; 
    context.fillRect(0, 0, 256, 128);
    context.font = "Bold 36px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    
    // Unchai (Distance) print karna
    context.fillText("Floor: " + altitude + " cm", 128, 70);

    let texture = new CanvasTexture(canvas);
    let spriteMaterial = new SpriteMaterial({ map: texture });
    let textLabel = new Sprite(spriteMaterial);
    
    // Label ka size aur position (Board ke theek upar hawa mein)
    textLabel.scale.set(40, 20, 1);
    textLabel.position.set(0, (h / 2) + 15, 0); 
    
    mesh.add(textLabel);

    return Promise.resolve(mesh);
  }
};
