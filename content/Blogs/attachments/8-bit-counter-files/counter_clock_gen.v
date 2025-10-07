`timescale 1ns / 1ps
module counter_clock_generator (
    input wire clk,        // 100MHz input clock
    output reg counter_clk = 0  // 10Hz output clock
);
    localparam div_value = 5000000; // 100MHz / (2 * 10Hz) = 5,000,000 cycles
    integer counter = 0;

    always @(posedge clk) begin
        if (counter == div_value - 1)
            counter <= 0;
        else
            counter <= counter + 1;
    end

    always @(posedge clk) begin
        if (counter == div_value - 1)
            counter_clk <= ~counter_clk;
        else
            counter_clk <= counter_clk;
    end
endmodule