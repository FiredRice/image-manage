package core

import (
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"image-manage/src/store"
)

// App struct
type App struct {
	ctx   context.Context
	store *store.Store
}

// NewApp creates a new App application struct
func New() *App {
	return &App{}
}

func (a *App) Context() *context.Context {
	return &a.ctx
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	a.loadConfig()
}

func (a *App) loadConfig() {
	var err error
	a.store, err = store.NewStore()
	if err != nil {
		runtime.LogInfo(a.ctx, err.Error())
	}
	pos, err := a.store.GetPos()
	if err != nil {
		runtime.LogInfo(a.ctx, err.Error())
		return
	}
	runtime.WindowSetPosition(a.ctx, pos.X, pos.Y)
	size, _ := a.store.GetSize()
	runtime.WindowSetSize(a.ctx, size.Width, size.Height)
}

func (a *App) BeforeClose(ctx context.Context) bool {
	x, y := runtime.WindowGetPosition(ctx)
	a.store.SetPos(x, y)
	width, height := runtime.WindowGetSize(ctx)
	a.store.SetSize(width, height)
	err := a.store.Save()
	if err != nil {
		runtime.LogInfo(ctx, err.Error())
	}
	return false
}
