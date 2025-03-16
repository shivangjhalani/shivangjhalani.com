---
title: Reintroduction To Programming
description: Deeper knowledge of your most essential tool.
date: 2024-12-27
tags:
  - C
  - low-level
  - ode5
---
This is the first in a series of blogs following [Kay Lack's ODE5](https://www.0de5.net) (pronounced odez)

ODE5 is a project to rekindle the excitement everyone first experienced about computer science and problem solving, but most of us have not had the chance/ability/inclination to really fall in love with it like some of us have. You went from a bootcamp or a degree where you might have only learned a slice of this field to a job where you still only working at the surface level of it.

The result of this can be boredom and apathy and you catch yourself wondering **Wasn't this supposed to be exciting?** and **Wasn't the world full of interesting problems waiting to be solved?**, well... it is! the world is full of interesting problems to be solved. This field was exciting back then, and it's only gotten more exciting since then.

## The reintroduction to programming
The core ideas of programming
1. Memory
2. Instructions
3. Syscalls
4. Functions

This is a simple `welcome` program we are gonna be playing with
```C
#include <stdio.h>

int makeItHigher(int n) { return n + 100 + 20 + 7; }

int main() {
  int name = 0;
  while (1) {
    name = makeItHigher(name);
    printf("Welcome to %04X\n", name);
  }
}
```
The number is being printed in base 16 hexadecimal

![[welcomeprogram.webm]]

### Memory
Lets take a look into the compiled program. We will be achieving this using a reverse-engineering debugger tool called radare2.
![r2launch.png](r2launch.png)
`V enter`, gives us hexdump view![](r2v.png)

`:s main enter`
`V enter`
![r2main.png](r2main.png)
This is the memory of our program (compiled code)  
Memory :  Big list of cells, each cell has an address and a value we can change

The columns in the image are
1. Address : word addresses, have gaps of 16
2. Value as hex : 16 bytes (8 blocks of 2 bytes each, 1 byte(8 bits) is 2 hexadecimal digits)
3. Value as characters
4. comments

The profound idea is, that everything (text, image, audio whether its on your hard drive, some network...) on a computer at some level exists in this structure (this big list of numbers)

### Instructions
`:s main enter`
`v enter`, gives us the disassembly view
![](disassembly.png)
An instruction is a symbol representing an operation. Instruction both are memory, and operate on memory. Instruction is what makes programming programming and not electrical engineering, basically the abstraction which allows us to represent sequences of operations as data in memory.  
The columns here are
1. Addresses
2. Values: in hex
3. Values: interpreted as instructions
4. Comments

These values in this view is the same as the one in our hexdump, but here they are interpreted as instructions using a low level language called assembly
![](comparision.png)

The assembly code here is also pretty easy to understand
![](assignment.png)
The highlighted address's line represents the `int name = 0`, its moving 0 to the address resolved by `basePointer - 4` location.  
We accessed the `name` variable using relative location. This relative location is relative to `basePointer` which is an address corresponding to a function's environment called frame. Each time you call a function it has its own frame.

These sets of instructions encoded as hex numbers are essentially what directly run on the cpu when interpreted as instructions.

### System Calls
Also known as syscalls in short.

Syscalls are instructions a program gives to systems outside itself, usually the OS running the program.  
Syscalls are what allow us to achieve stuff outside the scope of our program like making changes in hardware, network etc.

In our welcome program, the syscall being made is by the `printf` statement, which prints text to the terminal.

### Functions
Functions are a callable unit of code, typically taking some input in the form of arguments and returning some output as a return value, and sometimes having some side effects on other parts of a program or system.  
Functions are an exceptionally powerful idea taken from mathematics and placed on top of software engineering.

There is no such things as functions on instruction level, but the idea of functions or of subroutines is soo powerful that it is, in a way, emulated and structured in blocks of functions.
