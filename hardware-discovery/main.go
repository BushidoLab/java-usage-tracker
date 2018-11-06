package main

import (
		"fmt"
		"os"
		"os/exec"
		"time"
		"github.com/jaypipes/ghw"
)

func main() {
	cmd := "node"
	pci, err := ghw.PCI();
	addr := "0000:00:00.0"
	if len(os.Args) == 2 {
		addr = os.Args[1]
	}
	
	t := time.Now().UTC();
	fmt.Printf("%v\n", t);

	cpu, err := ghw.CPU()
	if err != nil {
		fmt.Printf("Error getting CPU info: %v", err)
	}

	deviceInfo := pci.GetDevice(addr)

	fmt.Printf("%v\n", cpu)
	cores := fmt.Sprint(cpu.TotalCores)

	subsystem := deviceInfo.Subsystem
	subvendor := pci.Vendors[subsystem.VendorId]

	for _, proc := range cpu.Processors {
		fmt.Printf("Vendor: %v\n", proc.Vendor)
		fmt.Printf("Model: %v\n", proc.Model)
		fmt.Printf("Subsystem: %v\n", deviceInfo.Subsystem)
		if err := exec.Command(cmd, "node-request.js", cores, proc.Vendor, proc.Model, t.String(), subvendor.Name).Run(); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
	}
	
}