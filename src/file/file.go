package file

import (
	"context"
	"fmt"
	"image-manage/src/utils"
	"io/fs"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type File struct {
	ctx *context.Context
}

func New(context *context.Context) *File {
	return &File{context}
}

func (f *File) ErrorLog(err error) {
	runtime.LogError(*f.ctx, err.Error())
}

func (f *File) WriteFile(path string, content string) error {
	return os.WriteFile(path, []byte(content), fs.ModePerm)
}

func (f *File) ReadFile(path string) (string, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		f.ErrorLog(err)
		return "", err
	}
	return string(content), nil
}

func (f *File) GetFileInfo(filePath string) (FileInfo, error) {
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return FileInfo{}, err
	}
	result := FileInfo{
		Path:    filePath,
		Name:    fileInfo.Name(),
		ModTime: fileInfo.ModTime().Format("2006-01-02 15:04:05"),
		IsDir:   fileInfo.IsDir(),
		Size:    fileInfo.Size(),
	}
	return result, nil
}

func (f *File) GetFilesInfo(paths []string) []FileInfo {
	length := len(paths)
	results := make([]FileInfo, length)
	tool.Parallel(0, length, func(ic <-chan int) {
		for i := range ic {
			info, err := f.GetFileInfo(paths[i])
			if err != nil {
				f.ErrorLog(err)
			} else {
				results[i] = info
			}
		}
	})
	return results
}

func (f *File) LocalOpenFile(path string) error {
	// 仅打开图片
	cmd := exec.Command("rundll32", "url.dll,FileProtocolHandler", path)
	// 打开任意文件
	// cmd := exec.Command("cmd", "/c", "start", path)
	err := cmd.Start()
	if err != nil {
		return err
	}
	return nil
}

func (f *File) LocalOpenFolder(path string) error {
	cmd := exec.Command("explorer", path)
	err := cmd.Start()
	if err != nil {
		return err
	}
	return nil
}

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

var fileServiceReg, _ = regexp.Compile("^wails/")

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	var err error
	requestedFilename := strings.TrimPrefix(req.URL.Path, "/")
	requestedFilename = fileServiceReg.ReplaceAllString(requestedFilename, "")
	fileData, err := os.ReadFile(requestedFilename)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
	}
	res.Write(fileData)
}
