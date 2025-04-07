---
title: 8-bit CPU on an FPGA
subtitle: 
date: 2025-04-06
tags:
  - low-level
  - embedded
  - verilog
comments: true
draft: 
enableToc: true
---
Why? My microprocessor and computer architecture teacher recently told in class that we could build a small toy processor on our own, I remember my eyes light up, cause?!?! it would be soo cool if I could build my own CPU and how much I would learn on the way...  

We anyways had to do something for our semester final project, I asked one of my classmates if they wanted to do it and we set on the journey!  
I began searching online on how to build a CPU from scratch when I came across [Ben Eater’s 8-bit Breadboard Computer](https://eater.net/8bit), but I read and realised that much of the fun was in the design and the learning, and the act of actually cutting wire was tedious exercise, and building from logic blocks would take too long!  
Ben Eater's 8-bit computer :  
![[Pasted image 20250407000709.png | 400]]

# Final showcase
> Still in progress

# Background

After learning and documenting basics of how FPGA and verilog programming works in [[Intro to FPGA Programming]], I want to recreate a CPU on an FPGA instead, it's not tedious at all but still has just as much if not more learning!  

Still getting inspiration from Ben Eater, he followed the design laid out in a book called [Digital Computer Electronics](https://www.goodreads.com/book/show/942643.Digital_Computer_Electronics) by Malvino and Brown. The book builds what it calls the **Simple-as-Possible (SAP) Computer**. It starts with the incredibly simple **SAP-1**, adds some features to get the **SAP-2**, and then adds a few more to reach the final version called **SAP-3**.

# SAP-1
![[Pasted image 20250407090956.png]]

## Modules

### 1. Clock
It orchestrates all of the distinct components so that they can talk together at a fixed interval in lock-step with each other. A clock oscillates between **HIGH** and **LOW** repeatedly, indefinitely.  

```verilog
// Clock module for Basys 3 with Halt functionality

module clock (
    input clk_100mhz, // Input from the Basys 3 100MHz oscillator (pin W5) [cite: 402]
    input hlt,        // Halt signal input
    output clk_out     // Clock output
);

    // Assign clk_out: 
    // If hlt is asserted (1), output is 0.
    // Otherwise, output is the 100MHz clock input.
    assign clk_out = hlt ? 1'b0 : clk_100mhz; 

endmodule
```

### 2. Program Counter
It always stores the address of the next instruction to be executed.

For the SAP-1, a program is just a series of bytes in memory where one byte makes up one instruction to be executed. The instructions are laid out serially and counted through starting from address 0.

The SAP-1’s memory is only 16 bytes so the program counter should count from **0x0 (0)** to **0xF (15)**.

```verilog
// Program Counter Module (4-bit for SAP-1)

module pc (
    input         clk, // Clock input
    input         rst, // Synchronous reset input
    input         inc, // Increment enable input
    output [3:0]  out  // 4-bit Program Counter output (addresses 0x0 to 0xF)
);

    // Internal register to store the 4-bit PC value
    reg [3:0] pc_reg;

    // Synchronous logic: updates happen on the positive edge of the clock
    always @(posedge clk) begin
        if (rst) begin
            // If reset is asserted, set PC to 0
            pc_reg <= 4'b0000; 
        end else if (inc) begin
            // If increment is asserted (and not reset), increment PC by 1
            // It will automatically wrap from 15 (1111) back to 0 (0000)
            pc_reg <= pc_reg + 1;
        end
        // If neither rst nor inc is asserted, pc_reg retains its current value.
    end

    // Continuously assign the internal register value to the output port
    assign out = pc_reg;

endmodule
```

### 3. Register A
**Register A** is the main register of the computer and many of the instructions depend upon it.
**bus** is an input which is driven by some other module and Register A can read from it when it needs to load which happens when **load** is asserted.

```verilog
// Register A Module (8-bit)

module reg_a (
    input         clk,    // Clock input
    input         rst,    // Synchronous reset input
    input         load,   // Load enable input
    input  [7:0]  bus,    // 8-bit data input bus
    output [7:0]  out     // 8-bit data output
);

    // Internal register to store the value of Register A
    reg [7:0] reg_a_value;

    // Synchronous logic: updates happen on the positive edge of the clock
    always @(posedge clk) begin
        if (rst) begin
            // If reset is asserted, clear the register to 0
            reg_a_value <= 8'b00000000; 
        end else if (load) begin
            // If load is asserted (and not reset), 
            // capture the value from the bus into the register
            reg_a_value <= bus;
        end
        // If neither rst nor load is asserted, reg_a_value retains its current value.
    end

    // Continuously assign the internal register value to the output port
    assign out = reg_a_value;

endmodule
```

### 4. Register B
**Register B** is identical to Register A in design but when it’s used (as seen in the schematic diagram above), it never drives the bus directly; its output is fed to the Adder only.  
The SAP-1 is designed so that Register A is where the main action occurs and Register B supports it.

```verilog
// Register B Module (8-bit)

module reg_b (
    input         clk,    // Clock input
    input         rst,    // Synchronous reset input
    input         load,   // Load enable input
    input  [7:0]  bus,    // 8-bit data input bus
    output [7:0]  out     // 8-bit data output (intended for Adder)
);

    // Internal register to store the value of Register B
    reg [7:0] reg_b_value;

    // Synchronous logic: updates happen on the positive edge of the clock
    // Logic is identical to Register A
    always @(posedge clk) begin
        if (rst) begin
            // If reset is asserted, clear the register to 0
            reg_b_value <= 8'b00000000; 
        end else if (load) begin
            // If load is asserted (and not reset), 
            // capture the value from the bus into the register
            reg_b_value <= bus;
        end
        // If neither rst nor load is asserted, reg_b_value retains its current value.
    end

    // Continuously assign the internal register value to the output port
    assign out = reg_b_value;

endmodule
```

### 5. Adder
The SAP-1 can only do addition and subtraction. Don't worry, it'll be able to do much more soon!  
The arithmetic module is called adder even tho it can perform both addition and subtraction (subtraction is just addition of a negative number after all).

```verilog
// Adder/Subtractor Module (8-bit) for SAP-1

module adder (
    input  [7:0] in_a,      // 8-bit input from Register A
    input  [7:0] in_b,      // 8-bit input from Register B
    input        sub,       // Control signal: 0 = Add (A+B), 1 = Subtract (A-B)
    output [7:0] result     // 8-bit result of the operation
    // Note: Carry/Overflow flags are not explicitly generated as outputs 
    // in the basic SAP-1 design, but could be added if needed.
);

    // This module is combinational. The output 'result' updates whenever 
    // any of the inputs (in_a, in_b, subtract) change.

    // Use a continuous assignment with a ternary operator:
    // If 'subtract' is 1, perform subtraction (in_a - in_b).
    // If 'subtract' is 0, perform addition (in_a + in_b).
    assign result = sub ? (in_a - in_b) : (in_a + in_b);

endmodule
```

### 6. Memory
The Basys 3 board contains a 32Mbit non-volatile serial Flash device, which is attached to the Artix-7 FPGA using a dedicated quad-mode (x4) SPI bus.
An Artix-7 35T configuration file requires just over two Mbytes of memory, leaving approximately 48% of the flash device available for user data.

The SAP-1 has **16 bytes** of memory which is small enough that it can be defined directly inside of the FPGA.

There is a 4-bit register called the **Memory Address Register (MAR)** which is used to store a memory address. The SAP-1 takes two clock cycles to read from memory: one cycle loads an address from the bus into the MAR (using the **load** signal) and the second cycle uses the value in the MAR to address into **ram** and output that value onto the bus.

The **initial** block is used to initialize the memory by loading its contents from a file which is an easy way to set the memory. The file has sixteen lines where each line represents a byte of memory.

```verilog
// SAP-1 Memory Module (16 Bytes with MAR)

module memory (
    input         clk,    // Clock input
    input         rst,    // Synchronous reset input
    input         load,   // Load enable for Memory Address Register (MAR)
    input  [7:0]  bus,    // Input bus (provides address for MAR on bits 3:0)
    output [7:0]  out     // Data output from RAM location pointed to by MAR
);

    // Declare the 16-byte x 8-bit RAM using registers
    // Addressable from 0 (0x0) to 15 (0xF)
    reg [7:0] ram [0:15];

    // Declare the 4-bit Memory Address Register (MAR)
    reg [3:0] mar;

    // Initialize memory content from an external file at power-up/simulation start
    // Create a file named "memory.hex" (or .bin) in your project directory.
    // It should contain 16 lines, each with an 8-bit hex (or binary) value.
    initial begin
        // Use $readmemh for a hex file (e.g., "memory.hex")
        // Use $readmemb for a binary file (e.g., "memory.bin")
        // Example: $readmemh("memory.hex", ram); 
        
        // For testing without a file, you can initialize manually:
         ram[0] = 8'h01; // Example instruction LDA 15
         ram[1] = 8'h0F;
         ram[2] = 8'h11; // Example instruction ADD 14
         ram[3] = 8'h0E; 
         // ... initialize other locations up to ram[15] ...
         ram[14] = 8'h10; // Example data 16
         ram[15] = 8'h20; // Example data 32
         // Ensure all 16 locations are defined if using manual init
    end

    // MAR Logic: Load address bits from bus when 'load' is high
    always @(posedge clk) begin
        if (rst) begin
            // Reset MAR to 0 on reset
            mar <= 4'b0000;
        end else if (load) begin
            // Load the lower 4 bits from the bus into the MAR
            // Assuming address is placed on bus[3:0] during MAR load cycle
            mar <= bus[3:0]; 
        end
        // If neither rst nor load is high, MAR holds its previous value.
    end

    // Memory Read Logic: Combinational read based on current MAR value
    // The output 'out' always reflects the content of the RAM at the address stored in MAR.
    // The CPU controller determines when this 'out' value is actually driven onto the main bus.
    assign out = ram[mar];

endmodule
```