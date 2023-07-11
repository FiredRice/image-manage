package core

import (
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"image-manage/src/dialog"
)

func createFileMenu(appMenu *menu.Menu, app *App) *menu.Menu {
	fileMenu := appMenu.AddSubmenu("文件")
	fileMenu.AddText("新建标签", keys.CmdOrCtrl("L"), func(cd *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "Create-Image-Label")
	})
	fileMenu.AddSeparator()
	fileMenu.AddText("批量导入", keys.CmdOrCtrl("I"), func(cd *menu.CallbackData) {
		paths, err := runtime.OpenMultipleFilesDialog(app.ctx, runtime.OpenDialogOptions{
			Title: "请选择图片",
			Filters: []runtime.FileFilter{
				{Pattern: "*.jpg;*.png;*.gif", DisplayName: "图片"},
			},
		})
		if err != nil {
			dialog.ShowErrorDialog(app.ctx, err.Error())
			runtime.LogError(app.ctx, err.Error())
			return
		}
		runtime.EventsEmit(app.ctx, "Import-Images-Success", paths)
	})
	fileMenu.AddSeparator()
	fileMenu.AddText("退出", keys.CmdOrCtrl("Q"), func(_ *menu.CallbackData) {
		runtime.Quit(app.ctx)
	})
	return fileMenu
}

func createWindowMenu(appMenu *menu.Menu, app *App) *menu.Menu {
	windowMenu := appMenu.AddSubmenu("窗口")
	windowMenu.AddText("重新加载", keys.CmdOrCtrl("R"), func(cd *menu.CallbackData) {
		runtime.WindowReloadApp(app.ctx)
	})
	windowMenu.AddSeparator()
	windowMenu.AddText("切换全屏", keys.Key("f11"), func(cd *menu.CallbackData) {
		if runtime.WindowIsFullscreen(app.ctx) {
			runtime.WindowUnfullscreen(app.ctx)
		} else {
			runtime.WindowFullscreen(app.ctx)
		}
	})
	return windowMenu
}

func NewMenu(app *App) *menu.Menu {
	appMenu := menu.NewMenu()
	createFileMenu(appMenu, app)
	createWindowMenu(appMenu, app)
	return appMenu
}
