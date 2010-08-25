# Rocket Launch Simulator
## Christopher Peplin
## University of Michigan - AOSS 101 - W09

* Originally written in Processing (Java) 3/12/09
* Refactored for ProcessingJS - 8/24/10

This program is a launch simulator that takes into account the following
forces acting on a launch vehicle:

* Thrust
* Drag
* Gravity

The user can control many parameters for the launch vehicle and its flight
pattern. These include:

* Final desired altitude (used to scale the screen and for graph labels)
* Final desired velocity (used for graph labels and rough fuel estimation)
* Empty rocket mass
* Area of rocket that will experience drag (vertical only)
* Drag coefficient of rocket
* Fuel
    * Exit velocity
    * Maximum flow rate
    * Amount of fuel
    * Minimum throttle (controls flow rate)
    * Altitude at which to reach the minimum throttle (100% throttle at
        start)
* Altitude at which to begin turn to 90 degrees (for orbit)
* Altitude at which to complete the 90 degree turn

If the user leaves the amount of fuel field empty and clicks "Save,"
the simulator will use the Tsiolkovsky rocket equation to give a rough
low-end estimate at the amount of fuel required to reach the desired velocity
with the given rocket mass and fuel exit velocity. This calculation is a 
ROUGH minimum estimate, and doesn't take into account the turn to 90 degrees
for orbit or atmospheric drag.

The graphs use a variable x scale - the scale always goes from 0 to the
current timestep, in order to show the most interest fluctuations in 
great detail early and also show the entire run at the finish.

There are two buttons for loading preset values for the scenarios described
in the assignment:
* "Load Orbit" - 450km orbit at ~7600m/s
* "Load Ballistic" - 100km apogee at ~1000m/s

This file defines the graphical look of the simulator, and sets up all of the
required components for each run. Functions of interest for their scientific
value are:
* `calculateFuelRequired`
