import { Workspace } from "kwin-api/qml";
import { Shortcuts } from "../../extern";
import { config, console, controller as ctrl, qt } from "..";
import { Direction, TilingEngineType } from "../../engine";
import { Display } from "../event";
import { Edge, Output, Tile, VirtualDesktop, Window } from "kwin-api";
import { QPoint, QRect } from "kwin-api/qt";

// per-screen desktop methods only exist in newer KWin versions, and the screen switching slots arent typed
interface ScreenWorkspace extends Workspace {
    currentDesktopForScreen?(output: Output): VirtualDesktop;
    setCurrentDesktopForScreen?(desktop: VirtualDesktop, output: Output): void;
    slotSwitchToLeftScreen(): void;
    slotSwitchToRightScreen(): void;
}

function rootOf(tile: Tile): Tile {
    while (tile.parent != null) {
        tile = tile.parent;
    }
    return tile;
}

// point just inside the side of area that a window moving towards edge enters from,
// lined up with the center of from on the other axis
function entryPoint(area: QRect, edge: Edge, from: QRect): QPoint {
    const clamp = (v: number, min: number, max: number) =>
        Math.min(Math.max(v, min), max);
    let x = clamp(from.x + from.width / 2, area.x + 2, area.x + area.width - 3);
    let y = clamp(
        from.y + from.height / 2,
        area.y + 2,
        area.y + area.height - 3,
    );
    switch (edge) {
        case Edge.LeftEdge:
            x = area.x + area.width - 3;
            break;
        case Edge.RightEdge:
            x = area.x + 2;
            break;
        case Edge.TopEdge:
            y = area.y + area.height - 3;
            break;
        case Edge.BottomEdge:
            y = area.y + 2;
            break;
    }
    return qt().point(Math.floor(x), Math.floor(y));
}

export class ShortcutsHandler {
    private workspace: ScreenWorkspace;
    private shortcuts: Shortcuts;

    constructor(workspace: Workspace, shortcuts: Shortcuts) {
        this.workspace = workspace as ScreenWorkspace;
        this.shortcuts = shortcuts;

        this.shortcuts
            .toggleActiveTiling()
            .activated.connect(this.toggleActiveTiling.bind(this));

        this.shortcuts
            .setEngineBTree()
            .activated.connect(
                this.setEngineType.bind(this, TilingEngineType.BTree),
            );
        this.shortcuts
            .setEngineHalf()
            .activated.connect(
                this.setEngineType.bind(this, TilingEngineType.Half),
            );
        this.shortcuts
            .setEngineThreeColumn()
            .activated.connect(
                this.setEngineType.bind(this, TilingEngineType.ThreeColumn),
            );
        this.shortcuts
            .setEnginePillars()
            .activated.connect(
                this.setEngineType.bind(this, TilingEngineType.Pillars),
            );
        this.shortcuts
            .setEnginePager()
            .activated.connect(
                this.setEngineType.bind(this, TilingEngineType.Pager),
            );
        this.shortcuts
            .setEngineKWin()
            .activated.connect(
                this.setEngineType.bind(this, TilingEngineType.KWin),
            );

        this.shortcuts
            .activateBelow()
            .activated.connect(
                this.activateInDirection.bind(this, Edge.BottomEdge),
            );
        this.shortcuts
            .activateAbove()
            .activated.connect(
                this.activateInDirection.bind(this, Edge.TopEdge),
            );
        this.shortcuts
            .activateLeft()
            .activated.connect(
                this.activateInDirection.bind(this, Edge.LeftEdge),
            );
        this.shortcuts
            .activateRight()
            .activated.connect(
                this.activateInDirection.bind(this, Edge.RightEdge),
            );

        this.shortcuts
            .placeBelow()
            .activated.connect(
                this.placeInDirection.bind(this, Edge.BottomEdge),
            );
        this.shortcuts
            .placeAbove()
            .activated.connect(this.placeInDirection.bind(this, Edge.TopEdge));
        this.shortcuts
            .placeLeft()
            .activated.connect(this.placeInDirection.bind(this, Edge.LeftEdge));
        this.shortcuts
            .placeRight()
            .activated.connect(
                this.placeInDirection.bind(this, Edge.RightEdge),
            );

        this.shortcuts
            .resizeDown()
            .activated.connect(
                this.resizeInDirection.bind(this, Edge.BottomEdge),
            );
        this.shortcuts
            .resizeUp()
            .activated.connect(this.resizeInDirection.bind(this, Edge.TopEdge));
        this.shortcuts
            .resizeLeft()
            .activated.connect(
                this.resizeInDirection.bind(this, Edge.LeftEdge),
            );
        this.shortcuts
            .resizeRight()
            .activated.connect(
                this.resizeInDirection.bind(this, Edge.RightEdge),
            );

        this.shortcuts
            .toggleSettingsMenu()
            .activated.connect(this.toggleSettingsMenu.bind(this));

        this.shortcuts
            .cycleEngine()
            .activated.connect(this.cycleEngine.bind(this));

        const moveToDesktop = [
            shortcuts.moveToDesktop1(),
            shortcuts.moveToDesktop2(),
            shortcuts.moveToDesktop3(),
            shortcuts.moveToDesktop4(),
            shortcuts.moveToDesktop5(),
            shortcuts.moveToDesktop6(),
            shortcuts.moveToDesktop7(),
            shortcuts.moveToDesktop8(),
            shortcuts.moveToDesktop9(),
        ];
        moveToDesktop.forEach((shortcut, i) =>
            shortcut.activated.connect(this.moveToDesktop.bind(this, i)),
        );
    }

