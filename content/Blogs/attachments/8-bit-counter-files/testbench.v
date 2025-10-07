`timescale 1ns / 1ps
module top_tb;
    // Inputs
    reg switch;
    reg sys_clk;

    // Outputs
    wire [7:0] sseg_cathode;
    wire [3:0] sseg_anode;

    // Internal signals for debugging
    wire counter_clk;
    wire [7:0] count;

    // Instantiate the top module
    top uut (
        .switch(switch),
        .sys_clk(sys_clk),
        .sseg_cathode(sseg_cathode),
        .sseg_anode(sseg_anode)
    );

    // Access internal signals (for simulation only)
    assign counter_clk = uut.counter_clk;
    assign count = uut.count;

    // Clock generation (100MHz, 10ns period)
    initial begin
        sys_clk = 0;
        forever #5 sys_clk = ~sys_clk;
    end

    // Test stimulus
    initial begin
        switch = 0;
        #100;
        switch = 1;
        #1000000000; // 1 second
        switch = 0;
        #100000000;
        $finish;
    end

    // Monitor outputs
    initial begin
        $monitor("Time=%0t switch=%b counter_clk=%b count=%d sseg_cathode=%b sseg_anode=%b",
                 $time, switch, counter_clk, count, sseg_cathode, sseg_anode);
    end
endmodule
