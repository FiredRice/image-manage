package main

import (
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"image-manage/src/core"
	"image-manage/src/dialog"
	"image-manage/src/file"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := core.New()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "图片管理",
		Width:     640,
		Height:    480,
		MinWidth:  640,
		MinHeight: 480,
		AssetServer: &assetserver.Options{
			Assets: assets,
			Handler: file.NewFileLoader(),
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		Menu:             core.NewMenu(app),
		OnStartup:        app.Startup,
		OnBeforeClose:    app.BeforeClose,
		Bind: []interface{}{
			app,
			file.New(app.Context()),
			dialog.New(app.Context()),
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
