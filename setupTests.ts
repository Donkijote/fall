class MockContainer {
  children: unknown[] = [];

  addChild<T>(child: T): T {
    this.children.push(child);
    return child;
  }

  removeChild(child: unknown): void {
    this.children = this.children.filter((currentChild) => currentChild !== child);
  }
}

class MockApplication {
  stage = new MockContainer();
  canvas = {
    width: 0,
    height: 0
  };

  async init(options?: { width?: number; height?: number }): Promise<void> {
    this.canvas.width = options?.width ?? this.canvas.width;
    this.canvas.height = options?.height ?? this.canvas.height;
  }

  destroy(): void {}
}

vi.mock("pixi.js", () => {
  return {
    Application: MockApplication,
    Container: MockContainer,
    Sprite: class MockSprite {},
    Graphics: class MockGraphics {}
  };
});
