package main

import (
		"fmt"
		"os"
		"os/exec"
		"github.com/jaypipes/ghw"
)

func main() {
	cmd := "node"
	
	cpu, err := ghw.CPU()
	if err != nil {
		fmt.Printf("Error getting CPU info: %v", err)
	}

	fmt.Printf("%v\n", cpu)
	str := fmt.Sprint(cpu.TotalCores)

	for _, proc := range cpu.Processors {
		fmt.Printf("Vendor: %v\n", proc.Vendor)
		fmt.Printf("Model: %v\n", proc.Model)
		if err := exec.Command(cmd, "node-request.js", str, proc.Vendor, proc.Model).Run(); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
	}
	
}