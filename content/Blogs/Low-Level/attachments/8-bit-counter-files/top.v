`timescale 1ns / 1ps
module top (
    input wire switch,      // Switch to enable/disable counting
    input wire sys_clk,     // 100MHz system clock
    output wire [7:0] sseg_cathode,  // 7-segment cathode
    output wire [3:0] sseg_anode     // 7-segment anode
);
    wire counter_clk;       // 10Hz clock for counter
    wire refresh_clk;       // 10kHz clock for 7-segment refresh
    wire [7:0] count;       // 8-bit counter output
    wire [11:0] bcd;        // BCD output (thousands[11:8], hundreds[7:4], tens[3:0], ones[3:0])

    // Instantiate the counter clock generator (10Hz)
    counter_clock_generator counter_clk_gen (
        .clk(sys_clk),
        .counter_clk(counter_clk)
    );

    // Instantiate the refresh clock generator (10kHz)
    refresh_clock_generator refresh_clk_gen (
        .clk(sys_clk),
        .refresh_clk(refresh_clk)
    );

    // Instantiate the 8-bit counter
    counter_8bit counter (
        .clk(switch ? counter_clk : 1'b0), // Enable counting when switch is high
        .count(count)
    );

    // Instantiate the binary-to-BCD converter
    bin2bcd bcd_converter (
        .bin(count),
        .bcd(bcd)
    );

    // Instantiate the 7-segment controller
    seven_segment_controller sseg_ctrl (
        .clk(refresh_clk),
        .ones(bcd[3:0]),
        .tens(bcd[7:4]),
        .hundreds(bcd[11:8]),
        .thousands(4'b0000), // Thousands not used (max count is 255)
        .cathode(sseg_cathode),
        .anode(sseg_anode)
    );
endmodule