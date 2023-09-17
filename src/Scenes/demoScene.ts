// Library
import { Scene } from "../../_SqueletoECS/Scene";
import { Vector } from "../../_SqueletoECS/Vector";
import { Engine } from "@peasy-lib/peasy-engine";
import { Assets } from "@peasy-lib/peasy-assets";
import { ParallaxSystem, ParallaxComponentConfig, ParallaxLayerData } from "../Systems/parallax";

import { Camera, ICameraConfig } from "../../_SqueletoECS/Camera"; //this is in Squeleto library

// Entities
import { TemplateEntity } from "../Entities/entityTemplate";

export class Test extends Scene {
  name: string = "test";
  entities: any = [];
  entitySystems: any = [];
  sceneSystems: any = [];
  public template = `
    <scene-layer>
        < \${ sceneSystem === } \${ sceneSystem <=* sceneSystems }
    </scene-layer>
  `;
  public init = async (): Promise<void> => {
    Assets.initialize();
    await Assets.load([
      "../src/Assets/01.png",
      "../src/Assets/02.png",
      "../src/Assets/03.png",
      "../src/Assets/04.png",
      "../src/Assets/05.png",
    ]);
    // add default entities to the array
    this.entities.push(TemplateEntity.create());

    //establish Scene Systems - Configuring Camera
    let cConfig: ICameraConfig = {
      name: "camera",
      viewPortSystems: [],
      gameEntities: this.entities,
      position: new Vector(0, 0),
      size: new Vector(400, 266.67),
    };
    let camera = Camera.create(cConfig);

    const layer1: HTMLImageElement = new Image(800, 480);
    layer1.src = Assets.image("01").src;
    const layer2: HTMLImageElement = new Image(800, 480);
    layer2.src = Assets.image("02").src;
    const layer3: HTMLImageElement = new Image(800, 480);
    layer3.src = Assets.image("03").src;
    const layer4: HTMLImageElement = new Image(800, 480);
    layer4.src = Assets.image("04").src;
    const layer5: HTMLImageElement = new Image(800, 480);
    layer5.src = Assets.image("05").src;

    const pconfig: Array<ParallaxLayerData> = [
      {
        image: layer1,
        size: new Vector(400, 266),
        speed: new Vector(0.025, 0),
        position: new Vector(0, 0),
      },
      {
        image: layer2,
        size: new Vector(400, 266),
        speed: new Vector(0.075, 0),
        position: new Vector(0, 0),
      },
      {
        image: layer3,
        size: new Vector(400, 266),
        speed: new Vector(0.1, 0),
        position: new Vector(0, 0),
      },
      {
        image: layer4,
        size: new Vector(400, 266),
        speed: new Vector(0.2, 0),
        position: new Vector(0, 0),
      },
      {
        image: layer5,
        size: new Vector(400, 266),
        speed: new Vector(0.4, 0),
        position: new Vector(0, 0),
      },
    ];
    camera.vpSystems.push(ParallaxSystem.create(new Vector(400, 266), pconfig));

    //Systems being added for Scene to own
    this.sceneSystems.push(camera);

    //Start GameLoop
    Engine.create({ fps: 60, started: true, callback: this.update });
  };

  //GameLoop update method
  update = (deltaTime: number): void | Promise<void> => {
    this.sceneSystems.forEach((system: any) => {
      system.update(deltaTime / 1000, 0, this.entities);
    });
  };
}
