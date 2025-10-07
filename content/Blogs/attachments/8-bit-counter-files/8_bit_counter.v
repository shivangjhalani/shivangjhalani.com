`timescale 1ns / 1ps
module counter_8bit (
    input wire clk,        // 10Hz clock
    output reg [7:0] count // 8-bit counter output
);
    initial count = 0;

    always @(posedge clk) begin
        count <= count + 1;
    end
endmodule