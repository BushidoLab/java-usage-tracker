package main

import (
		"fmt"
		"github.com/jaypipes/ghw"
)

func main() {
	memory, err := ghw.Memory()
	if err != nil {
		fmt.Printf("Error getting memory info: %v", err)
	}
	fmt.Println(memory.String())

	cpu, err := ghw.CPU()
	if err != nil {
		fmt.Printf("Error getting CPU info: %v", err)
	}

	fmt.Printf("%v\n", cpu)

	for _, proc := range cpu.Processors {
		fmt.Printf(" %v\n", proc)
		fmt.Printf("Vendor: %v\n", proc.Vendor)
		fmt.Printf("Model: %v\n", proc.Model)
		fmt.Printf("Processor Id: %v\n", proc.Id)
		for _, core := range proc.Cores {
			fmt.Printf("  %v\n", core)
		}
	}
}

