# Hardware Discovery Tool

## What does it do?
- Uses the [GHW hardware inspection library](https://github.com/jaypipes/ghw)
- Returns value of the current machines cpu information

## Introduction:
This tool is used to track processor information necessary for calculating the amount of Java SE processor licenses required using oracle core factor pricing table

## How to use:
- First install latest stable version of go [Golang install portal](https://golang.org/doc/install)
- Afterwards create a go folder to contain the necesarry packages
- Then set your GOPATH pointing to the newly created go directory:
```$ export GOPATH=$HOME/go```
- Within this directory create a `src` folder and run `$ go get github.com/jaypipes/ghw` to create the package.
- If all these steps work properly all thats left is running the program with this command:

```$ go run main.go```

This should return details on memory, and cpu like amount of cores, vendor model and more.