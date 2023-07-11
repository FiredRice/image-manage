package file

type FileInfo struct {
	Name    string `json:"name"`    // 文件名
	Path    string `json:"path"`    // 文件路径
	ModTime string `json:"modTime"` // 修改时间
	IsDir   bool   `json:"isDir"`   // 是否是目录
	Size    int64  `json:"size"`    // 文件大小
}
