`timescale 1ns / 1ps
module seven_segment_controller (
    input wire clk,              // 10kHz refresh clock
    input wire [3:0] ones,       // BCD ones digit
    input wire [3:0] tens,       // BCD tens digit
    input wire [3:0] hundreds,   // BCD hundreds digit
    input wire [3:0] thousands,  // BCD thousands digit
    output reg [7:0] cathode,    // 7-segment cathode signals (active low)
    output reg [3:0] anode       // 7-segment anode signals (active low)
);
    reg [1:0] digit_select = 0;  // Selects which digit to display (0 to 3)
    reg [3:0] current_digit;     // Current BCD digit to display

    // Refresh the display at 10kHz (cycle through digits)
    always @(posedge clk) begin
        digit_select <= digit_select + 1; // Cycle through 0 to 3
    end

    // Select the current digit and set the anode
    always @(*) begin
        case (digit_select)
            2'd0: begin
                current_digit = ones;
                anode = 4'b1110; // Enable ones digit (active low)
            end
            2'd1: begin
                current_digit = tens;
                anode = 4'b1101; // Enable tens digit
            end
            2'd2: begin
                current_digit = hundreds;
                anode = 4'b1011; // Enable hundreds digit
            end
            2'd3: begin
                current_digit = thousands;
                anode = 4'b0111; // Enable thousands digit
            end
            default: begin
                current_digit = 4'b0000;
                anode = 4'b1111; // All off
            end
        endcase
    end

    // Convert BCD to 7-segment cathode (active low)
    always @(*) begin
        case (current_digit)
            4'd0: cathode = 8'b11000000; // 0
            4'd1: cathode = 8'b11111001; // 1
            4'd2: cathode = 8'b10100100; // 2
            4'd3: cathode = 8'b10110000; // 3
            4'd4: cathode = 8'b10011001; // 4
            4'd5: cathode = 8'b10010010; // 5
            4'd6: cathode = 8'b10000010; // 6
            4'd7: cathode = 8'b11111000; // 7
            4'd8: cathode = 8'b10000000; // 8
            4'd9: cathode = 8'b10010000; // 9
            default: cathode = 8'b11111111; // Off
        endcase
    end
endmodule