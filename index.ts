
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}
interface Tile {
    isAir(): boolean;
    isLock1(): boolean;
    isLock2(): boolean;
    canFall(): boolean;
    draw(g: CanvasRenderingContext2D, x: number, y: number): void;
    moveHorizontal(player: Player, dx: number): void;
    moveVertical(player: Player, dy: number): void;
    update(x: number, y: number): void;
    getBlockOnTopState(): FallingState;
}

class Air implements Tile {
    isAir() {return true};
    isLock1() {return false};
    isLock2() {return false};
    canFall() {return false};
    draw(g: CanvasRenderingContext2D, x: number, y: number) { };
    moveHorizontal(player: Player, dx: number) {
        player.move(dx, 0);
    };
    moveVertical(player: Player, dy: number) {
        player.move(0, dy)
    };
    update(x: number, y: number) { };
    getBlockOnTopState() {return new Falling()};
}

class Flux implements Tile {
    isAir() {return false};
    isLock1() {return false};
    isLock2() {return false};
    canFall() {return false};
    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#ccffcc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };
    moveHorizontal(player: Player, dx: number) {
        player.move(dx, 0);
    };
    moveVertical(player: Player, dy: number) {
        player.move(0, dy);
    };
    update(x: number, y: number) { };
    getBlockOnTopState() {return new Resting()};
}

class Unbreakable implements Tile {
    isAir() {return false};
    isLock1() {return false};
    isLock2() {return false};
    canFall() {return false};
    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#999999";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };
    moveHorizontal(player: Player, dx: number) { };
    moveVertical(player: Player, dy: number) { };
    update(x: number, y: number) { };
    getBlockOnTopState() {return new Resting()};
}

class PlayerTile implements Tile {
    isAir() {return false};
    isLock1() {return false};
    isLock2() {return false};
    canFall() {return false};
    draw(g: CanvasRenderingContext2D, x: number, y: number) { };
    moveHorizontal(player: Player, dx: number) { };
    moveVertical(player: Player, dy: number) { };
    update(x: number, y: number) { };
    getBlockOnTopState() {return new Resting()};
}

interface FallingState {
    isFalling(): boolean;
    isResting(): boolean;
    moveHorizontal(player: Player, tile: Tile, dx: number): void;
    drop(tile: Tile, x: number, y: number): void;
}
class Falling implements FallingState {
    isFalling() {return true};
    isResting() {return false};
    moveHorizontal(player: Player, tile: Tile, dx: number) { };
    drop(tile: Tile, x: number, y: number) { 
        map[y + 1][x] = tile;
        map[y][x] = new Air();
    };
}
class Resting implements FallingState {
    isFalling() {return false};
    isResting() {return true};
    moveHorizontal(player: Player, tile: Tile, dx: number) { 
        player.pushHorizontal(player, tile, dx);
    };
    drop(tile: Tile, x: number, y: number) { };
}

class FallStrategy {
    constructor(private falling: FallingState) {
    };
    moveHorizontal(player: Player, tile: Tile, dx: number) {
        this.falling.moveHorizontal(player, tile, dx)
    };
    update(tile: Tile, x: number, y: number) {
        this.falling = map[y + 1][x].getBlockOnTopState();
        this.falling.drop(tile, x, y);
    };
}

class Stone implements Tile {
    private fallStrategy: FallStrategy;
    constructor(falling: FallingState) {
        this.fallStrategy = new FallStrategy(falling);
    }
    isAir() {return false};
    isLock1() {return false};
    isLock2() {return false};
    canFall() {return true};
    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#0000cc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };
    moveHorizontal(player: Player, dx: number) {
        this.fallStrategy.moveHorizontal(player, this, dx);
    };
    moveVertical(player: Player, dy: number) { };
    update(x: number, y: number) {
        this.fallStrategy.update(this, x, y);
    };
    getBlockOnTopState() {return new Resting()};
}

class Box implements Tile {
    private fallStrategy: FallStrategy;
    constructor(falling: FallingState) {
        this.fallStrategy = new FallStrategy(falling);
    }
    isAir() {return false};
    isLock1() {return false};
    isLock2() {return false};
    canFall() {return true};
    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#8b4513";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };
    moveHorizontal(player: Player, dx: number) {
        this.fallStrategy.moveHorizontal(player, this, dx);
    };
    moveVertical(player: Player, dy: number) { };
    update(x: number, y: number) {
        this.fallStrategy.update(this, x, y);
    };
    getBlockOnTopState() {return new Resting()};
}

class KeyConfiguration {
    constructor(
        private color: string,
        private _1: boolean,
        private removeStrategy: RemoveStrategy)
        { };
    removeLock() {remove(this.removeStrategy)};
    setColor(g: CanvasRenderingContext2D) {g.fillStyle = this.color};
    is1() {return this._1};
}

class Key implements Tile {
    constructor(
        private keyConf: KeyConfiguration) 
        { }
    isAir() {return false};
    isLock1() {return false};
    isLock2() {return false};
    canFall() {return false};
    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        this.keyConf.setColor(g);
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };
    moveHorizontal(player: Player, dx: number) {
        this.keyConf.removeLock();
        player.move(dx, 0);
     };
    moveVertical(player: Player, dy: number) {
        this.keyConf.removeLock();
        player.move(0, dy);
    };
    update(x: number, y: number) { };
    getBlockOnTopState() {return new Resting()};
}

