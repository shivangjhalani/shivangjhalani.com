---
title: Intro to FPGA Programming in Verilog
subtitle: https://www.youtube.com/playlist?list=PLqOe1_kmWOx33G3gOzQSajSdrTtW9shBO
date: 2025-03-29
tags:
  - verilog
  - low-level
  - embedded
comments: true
draft: false
enableToc: true
---
# What is an FPGA?
A **field-programmable gate array** (**FPGA**) is a type of configurable [integrated circuit](https://en.wikipedia.org/wiki/Integrated_circuit "Integrated circuit") that can be repeatedly programmed after manufacturing using hardware descriptive languages (Verilog in this blog).  
This re-programmable nature distinguishes FPGAs from ASICs (Application specific integrated circuits).  

FPGAs are made of a matrix of Configurable Logic Blocks (CLBs) with a mesh of reconfigurable interconnect which allows custom connection b/w different CLBs.
![[Pasted image 20250329094514.png]]

## Advantages of FPGAs
1. Faster : they can do parallel processing of signals
2. Re-programming hardware structure : no money wasted on re-manufacturing board if any error occurs.

# 1. Hello world : Switching LEDs
We do stuff in vivado : this is where we will be coding in verilog
![[Pasted image 20250329100724.png]]

Our verilog file = a source file for our project  
![[Pasted image 20250329100835.png]]

We will add design source  
![[Pasted image 20250329101130.png]]

This is what we want to create
![[Pasted image 20250329101112.png]]

```verilog
`timescale 1ns / 1ps

module top(
input switch,
output led    
);

    assign led = switch; // If switch is turned on, LED is turned on asw

endmodule
```

We now also need to tell what pin is the switch and what pin is the LED on the FPGA.  
We need to create a constraint file that will tell vivado where is the switch and where is the LED.

Add a constraint source under contraints folder
```xdc
## LED
set_property -dict { PACKAGE_PIN _empty-space-left-rn_ IOSTANDARD LVCMOS33 } [get_ports {led}];

## SWITCH
set_property -dict { PACKAGE_PIN _empty-space-left-rn_ IOSTANDARD LVCMOS33 } [get_ports {switch}];
```

`[get_ports {}]` is the i/p and o/p from the verilog code we wrote, make sure the names are exactly the same

To know the PIN, we need the schematic of the board we are using, I will be using artix7

![[ac701-schematic-xtp218-rev1-0.pdf]]

 We can see on page 8 that SW0 is at pin R8 and the LED is at pin M26
 ![[Pasted image 20250329103904.png]]
 ![[Pasted image 20250329104119.png]]
```xdc
## LED
set_property -dict { PACKAGE_PIN M26 IOSTANDARD LVCMOS33 } [get_ports {led}];

## SWITCH
set_property -dict { PACKAGE_PIN R8 IOSTANDARD LVCMOS33 } [get_ports {switch}];
```

**Now we are done!**

Now run synthesis, then run implementation, then generate bitstream from the left sidebar.  
## 1. Synthesis
![[Pasted image 20250329104504.png]]  
Let's take a look at synthesized design first.
![[Pasted image 20250329104518.png]]
![[Pasted image 20250329104746.png]]

## 2. Run Implementation
This will check if all timing requirements are met and that all FPGA pins are mapped correctly.

## 3. Generate Bitstream
Translates the implemented design into a bitstream which can be downloaded onto your FPGA board

After it is completed, open Hardware Manager.  
Make sure your board is connected to your computer, turn on the FPGA, then on the green callout in vivado on the top, click on open target and select auto connect.  

We can now program the device by clicking program device on the same callout location. This will bring a popup to load the `.bit` bitstream file onto the FPGA and now we can control the LED!

---

# 2. Using the bus : 7 Segment Display

## Design
Let's start by creating a new project in vivado. This time, we use BlackBoard (xc7z007sclg400-1) FPGA since it has inbuilt 7 segment display.  
This is the schematic, we can see there are 8 FPGA pin connections on the left side, and 4 on the right.  
![[Pasted image 20250329174703.png]]


Each digit of the 7 segment display has 8 LEDs.  
![[Pasted image 20250329174712.png]]

For each individual LED, one end is called the Anode, other, the Cathode.  

| In the schemaic, connections on the left are cathodes, and the connections on the right are anodes. | ![[Pasted image 20250329174724.png]] |
| --------------------------------------------------------------------------------------------------- | ------------------------------------ |
| ![[Pasted image 20250329174806.png]]                                                                | ![[Pasted image 20250329174755.png]] |

In order to make an LED light up, we need to create voltage difference across anode and cathode. To achieve this, we will apply 0V on base of PNP transistors which will close the switch giving anode approximately 3.3V. And on the cathode side, we apply direct 0V.  
![[Pasted image 20250329195128.png]]

## Applying to code

![[Pasted image 20250329221336.png]]

One input and 2 outputs.
```verilog
`timescale 1ns / 1ps

module top(
input wire [3:0] button, // specifying wire is not necessary, its implicitly defined already.
output wire [7:0] sseg_cathode,
output wire [3:0] sseg_anode
);

    assign sseg_anode = button; // instead of sseg_anode[0] = button[0]; sseg_anode[1] = button[1]; ...
                                // means each wire in button bus is connected to same correspoinding number in anode bus
    assign sseg_cathode = 0;    // or sseg_cathode = 8'b00000000; or sseg_cathode = 8'd0; or sseg_cathode = 8'h00;

endmodule
```

`[3:0]` before `button`, `[7:0]` and `[3:0` again are *bus*ses in verilog, its like an array which goes from 3(MSB) to 0(LSB) in binary. Its like an array, and it helps us avoid defining multiple wires separately.  
There are 4 input buttons, 8 cathode outputs and 4 anode outputs.

Now the constraint file
```xdc
#Push Buttons
set_property -dict { PACKAGE_PIN W14   IOSTANDARD LVCMOS33 } [get_ports { button[0] }]; #IO_L8P_T1_34 Schematic=BTN0
set_property -dict { PACKAGE_PIN W13   IOSTANDARD LVCMOS33 } [get_ports { button[1] }]; #IO_L4N_T0_34 Schematic=BTN1
set_property -dict { PACKAGE_PIN P15   IOSTANDARD LVCMOS33 } [get_ports { button[2] }]; #IO_L24P_T3_34 Schematic=BTN2
set_property -dict { PACKAGE_PIN M14   IOSTANDARD LVCMOS33 } [get_ports { button[3] }]; #IO_L23P_T3_35 Schematic=BTN3


#Seven Segmen Display Anodes
set_property -dict { PACKAGE_PIN K19   IOSTANDARD LVCMOS33 } [get_ports { sseg_anode[0] }]; #IO_L10P_T1_AD11P_35 Schematic=SSEG_AN0
set_property -dict { PACKAGE_PIN H17   IOSTANDARD LVCMOS33 } [get_ports { sseg_anode[1] }]; #IO_L13N_T2_MRCC_35 Schematic=SSEG_AN1
set_property -dict { PACKAGE_PIN M18   IOSTANDARD LVCMOS33 } [get_ports { sseg_anode[2] }]; #IO_L8N_T1_AD10N_35 Schematic=SSEG_AN2
set_property -dict { PACKAGE_PIN L16   IOSTANDARD LVCMOS33 } [get_ports { sseg_anode[3] }]; #IO_L11P_T1_SRCC_35 Schematic=SSEG_AN3
                                                                          
#Seven Segmen Display Cathodes                                            
set_property -dict { PACKAGE_PIN K14   IOSTANDARD LVCMOS33 } [get_ports { sseg_cathode[0] }]; #IO_L20P_T3_AD6P_35 Schematic=SSEG_CA
set_property -dict { PACKAGE_PIN H15   IOSTANDARD LVCMOS33 } [get_ports { sseg_cathode[1] }]; #IO_L19P_T3_35 Schematic=SSEG_CB
set_property -dict { PACKAGE_PIN J18   IOSTANDARD LVCMOS33 } [get_ports { sseg_cathode[2] }]; #IO_L14P_T2_AD4P_SRCC_35 Schematic=SSEG_CC
set_property -dict { PACKAGE_PIN J15   IOSTANDARD LVCMOS33 } [get_ports { sseg_cathode[3] }]; #IO_25_35 Schematic=SSEG_CD
set_property -dict { PACKAGE_PIN M17   IOSTANDARD LVCMOS33 } [get_ports { sseg_cathode[4] }]; #IO_L8P_T1_AD10P_35 Schematic=SSEG_CE
set_property -dict { PACKAGE_PIN J16   IOSTANDARD LVCMOS33 } [get_ports { sseg_cathode[5] }]; #IO_L24N_T3_AD15N_35 Schematic=SSEG_CF
set_property -dict { PACKAGE_PIN H18   IOSTANDARD LVCMOS33 } [get_ports { sseg_cathode[6] }]; #IO_L8P_T1_AD10P_35 Schematic=SSEG_CG
set_property -dict { PACKAGE_PIN K18   IOSTANDARD LVCMOS33 } [get_ports { sseg_cathode[7] }]; #IO_L12N_T1_MRCC_35 Schematic=SSEG_DP
```


> [!NOTE]
> You can get the XDC file by searching board name and finding its master.xdc online.

Now save the files and repeat the 3 step procedure showed in the switching LEDs example.  
Pro tip : Or just click on generate bit-stream directly, it does all on it's own.  
![[final.mp4]]

---

# 3. Simulating code : Testbenches in verilog
We will create an RGB LED indicator and will use vivado simulator to test the code.  
We wont be loading it on an FPGA board so doesn't matter if your board has RBG LEDs or not.  

First, let's establish a plan for dividing the 16 inputs (represented by the 4-bit switch input)
Here's the truth table:

| switch[3:0] | Decimal | red | green | blue |
| ----------- | ------- | --- | ----- | ---- |
| 0000        | 0       | 1   | 0     | 0    |
| 0001        | 1       | 1   | 0     | 0    |
| 0010        | 2       | 1   | 0     | 0    |
| 0011        | 3       | 1   | 0     | 0    |
| 0100        | 4       | 0   | 1     | 0    |
| 0101        | 5       | 0   | 1     | 0    |
| 0110        | 6       | 0   | 1     | 0    |
| 0111        | 7       | 0   | 1     | 0    |
| 1000        | 8       | 0   | 0     | 1    |
| 1001        | 9       | 0   | 0     | 1    |
| 1010        | 10      | 0   | 0     | 1    |
| 1011        | 11      | 0   | 0     | 1    |
| 1100        | 12      | 0   | 0     | 1    |
| 1101        | 13      | 0   | 0     | 1    |
| 1110        | 14      | 0   | 0     | 1    |
| 1111        | 15      | 0   | 0     | 1    |

In a new vivado project, add this verilog design source.
```verilog
`timescale 1ns / 1ps

module top(
    input [3:0] switch,
    output red,
    output green,
    output blue
);

    // Assign red when switch[3:2] = 00 (values 0-3)
    assign red = ~switch[3] & ~switch[2];
    // Assign green when switch[3:2] = 01 (values 4-7)
    assign green = ~switch[3] & switch[2];
    // Assign blue when switch[3] = 1 (values 8-15)
    assign blue = switch[3];


endmodule
```

To create a simulation file, right click `Simulation Sources` from the sources pane, and add simulation source.
![[Pasted image 20250330151127.png]]

The testbench
```verilog
`timescale 10ns / 1ps

module testbench();
// inputs, all inputs need to be a register, it retains it's values until a new value is assigned to it
reg [3:0] switch = 0; // you can only initialze registets not wires
// outputs, need to be wires
wire red;
wire green;
wire blue;

// Unit under test (UUT) : wrapper that ties the input and output of the verilog file we are simulating to the registers and wires of the testbench file.
top uut(
    .switch(switch), // .switch is from top module in verilog file, (switch) is from this simulation file
    .red(red),
    .green(green),
    .blue(blue)
);
integer k = 0;

initial
begin
    switch = 0;
    for(k=0; k<16; k=k+1)
    #10 switch = k; // Time delay (10 * 10ns) since timesacle is set is 1ns = 100ns
    
    #5 $finish;
end

endmodule
```

Now run simulation from the left sidebar, make sure you have gcc installed.
![[simulation.webm]]

Notice the values of red, green and blue changing!

---


> [!INFO] Blog ends here
> Below section is not related to FPGA or much to verilog

# 4. Logic Gates
Logic gates are devices that are used to implement boolean functions on one or more binary inputs and produces a single binary output.  
Logic circuits (circuits made of multiple logic gates DUH) can be used to make devices like encoders, multiplexers, ALUs and even whole microprocessors!  

We will go into a little bit more depth than required here at the transistor level.

> [!NOTE]
> Logic gates are made of Feild effect transistors
> ![[Pasted image 20250330142913.png]]
> 
> `pFET` is like closed switch when logic 0 is applied at the Gate, and `nFET` is like closed switch when logic 1 is applied at the Gate.  
> `pFETs` used to pass through a logic 1 and `nFETs` used to pass through a logic 0.  

## 1. Not

![[Pasted image 20250330143607.png | 400]]

Try to simulate in your head what happens when you input a 0 or a 1, you know the output already, so go ahead and think.  
I'll help you out just in case : When i/p = 1, pFET is open, and nFET is closed => output is directly connected to ground, therefore, output = 0.  
```verilog
module not_gate(a,y);
input a;
output y;

assign y = ~a;
                
endmodule
```

## 2. And
![[Pasted image 20250330144032.png| 400]]
```verilog
module and_gate(a,b,y);
input a,b;
output y;

assign y = a & b;
                
endmodule
```

## 3. Or
![[Pasted image 20250330144151.png| 400]]
```verilog
module or_gate(a,b,y);
input a,b;
output y;

assign y = a | b;
                
endmodule
```