    toggleActiveTiling() {
        const window = this.workspace.activeWindow;
        if (window == null) return;
        const windowHandler = ctrl().getWindowHandler(window);
        if (windowHandler == undefined) return;
        if (ctrl().isWindowTiled(window)) {
            windowHandler.wantsTiled = false;
            ctrl().queueEvent({
                t: "untileWindow",
                window: window,
            });
        } else {
            windowHandler.wantsTiled = true;
            ctrl().queueEvent({
                t: "tileWindow",
                window: window,
            });
        }
    }

    setEngineType(engineType: TilingEngineType) {
        ctrl().queueEvent({
            t: "changeEngine",
            display: new Display(
                this.workspace.currentDesktop,
                this.workspace.currentActivity,
                this.workspace.activeScreen,
            ),
            engineType: engineType,
        });
    }

    getTileInDirection(tile: Tile, rootTile: Tile, edge: Edge): Tile | null {
        if (tile == rootTile) return null;
        let x = tile.absoluteGeometry.x;
        let y = tile.absoluteGeometry.y;
        // kwin fucking up math somehow so add 2 instead of 1 for offset
        switch (edge) {
            case Edge.BottomEdge:
                x += tile.absoluteGeometry.width / 2;
                y += tile.absoluteGeometry.height + 2;
                break;
            case Edge.TopEdge:
                x += tile.absoluteGeometry.width / 2;
                y -= 2;
                break;
            case Edge.LeftEdge:
                x -= 2;
                y += tile.absoluteGeometry.height / 2;
                break;
            case Edge.RightEdge:
                x += tile.absoluteGeometry.width + 2;
                y += tile.absoluteGeometry.height / 2;
                break;
            default:
                return null;
        }
        const point = qt().point(Math.floor(x), Math.floor(y));
        console().debug("selecting tile for point", point);
        return rootTile.pick(point);
    }

    private desktopForScreen(output: Output): VirtualDesktop {
        return (
            this.workspace.currentDesktopForScreen?.(output) ??
            this.workspace.currentDesktop
        );
    }

    private setDesktopForScreen(desktop: VirtualDesktop, output: Output) {
        if (this.workspace.setCurrentDesktopForScreen !== undefined) {
            this.workspace.setCurrentDesktopForScreen(desktop, output);
        } else {
            this.workspace.currentDesktop = desktop;
        }
    }

    // matches how kwin picks the screen to the left or right, minus the wraparound
    private screenInDirection(output: Output, edge: Edge): Output | null {
        if (edge !== Edge.LeftEdge && edge !== Edge.RightEdge) return null;
        const g = output.geometry;
        const centerX = (o: Output) => o.geometry.x + o.geometry.width / 2;
        const row = this.workspace.screens
            .filter(
                (o) =>
                    o.geometry.y < g.y + g.height &&
                    o.geometry.y + o.geometry.height > g.y,
            )
            .sort((a, b) => centerX(a) - centerX(b));
        const i = row.indexOf(output);
        return row[edge === Edge.LeftEdge ? i - 1 : i + 1] ?? null;
    }