class Lock implements Tile {
    constructor(
        private keyConf: KeyConfiguration)
        { };
    isAir() {return false};
    isLock1() {return this.keyConf.is1()};
    isLock2() {return !this.keyConf.is1()};
    canFall() {return false};
    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        this.keyConf.setColor(g);
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };
    moveHorizontal(player: Player, dx: number) { };
    moveVertical(player: Player, dy: number) { };
    update(x: number, y: number) { };
    getBlockOnTopState() {return new Resting()};
}

interface RemoveStrategy {
    check(tile: Tile): boolean;
}

class RemoveLock1 implements RemoveStrategy {
    check(tile: Tile) {
        return tile.isLock1();
    }
}

class RemoveLock2 implements RemoveStrategy {
    check(tile: Tile) {
        return tile.isLock2();
    }
}

class Player {
    private x = 1;
    private y = 1;
    draw(g: CanvasRenderingContext2D) {
        g.fillStyle = "#ff0000";
        g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };
    moveHorizontal(dx: number) { 
        map[this.y][this.x + dx].moveHorizontal(player, dx);
    };
    moveVertical(dy: number) { 
        map[this.y + dy][this.x].moveVertical(player, dy);
    };
    move(dx: number, dy: number) {
        this.moveToTile(this.x + dx, this.y + dy);
    };
    pushHorizontal(player: Player, tile: Tile, dx: number) { 
        if (map[this.y][this.x + dx + dx].isAir()
        && !map[this.y + 1][this.x + dx].isAir()) {
            map[this.y][this.x + dx + dx] = tile;
            this.moveToTile(this.x + dx, this.y);
        }
    };
    private moveToTile(newx: number, newy: number) {
        map[this.y][this.x] = new Air();
        map[newy][newx] = new PlayerTile();
        this.x = newx;
        this.y = newy;
    };
}
let player = new Player();

enum RawInput {
  UP, DOWN, LEFT, RIGHT
}

interface Input {
    isUp(): boolean;
    isDown(): boolean;
    isLeft(): boolean;
    isRight(): boolean;
    handle(player: Player): void;
}

class Up implements Input {
    isUp() {return true};
    isDown() {return false};
    isLeft() {return false};
    isRight() {return false};
    handle(player: Player) {player.moveVertical(-1)};
}

class Down implements Input {
    isUp() {return false};
    isDown() {return true};
    isLeft() {return false};
    isRight() {return false};
    handle(player: Player) {player.moveVertical(1)};
}

class Left implements Input {
    isUp() {return false};
    isDown() {return false};
    isLeft() {return true};
    isRight() {return false};
    handle(player: Player) {player.moveHorizontal(-1)};
}

class Right implements Input {
    isUp() {return false};
    isDown() {return false};
    isLeft() {return false};
    isRight() {return true};
    handle(player: Player) {player.moveHorizontal(1)};
}

let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map: Tile[][];
function assertExhausted(x: never): never {
    throw new Error("Unexpected object: " + x)
}
const YELLOW_KEY = new KeyConfiguration("#ffcc00", true, new RemoveLock1())
function transformTile(tile: RawTile) {
    switch (tile) {
        case RawTile.AIR: return new Air();
        case RawTile.FLUX: return new Flux();
        case RawTile.UNBREAKABLE: return new Unbreakable();
        case RawTile.PLAYER: return new PlayerTile();
        case RawTile.STONE: return new Stone(new Resting());
        case RawTile.FALLING_STONE: return new Stone(new Falling());
        case RawTile.BOX: return new Box(new Resting());
        case RawTile.FALLING_BOX: return new Box(new Falling());
        case RawTile.KEY1: return new Key(YELLOW_KEY);
        case RawTile.LOCK1: return new Lock(YELLOW_KEY);
        case RawTile.KEY2: return new Key(new KeyConfiguration("#00ccff", false, new RemoveLock2()));
        case RawTile.LOCK2: return new Lock(new KeyConfiguration("#00ccff", true, new RemoveLock2()));
        default: assertExhausted(tile);
    }
}

function transformMap() {
    map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
        map[y] = new Array(rawMap[y].length);
        for (let x = 0; x < rawMap[y].length; x++) {
            map[y][x] = transformTile(rawMap[y][x])
        }
    }
}

let inputs: Input[] = [];

function remove(shouldRemove: RemoveStrategy) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (shouldRemove.check(map[y][x])) {
                map[y][x] = new Air();
            }
        }
    }
}

function update() {
    handleInputs();
    updateMap();
}

function handleInputs() {
  while (inputs.length > 0) {
      let input = inputs.pop();
      input.handle(player);
  }
}

function updateMap() {
    for (let y = map.length - 1; y >= 0; y--) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x].update(x, y);
        }   
    }
}

function createGraphics() {
    let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
    let g = canvas.getContext("2d");
    g.clearRect(0, 0, canvas.width, canvas.height);
    return g;
}

function draw(player: Player) {
    let g = createGraphics();
    drawMap(g);
    player.draw(g);
}

function drawMap(g: CanvasRenderingContext2D) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x].draw(g, x, y);
        }
    }
}

function gameLoop() {
    let before = Date.now();
    update();
    draw(player);
    let after = Date.now();
    let frameTime = after - before;
    let sleep = SLEEP - frameTime;
    setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
    transformMap()
    gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
    if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
    else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
    else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
    else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

