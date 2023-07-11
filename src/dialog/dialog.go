package dialog

import (
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"path"
	"strings"
)

type Dialog struct {
	ctx *context.Context
}

func New(context *context.Context) *Dialog {
	return &Dialog{ctx: context}
}

func (d *Dialog) OpenDirectory(options runtime.OpenDialogOptions) (string, error) {
	return runtime.OpenDirectoryDialog(*d.ctx, options)
}

func (d *Dialog) OpenFileDialog(options runtime.OpenDialogOptions) (string, error) {
	return runtime.OpenFileDialog(*d.ctx, options)
}

func (d *Dialog) Dir(_path string) string {
	// 反斜杠居然没有兼容处理...
	return path.Dir(strings.ReplaceAll(_path, "\\", "/"))
}

func (d *Dialog) PathJoin(elem []string) string {
	return path.Join(elem...)
}

func (d *Dialog) ShowErrorDialog(message string) {
	ShowErrorDialog(*d.ctx, message)
}

func ShowErrorDialog(ctx context.Context, message string) {
	runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
		Title:         "Error Occured",
		Message:       message,
		Type:          runtime.ErrorDialog,
		DefaultButton: "确定",
	})
}
