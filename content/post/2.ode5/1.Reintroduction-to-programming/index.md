---
title: 1. Reintroduction To Programming
description: Deeper knowledge of your most essential tool.
slug: 
date: 2024-12-27 00:16:10+0530
image: cover.png
tags:
  - C
  - low-level
categories:
  - recreational-programming
weight: 0
math: false
hidden: false
---
This is the first in a series of blogs following [Kay Lack's ODE5](https://www.0de5.net) (pronounced odez)

ODE5 is a project to rekindle the excitement everyone first experienced about computer science and problem solving, but most of us have not had the chance/ability/inclination to really fall in love with it like some of us have. You went from a bootcamp or a degree where you might have only learned a slice of this field to a job where you still only working at the surface level of it.

The result of this can be boredom and apathy and you catch yourself wondering **Wasn't this supposed to be exciting?** and **Wasn't the world full of interesting problems waiting to be solved?**, well... it is! the world is full of interesting problems to be solved. This field was exciting back then, and it's only gotten more exciting since then.

# The reintroduction to programming
The 6 core ideas of programming
1. Memory
2. Instructions
3. Syscalls
4. Functions
5. Structure
6. Cognition

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

{{< video "./welcomeprogram.webm" >}}