`timescale 1ns / 1ps
module refresh_clock_generator (
    input wire clk,        // 100MHz input clock
    output reg refresh_clk = 0  // 10kHz output clock
);
    // For 10kHz output (50us HIGH, 50us LOW):
    // 100MHz / (2 * 10kHz) = 5,000 cycles
    // So, toggle every 5,000 cycles
    localparam div_value = 5000;

    integer counter = 0;

    always @(posedge clk) begin
        if (counter == div_value - 1)
            counter <= 0;
        else
            counter <= counter + 1;
    end

    always @(posedge clk) begin
        if (counter == div_value - 1)
            refresh_clk <= ~refresh_clk;
        else
            refresh_clk <= refresh_clk;
    end
endmodule