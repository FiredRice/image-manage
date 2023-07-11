package store

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
)

type Store struct {
	value *WindowsStore
}

var windowStorePath = "data/windows.json"

func NewStore() (*Store, error) {
	content, err := os.ReadFile(windowStorePath)
	if err != nil {
		return &Store{}, err
	}
	var windows WindowsStore
	err = json.Unmarshal(content, &windows)
	if err != nil {
		fmt.Println(err.Error())
		return &Store{}, err
	}
	return &Store{value: &windows}, nil
}

func (s *Store) GetPos() (Point, error) {
	if s.value == nil {
		return Point{}, fmt.Errorf("没有历史记录")
	}
	return s.value.Pos, nil
}

func (s *Store) SetPos(x, y int) {
	if s.value == nil {
		s.value = &WindowsStore{}
	}
	s.value.Pos = Point{x, y}
}

func (s *Store) GetSize() (Size, error) {
	if s.value == nil {
		return Size{}, fmt.Errorf("没有历史记录")
	}
	return s.value.Size, nil
}

func (s *Store) SetSize(width, height int) {
	if s.value == nil {
		s.value = &WindowsStore{}
	}
	s.value.Size = Size{width, height}
}

func (s *Store) Save() error {
	jsonBytes, err := json.Marshal(s.value)
	if err != nil {
		return err
	}
	err = os.WriteFile(windowStorePath, jsonBytes, fs.ModePerm)
	if err != nil {
		return err
	}
	return nil
}

func init() {
	os.Mkdir("data", fs.ModePerm)
}
