// shortcuts.qml - Shortcuts

import QtQuick;
import org.kde.kwin;

Item {
    id: shortcuts;

    function toggleActiveTiling() {
        return toggleActiveTilingObj;
    }
    ShortcutHandler {
        id: toggleActiveTilingObj;

        name: "PoloniumToggleActiveTiling";
        text: "Polonium: Toggle Tiling on Active Window";
        sequence: "Meta+Shift+Space";
    }
    function toggleAllTiling() {
        return toggleAllTilingObj;
    }
    ShortcutHandler {
        id: toggleAllTilingObj;

        name: "PoloniumToggleAllTiling";
        text: "Polonium: Toggle Tiling on All Windows on Active Display";
        sequence: "";
    }

    // no default shortcuts for specific engines
    function setEngineBTree() {
        return setEngineBTreeObj;
    }
    ShortcutHandler {
        id: setEngineBTreeObj;

        name: "PoloniumSetEngineBTree";
        text: "Polonium: Use Binary Tree Engine";
        sequence: "";
    }
    function setEngineHalf() {
        return setEngineHalfObj;
    }
    ShortcutHandler {
        id: setEngineHalfObj;

        name: "PoloniumSetEngineHalf";
        text: "Polonium: Use Half Engine";
        sequence: "";
    }
    function setEngineThreeColumn() {
        return setEngineThreeColumnObj;
    }
    ShortcutHandler {
        id: setEngineThreeColumnObj;

        name: "PoloniumSetEngineThreeColumn";
        text: "Polonium: Use Three Column Engine";
        sequence: "";
    }
    function setEnginePillars() {
        return setEnginePillarsObj;
    }
    ShortcutHandler {
        id: setEnginePillarsObj;

        name: "PoloniumSetEnginePillars";
        text: "Polonium: Use Pillars Engine";
        sequence: "";
    }
    function setEnginePager() {
        return setEnginePagerObj;
    }
    ShortcutHandler {
        id: setEnginePagerObj;

        name: "PoloniumSetEnginePager";
        text: "Polonium: Use Pager Engine";
        sequence: "";
    }
    function setEngineKWin() {
        return setEngineKWinObj;
    }
    ShortcutHandler {
        id: setEngineKWinObj;

        name: "PoloniumSetEngineKWin";
        text: "Polonium: Use KWin Engine";
        sequence: "";
    }

    function activateAbove() {
        return activateAboveObj;
    }
    ShortcutHandler {
        id: activateAboveObj;

        name: "PoloniumActivateAbove";
        text: "Polonium: Activate Above";
        sequence: "Meta+K";
    }

    function activateBelow() {
        return activateBelowObj;
    }
    ShortcutHandler {
        id: activateBelowObj;

        name: "PoloniumActivateBelow";
        text: "Polonium: Activate Below";
        sequence: "Meta+J";
    }

    function activateLeft() {
        return activateLeftObj;
    }
    ShortcutHandler {
        id: activateLeftObj;

        name: "PoloniumActivateLeft";
        text: "Polonium: Activate Left";
        sequence: "Meta+H";
    }

    function activateRight() {
        return activateRightObj;
    }
    ShortcutHandler {
        id: activateRightObj;

        name: "PoloniumActivateRight";
        text: "Polonium: Activate Right";
        sequence: "Meta+L";
    }

    function placeAbove() {
        return placeAboveObj;
    }
    ShortcutHandler {
        id: placeAboveObj;

        name: "PoloniumPlaceAbove";
        text: "Polonium: Place Window Above";
        sequence: "Meta+Shift+K";
    }

    function placeBelow() {
        return placeBelowObj;
    }
    ShortcutHandler {
        id: placeBelowObj;

        name: "PoloniumPlaceBelow";
        text: "Polonium: Place Window Below";
        sequence: "Meta+Shift+J";
    }

    function placeLeft() {
        return placeLeftObj;
    }
    ShortcutHandler {
        id: placeLeftObj;

        name: "PoloniumPlaceLeft";
        text: "Polonium: Place Window Left";
        sequence: "Meta+Shift+H";
    }

    function placeRight() {
        return placeRightObj;
    }
    ShortcutHandler {
        id: placeRightObj;

        name: "PoloniumPlaceRight";
        text: "Polonium: Place Window Right";
        sequence: "Meta+Shift+L";
    }

    function resizeUp() {
        return resizeUpObj;
    }
    ShortcutHandler {
        id: resizeUpObj;

        name: "PoloniumResizeUp";
        text: "Polonium: Resize Tile Up";
        sequence: "Meta+Ctrl+K";
    }

    function resizeDown() {
        return resizeDownObj;
    }
    ShortcutHandler {
        id: resizeDownObj;

        name: "PoloniumResizeDown";
        text: "Polonium: Resize Tile Down";
        sequence: "Meta+Ctrl+J";
    }

    function resizeLeft() {
        return resizeLeftObj;
    }
    ShortcutHandler {
        id: resizeLeftObj;

        name: "PoloniumResizeLeft";
        text: "Polonium: Resize Tile Left";
        sequence: "Meta+Ctrl+H";
    }

    function resizeRight() {
        return resizeRightObj;
    }
    ShortcutHandler {
        id: resizeRightObj;

        name: "PoloniumResizeRight";
        text: "Polonium: Resize Tile Right";
        sequence: "Meta+Ctrl+L";
    }

    function toggleSettingsMenu() {
        return toggleSettingsMenuObj;
    }
    ShortcutHandler {
        id: toggleSettingsMenuObj;

        name: "PoloniumToggleSettingsMenu";
        text: "Polonium: Toggle Settings Menu";
        sequence: "Meta+\\";
    }

    function cycleEngine() {
        return cycleEngineObj;
    }
    ShortcutHandler {
        id: cycleEngineObj;

        name: "PoloniumCycleEngine";
        text: "Polonium: Cycle Engine";
        sequence: "Meta+|";
    }

    function reloadConfig() {
        return reloadConfigObj;
    }
    ShortcutHandler {
        id: reloadConfigObj;
        
        name: "PoloniumReloadConfig";
        text: "Polonium: Reload Config";
        sequence: "";
    }

    // shift+number gives the shifted symbol on us layouts, which is what kwin matches against
    function moveToDesktop1() {
        return moveToDesktop1Obj;
    }
    ShortcutHandler {
        id: moveToDesktop1Obj;
        
        name: "PoloniumMoveToDesktop1";
        text: "Polonium: Move Window to Desktop 1";
        sequence: "Meta+!";
    }
    function moveToDesktop2() {
        return moveToDesktop2Obj;
    }
    ShortcutHandler {
        id: moveToDesktop2Obj;
        
        name: "PoloniumMoveToDesktop2";
        text: "Polonium: Move Window to Desktop 2";
        sequence: "Meta+@";
    }
    function moveToDesktop3() {
        return moveToDesktop3Obj;
    }
    ShortcutHandler {
        id: moveToDesktop3Obj;
        
        name: "PoloniumMoveToDesktop3";
        text: "Polonium: Move Window to Desktop 3";
        sequence: "Meta+#";
    }
    function moveToDesktop4() {
        return moveToDesktop4Obj;
    }
    ShortcutHandler {
        id: moveToDesktop4Obj;
        
        name: "PoloniumMoveToDesktop4";
        text: "Polonium: Move Window to Desktop 4";
        sequence: "Meta+$";
    }
    function moveToDesktop5() {
        return moveToDesktop5Obj;
    }
    ShortcutHandler {
        id: moveToDesktop5Obj;
        
        name: "PoloniumMoveToDesktop5";
        text: "Polonium: Move Window to Desktop 5";
        sequence: "Meta+%";
    }
    function moveToDesktop6() {
        return moveToDesktop6Obj;
    }
    ShortcutHandler {
        id: moveToDesktop6Obj;
        
        name: "PoloniumMoveToDesktop6";
        text: "Polonium: Move Window to Desktop 6";
        sequence: "Meta+^";
    }
    function moveToDesktop7() {
        return moveToDesktop7Obj;
    }
    ShortcutHandler {
        id: moveToDesktop7Obj;
        
        name: "PoloniumMoveToDesktop7";
        text: "Polonium: Move Window to Desktop 7";
        sequence: "Meta+&";
    }
    function moveToDesktop8() {
        return moveToDesktop8Obj;
    }
    ShortcutHandler {
        id: moveToDesktop8Obj;
        
        name: "PoloniumMoveToDesktop8";
        text: "Polonium: Move Window to Desktop 8";
        sequence: "Meta+*";
    }
    function moveToDesktop9() {
        return moveToDesktop9Obj;
    }
    ShortcutHandler {
        id: moveToDesktop9Obj;
        
        name: "PoloniumMoveToDesktop9";
        text: "Polonium: Move Window to Desktop 9";
        sequence: "Meta+(";
    }
    /*
        function getRotateLayout() {
        return rotateLayout;
    }
        ShortcutHandler {
        id: rotateLayout;

        name: "PoloniumRotateLayout";
        text: "Polonium: Rotate Layout";
        sequence: "";
    }


    function getSwitchThreeColumn() {
        return switchThreeColumn;
    }
    ShortcutHandler {
        id: switchThreeColumn;

        name: "PoloniumSwitchThreeColumn";
        text: "Polonium: Use Three Column Engine";
        sequence: "";
    }

    function getSwitchMonocle() {
        return switchMonocle;
    }
    ShortcutHandler {
        id: switchMonocle;

        name: "PoloniumSwitchMonocle";
        text: "Polonium: Use Monocle Engine";
        sequence: "";
    }

    function getSwitchKwin() {
        return switchKwin;
    }
    ShortcutHandler {
        id: switchKwin;

        name: "PoloniumSwitchKwin";
        text: "Polonium: Use KWin Engine";
        sequence: "";
      }
      */
}
