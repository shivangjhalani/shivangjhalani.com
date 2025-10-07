## Clock signal
set_property -dict { PACKAGE_PIN W5   IOSTANDARD LVCMOS33 } [get_ports sys_clk]
create_clock -add -name sys_clk_pin -period 10.00 -waveform {0 5} [get_ports sys_clk]

## Switches
set_property -dict { PACKAGE_PIN V17   IOSTANDARD LVCMOS33 } [get_ports switch]

## 7-Segment Display
set_property -dict { PACKAGE_PIN W7   IOSTANDARD LVCMOS33 } [get_ports {sseg_cathode[0]}] # Segment A
set_property -dict { PACKAGE_PIN W6   IOSTANDARD LVCMOS33 } [get_ports {sseg_cathode[1]}] # Segment B
set_property -dict { PACKAGE_PIN U8   IOSTANDARD LVCMOS33 } [get_ports {sseg_cathode[2]}] # Segment C
set_property -dict { PACKAGE_PIN V8   IOSTANDARD LVCMOS33 } [get_ports {sseg_cathode[3]}] # Segment D
set_property -dict { PACKAGE_PIN U5   IOSTANDARD LVCMOS33 } [get_ports {sseg_cathode[4]}] # Segment E
set_property -dict { PACKAGE_PIN V5   IOSTANDARD LVCMOS33 } [get_ports {sseg_cathode[5]}] # Segment F
set_property -dict { PACKAGE_PIN U7   IOSTANDARD LVCMOS33 } [get_ports {sseg_cathode[6]}] # Segment G
set_property -dict { PACKAGE_PIN V7   IOSTANDARD LVCMOS33 } [get_ports {sseg_cathode[7]}] # Decimal Point

set_property -dict { PACKAGE_PIN U2   IOSTANDARD LVCMOS33 } [get_ports {sseg_anode[0]}]
set_property -dict { PACKAGE_PIN U4   IOSTANDARD LVCMOS33 } [get_ports {sseg_anode[1]}]
set_property -dict { PACKAGE_PIN V4   IOSTANDARD LVCMOS33 } [get_ports {sseg_anode[2]}]
set_property -dict { PACKAGE_PIN W4   IOSTANDARD LVCMOS33 } [get_ports {sseg_anode[3]}]

## Configuration options, can be used for all designs
set_property CONFIG_VOLTAGE 3.3 [current_design]
set_property CFGBVS VCCO [current_design]

## SPI configuration mode options for QSPI boot, can be used for all designs
set_property BITSTREAM.GENERAL.COMPRESS TRUE [current_design]
set_property BITSTREAM.CONFIG.CONFIGRATE 33 [current_design]
set_property CONFIG_MODE SPIx4 [current_design]
