`timescale 1ns / 1ps
module bin2bcd (
    input wire [7:0] bin,    // 8-bit binary input
    output reg [11:0] bcd    // 12-bit BCD output (thousands[11:8], hundreds[7:4], tens[3:0], ones[3:0])
);
    reg [3:0] i;

    always @(bin) begin
        bcd = 0; // Initialize BCD to zero
        for (i = 0; i < 8; i = i + 1) begin
            bcd = {bcd[10:0], bin[7-i]}; // Shift and add binary bit (Double Dabble algorithm)

            // Add 3 if a BCD digit is greater than 4
            if (i < 7 && bcd[3:0] > 4)
                bcd[3:0] = bcd[3:0] + 3;
            if (i < 7 && bcd[7:4] > 4)
                bcd[7:4] = bcd[7:4] + 3;
            if (i < 7 && bcd[11:8] > 4)
                bcd[11:8] = bcd[11:8] + 3;
        end
    end
endmodule