    activateInDirection(edge: Edge) {
        const window = this.workspace.activeWindow;
        const currentTile = window?.tile ?? null;
        if (currentTile != null) {
            const targetTile = this.getTileInDirection(
                currentTile,
                rootOf(currentTile),
                edge,
            );
            if (targetTile != null) {
                console().log(
                    "activateInDirection geom -",
                    targetTile.absoluteGeometry,
                );
                if (targetTile.windows.length == 0) return;
                this.workspace.activeWindow = targetTile.windows[0];
                return;
            }
        }
        // nothing further this way on this screen, so try the next screen over
        const output = window?.output ?? this.workspace.activeScreen;
        const target = this.screenInDirection(output, edge);
        if (target == null) return;
        const rootTile = this.workspace.rootTile(
            target,
            this.desktopForScreen(target),
        );
        const point = entryPoint(
            rootTile.absoluteGeometry,
            edge,
            window?.frameGeometry ?? output.geometry,
        );
        const targetWindow = rootTile.pick(point)?.windows[0];
        console().log("activateInDirection screen -", target.name);
        if (targetWindow !== undefined) {
            this.workspace.activeWindow = targetWindow;
        } else if (edge === Edge.LeftEdge) {
            // no tiled window at that edge, so let kwin pick the last used window there
            this.workspace.slotSwitchToLeftScreen();
        } else {
            this.workspace.slotSwitchToRightScreen();
        }
    }

    // left/right sends the window to the next screen, up/down sends it to the previous/next desktop
    private placePastEdge(window: Window, edge: Edge) {
        const tiled = ctrl().isWindowTiled(window) === true;
        const from = window.frameGeometry;
        if (edge === Edge.LeftEdge || edge === Edge.RightEdge) {
            const target = this.screenInDirection(window.output, edge);
            if (target == null) return;
            console().log("placePastEdge screen -", target.name);
            // kwin moves the window onto the current desktop of the new screen
            this.workspace.sendClientToScreen(window, target);
            if (!tiled) return;
            const rootTile = this.workspace.rootTile(
                target,
                this.desktopForScreen(target),
            );
            ctrl().queueEvent({
                t: "placeWindowPoint",
                window: window,
                point: entryPoint(rootTile.absoluteGeometry, edge, from),
            });
            return;
        }
        if (window.onAllDesktops) return;
        const output = window.output;
        const desktops = this.workspace.desktops;
        const i = desktops.indexOf(this.desktopForScreen(output));
        const target = desktops[edge === Edge.BottomEdge ? i + 1 : i - 1];
        if (target === undefined) return;
        console().log("placePastEdge desktop -", target.name);
        this.sendToDesktop(window, target);
        if (tiled) {
            const rootTile = this.workspace.rootTile(output, target);
            ctrl().queueEvent({
                t: "placeWindowPoint",
                window: window,
                point: entryPoint(rootTile.absoluteGeometry, edge, from),
            });
        }
    }

    // moves the window and switches its screen to the new desktop so focus follows it
    private sendToDesktop(window: Window, desktop: VirtualDesktop) {
        const output = window.output;
        window.desktops = [desktop];
        this.setDesktopForScreen(desktop, output);
        this.workspace.activeWindow = window;
    }

    moveToDesktop(index: number) {
        const window = this.workspace.activeWindow;
        const target = this.workspace.desktops[index];
        if (window === null || target === undefined) return;
        console().log("moveToDesktop -", target.name);
        this.sendToDesktop(window, target);
    }

