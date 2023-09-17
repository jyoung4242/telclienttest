import { Vector } from "../../_SqueletoECS/Vector";

export type ParallaxLayerData = {
  image: HTMLImageElement;
  speed: Vector;
  size: Vector;
  position: Vector;
  tiles?: Array<tileType>;
};

export type tileType = {
  src: string;
  position: Vector;
  size: Vector;
};

export type ParallaxComponentConfig = {
  viewPortSize: Vector;
  layerData: Array<ParallaxLayerData>;
};

export class ParallaxSystem {
  layers: Array<ParallaxLayerData> = [];
  viewportSize: Vector;

  public template = `
    <style>
      parallax-component {
        position: absolute;
        z-index: -1;
      }
      parallax-layer{
        display: block;
        position: absolute;
         }
      parallax-rel{
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
      }
      parallax-tile{
        padding: 0;
        margin: 0;
        border: none;
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        transition: left 0.1;
        top: 0px;
        left: 0px;
      }
    </style>
    <parallax-component >
      <parallax-layer \${layer<=*layers} style="width: \${layer.size.x}px;height: \${layer.size.y}px;" >
        <parallax-rel>
          <parallax-tile \${tile<=*layer.tiles}  style="transform: translate3d(\${tile.position.x}px, \${tile.position.y}px, 0px); background-image: url(\${tile.src});background-size: \${tile.size.x}px \${tile.size.y}px">
          </parallax-tile>
        </parallax-rel> 
      </parallax-layer>
    </parallax-component>
    `;

  constructor(config: ParallaxComponentConfig) {
    //set up defaults
    this.viewportSize = config.viewPortSize;
    this.layers = [...config.layerData];
    this.layers.forEach(lyr => {
      lyr.tiles = [
        { src: lyr.image.src, size: new Vector(lyr.size.x, lyr.size.y), position: new Vector(0, 0) },
        { src: lyr.image.src, size: new Vector(lyr.size.x, lyr.size.y), position: new Vector(0, 0) },
        { src: lyr.image.src, size: new Vector(lyr.size.x, lyr.size.y), position: new Vector(0, 0) },
      ];
      lyr.tiles![0].position = new Vector(-lyr.size.x * 2, 0);
      lyr.tiles![1].position = new Vector(-lyr.size.x, 0);
      lyr.tiles![2].position = new Vector(0, 0);
    });

    console.log(this.layers);
  }

  static create(viewPortSize: Vector, layers: Array<ParallaxLayerData>) {
    const config: ParallaxComponentConfig = {
      viewPortSize,
      layerData: [...layers],
    };

    return new ParallaxSystem(config);
  }

  update(deltaTime: number) {
    this.layers.forEach(lyr => {
      lyr.tiles?.forEach(tile => {
        tile.position = tile.position.add(lyr.speed);
      });
    });
  }
}