    placeInDirection(edge: Edge) {
        const window = this.workspace.activeWindow;
        if (window === null) {
            return;
        }
        const currentTile = window.tile;
        const targetTile =
            currentTile &&
            this.getTileInDirection(currentTile, rootOf(currentTile), edge);
        if (currentTile === null || targetTile == null) {
            this.placePastEdge(window, edge);
            return;
        }
        let direction: Direction | undefined = undefined;
        switch (edge) {
            case Edge.TopEdge:
                direction = Direction.Vertical;
                break;
            case Edge.BottomEdge:
                direction = Direction.Down | Direction.Vertical;
                break;
            case Edge.LeftEdge:
                direction = Direction.None;
                break;
            case Edge.RightEdge:
                direction = Direction.Right;
                break;
            default:
                break;
        }
        // if the old tile x axis center is farther right (greater) than the target x axis center,
        // then set right flag as well
        if (edge & Edge.BottomEdge || edge & Edge.TopEdge) {
            const currentCenter =
                currentTile.absoluteGeometry.x +
                currentTile.absoluteGeometry.width / 2;
            const targetCenter =
                targetTile.absoluteGeometry.x +
                targetTile.absoluteGeometry.width / 2;
            if (currentCenter > targetCenter && direction !== undefined) {
                direction |= Direction.Right;
            }
        } else if (edge & Edge.LeftEdge || edge & Edge.RightEdge) {
            const currentCenter =
                currentTile.absoluteGeometry.y +
                currentTile.absoluteGeometry.height / 2;
            const targetCenter =
                targetTile.absoluteGeometry.y +
                targetTile.absoluteGeometry.height / 2;
            // same thing for left/right primary but up means smaller y
            if (currentCenter > targetCenter && direction !== undefined) {
                direction |= Direction.Down;
            }
        }
        ctrl().queueEvent({
            t: "placeWindow",
            window: window,
            tile: targetTile,
            direction: direction,
        });
    }

    resizeInDirection(edge: Edge) {
        const currentTile = this.workspace.activeWindow?.tile;
        if (currentTile == null) return;
        let amount = config().tileResizeAmount;
        switch (edge) {
            case Edge.TopEdge: {
                const oldTop = currentTile.absoluteGeometry.y;
                currentTile.resizeByPixels(-amount, Edge.TopEdge);
                if (oldTop == currentTile.absoluteGeometry.y) {
                    currentTile.resizeByPixels(-amount, Edge.BottomEdge);
                }
                break;
            }
            case Edge.BottomEdge: {
                const oldBottom =
                    currentTile.absoluteGeometry.y +
                    currentTile.absoluteGeometry.height;
                currentTile.resizeByPixels(amount, Edge.BottomEdge);
                if (
                    oldBottom ==
                    currentTile.absoluteGeometry.y +
                        currentTile.absoluteGeometry.height
                ) {
                    currentTile.resizeByPixels(amount, Edge.TopEdge);
                }
                break;
            }
            case Edge.LeftEdge: {
                const oldLeft = currentTile.absoluteGeometry.x;
                currentTile.resizeByPixels(-amount, Edge.LeftEdge);
                if (oldLeft == currentTile.absoluteGeometry.x) {
                    currentTile.resizeByPixels(-amount, Edge.RightEdge);
                }
                break;
            }
            case Edge.RightEdge: {
                const oldRight =
                    currentTile.absoluteGeometry.x +
                    currentTile.absoluteGeometry.width;
                currentTile.resizeByPixels(amount, Edge.RightEdge);
                if (
                    oldRight ==
                    currentTile.absoluteGeometry.x +
                        currentTile.absoluteGeometry.width
                ) {
                    currentTile.resizeByPixels(amount, Edge.LeftEdge);
                }
                break;
            }
            default:
                break;
        }
    }

    toggleSettingsMenu() {
        ctrl().queuePostEvent({
            t: "toggleSettingsMenu",
            display: new Display(
                this.workspace.currentDesktop,
                this.workspace.currentActivity,
                this.workspace.activeScreen,
            ),
        });
    }

    cycleEngine() {
        const current = ctrl().getEngineType(
            new Display(
                this.workspace.currentDesktop,
                this.workspace.currentActivity,
                this.workspace.activeScreen,
            ),
        );
        if (current === undefined) {
            // Should never happen, but it's better for code quality
            // that we assume that it can and we handle the error without assumption.
            return;
        }
        const next = (current + 1) % TilingEngineType._Loop;
        this.setEngineType(next);
    }
}
