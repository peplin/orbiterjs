/**
** Rocket Launch Simulator
** Christopher Peplin
** University of Michigan - AOSS 101 - W09
** 3/12/09
**
** Fuel class
**
** This class stores the parameters of the fuel and throttle position, as
** defined by the user and the current timestep. 
**
** Functions of interest for their scientific value are:
**    * getThrust
**    * burn
**
** NOTE: I make an assumption here, pending further scientific inquiry, that the
** mass flow rate of the fuel is modified to change the power of the rocket.
** This seems more plausible to me than changing the exit velocity, but if
** incorrect could be modified farily simply in this class.
*/
class Fuel {
    int mExitVelocityMPerS;
    int mFlowRateKgPerS;
    int mAmountKg;
    int mMinimumThrustAltitudeM;
    int mMinimumThrustPercentage;
    float mCurrentThrottle;

    Fuel(int exitVelocity, int flowRate, int amount,
            int minimumThrustAltitude, int minimumThrustPercentage) {
        mExitVelocityMPerS = exitVelocity;
        mFlowRateKgPerS = flowRate;
        mAmountKg = amount;
        mMinimumThrustAltitudeM = minimumThrustAltitude;
        mMinimumThrustPercentage = minimumThrustPercentage;
    }

    int getThrust(int altitude) {
        if(mAmountKg > 0) {
            mCurrentThrottle = constrain(map(altitude, 0,
                    mMinimumThrustAltitudeM, 100, mMinimumThrustPercentage),
                mMinimumThrustPercentage, 100);
            int throttledFlowRate = (int)((mCurrentThrottle / 100)
                    * mFlowRateKgPerS);
            return mExitVelocityMPerS * min(throttledFlowRate, mAmountKg);
        } else {
            return 0;
        }
    }

    int getAmount() {
        return mAmountKg;
    }

    void setExitVelocity(int exitVelocity) {
        mExitVelocityMPerS = exitVelocity;
    }

    void setFlowRate(int flowRate) {
        mFlowRateKgPerS = flowRate;
    }

    int getMaximumThrust() {
        return mExitVelocityMPerS * mFlowRateKgPerS;
    }

    int getExitVelocity() {
        return mExitVelocityMPerS;
    }

    void setAmount(int amount) {
        mAmountKg = amount;
    }

    // burn for 1 second (1 timestep)
    int burn(int altitude) {
        int thrust = 0; 
        if(mAmountKg > 0) {
            thrust = getThrust(altitude);
            mAmountKg -= min((float)((mCurrentThrottle / 100)
                            * mFlowRateKgPerS), mAmountKg);
        }
        return thrust;
    }
}

/**
** Rocket Launch Simulator
** Christopher Peplin
** University of Michigan - AOSS 101 - W09
** 3/12/09
**
** Graph class
**
** This is a somewhat "dumb" class that stores data to be graphed and includes a
** simple display function to draw the graph to the screen. The x scale
** currently scales with time (it is always 0 to the current timestep). That can
** be modified easily if more consistent graphs are required while the simulator
** is doing a run.
**
** There are no functions of scientific interest.
**
*/
class Graph {
    int mZeroX;
    int mZeroY;
    int mMin;
    int mMax;
    ArrayList mData;
    String mName;

    public Graph(String name, int zeroX, int zeroY, int min, int max) {
        mZeroX = zeroX;
        mZeroY = zeroY;
        mMin = min;
        mMax = max;
        mName = name;

        mData = new ArrayList();
    }

    public float get(int timestep) {
        return ((Number)mData.get(timestep)).floatValue();
    }

    public String getName() {
        return mName;
    }

    public void clear() {
        mData.clear();

    }

    public void add(double value) {
        mData.add(value);
    }

    public void setMax(int max) {
        mMax = max;
    }

    public void display(int timestep) {
        pushMatrix();
        stroke(255);
        translate(mZeroX, mZeroY);
        line(0, 0, 0, -100);
        line(0, 0, 100, 0);

        pushMatrix();
        textAlign(RIGHT);
        translate(-5, -90);
        text(mMax, 0, 0);
        popMatrix();

        pushMatrix();
        textAlign(RIGHT);
        translate(-5, 0);
        text(mMin, 0, 0);
        popMatrix();

        pushMatrix();
        textAlign(CENTER);
        translate(-5, -50);
        rotate(radians(-90));
        text(mName, 0, 0);
        popMatrix();

        Iterator it = mData.iterator();
        int time = 0;
        noFill();
        beginShape();
        while(it.hasNext()) {
            float value = map(((Number)it.next()).floatValue(), mMin, mMax, 0, 100);
            vertex(map((float)time++, 0, timestep, 0, 80), -constrain(value, 0, 100));
        }
        endShape();
        popMatrix();
    }
}

/**
** Rocket Launch Simulator
** Christopher Peplin
** University of Michigan - AOSS 101 - W09
** 3/12/09
**
** Planet class
**
** This class stores the parameters of the planet which the rocket is launching
** from as specified by the user. It was created in antiticipation of wanting to
** simulate launch from various planets, and the desire to have those parameters
** stored within the simulator (allowing single click access to change the
** planet). As of now, only Earth is available (and its parameters are provided
** in RocketSimulator.pde)
**
** Functions of interest for their scientific value are:
**    * getAtmosphereMassDensity
*/
class Planet {
    private String mName;
    private double mGravity;
    private double mBaseAtmosphereMassDensity;

    Planet(String name, double gravity, double atmosphereDensity) {
        mName = name;
        mGravity = gravity;
        mBaseAtmosphereMassDensity = atmosphereDensity;
    }

    public void display() {
        pushMatrix();
        translate(width / 2, LAUNCHPAD_Y);
        ellipse(0, height/10 * 5, width * 2, width);
        popMatrix();
    }

    public void setGravity(double gravity) {
        mGravity = gravity;
    }

    public void setBaseAtmosphereMassDensity(double density) {
        mBaseAtmosphereMassDensity = density;
    }

    public void setName(String name) {
        mName = name;
    }

    public double getGravity() {
        return mGravity;
    }

    public double getAtmosphereMassDensity(double altitude) {
        return  mBaseAtmosphereMassDensity * exp((float)(-altitude / 10000));
    }

    public String getName() {
        return mName;
    }
}

/**
** Rocket Launch Simulator
** Christopher Peplin
** University of Michigan - AOSS 101 - W09
** 3/12/09
**
** Rocket class
**
** This class stores the parameters of the rocket and its desired trajectory, as
** defined by the user. A new Rocket object is constructed for each run.
**
** Functions of interest for their scientific value are:
**    * doTimestep
*/
class Rocket {
    int mDestinationAltitudeM;
    int mDestinationVelocityMPerS; // x velocity
    int mVelocityXMPerS;
    int mVelocityYMPerS;
    double mAccelerationXMPerS;
    double mAccelerationYMPerS;
    int mMassKg;
    double mFootprintM2;
    double mDragCoefficient;
    Fuel mFuel;
    int mAltitudeM;
    int mEarthPositionM;
    int mTurnBeginAltitudeM;
    int mTurnFinishAltitudeM;
    double mAngle;

    Rocket(int mass, double footprint, Fuel fuel,
            int destinationAltitude, int destinationVelocity, 
            double dragCoefficient, int turnBeginAltitude, int
            turnFinishAltitude) {
        mMassKg = mass;
        mFootprintM2 = footprint;
        mFuel = fuel;
        mDestinationAltitudeM = destinationAltitude;
        mDestinationVelocityMPerS = destinationVelocity;
        mDragCoefficient = dragCoefficient;
        mTurnBeginAltitudeM = turnBeginAltitude;
        mTurnFinishAltitudeM = turnFinishAltitude;
    }

    void display() {
        pushMatrix();
        fill(255);
        translate(LAUNCHPAD_X + map(mEarthPositionM,
                    -mDestinationAltitudeM * 2,
                    mDestinationAltitudeM * 2, -width/2, width/2), 
                map((float)mAltitudeM, 0, (float)mDestinationAltitudeM * 2,
                LAUNCHPAD_Y, ORBIT_Y) + 15);
        rotate(radians((float)mAngle));
        translate(0, -15);
        rect(0, 0, 10, 30);
        pushMatrix();
        translate(5, 0);
        triangle(-5, 0, 5, 0, 0, -10); 
        popMatrix();
        pushMatrix();
        translate(0, 30);
        beginShape();
        vertex(0, 0);
        vertex(10, 0);
        vertex(15, 10);
        vertex(-5, 10);
        endShape();
        if(simulationRunning && mFuel.getThrust(mAltitudeM) > 0) {
            int angle = 20;
            pushMatrix();
            translate(5, 20);
            for(int i = -5; i < 8; i++) {
                pushMatrix();
                if(i % 2 == 0) {
                    fill(204, 102, 0);
                    stroke(204, 102, 0);
                } else {
                    fill(178, 34, 34);
                    stroke(178, 34, 34);
                }
                rotate(radians(angle));
                angle -= 4;
                ellipse(i, 0, 1, -15);
                popMatrix();

            }
            popMatrix();
        }
        popMatrix();
        popMatrix();

        fill(255);
        text(mFuel.getAmount(), 255, height - 13);
        text(mAltitudeM, 400, height - 13);
        text(abs(mVelocityXMPerS), 570, height - 13);
        text(abs(mVelocityYMPerS), 610, height - 13);
    }

    void doTimestep() {
        double previousAltitude = mAltitudeM;
        double angleFromCenter; 
        if(mEarthPositionM == 0) {
            angleFromCenter = 0;
        } else {
            angleFromCenter = atan(mAltitudeM / mEarthPositionM);
        }
        int totalThrust = getFuel().burn(getAltitude()); //subtracts mass
        double thrustX = sin(radians((float)mAngle)) * totalThrust;
        double thrustY = cos(radians((float)mAngle)) * totalThrust;

        /** TODO this isn't quite right...not sure how to simulate
        ** gravity in a certain direction. we don't want to slow down
        ** horizontal velocity, but it's tricky since "horizontal"
        ** changes meaning as you travel across the planet */
        //double gravityXN = sin(radians((float) angleFromCenter)) * 
        //       ((Planet)(planetMap.get(currentPlanetId))).getGravity()
         //      * rocket.getTotalMass();
         //
        //double gravityYN = cos(radians((float) angleFromCenter)) * 
        //        ((Planet)(planetMap.get(currentPlanetId))).getGravity()
        //        * rocket.getTotalMass();
        double gravityXN = 0;
        double gravityYN =  
                ((Planet)(planetMap.get(currentPlanetId))).getGravity()
                * getTotalMass();

        double dragXN = .5
                * ((Planet)(planetMap.get(currentPlanetId)))
                    .getAtmosphereMassDensity(getAltitude())
                * pow((float)getHorizontalVelocity(), 2)
                * getDragCoefficient() // this is not accurate - different for x 
                * getFootprint();
        double dragYN = .5
                * ((Planet)(planetMap.get(currentPlanetId)))
                    .getAtmosphereMassDensity(getAltitude())
                * pow((float)getVerticalVelocity(), 2)
                * getDragCoefficient()
                * getFootprint();

        if(getVerticalVelocity() < 0) {
            dragYN *= -1; // reverse drag force if falling
        }

        mAccelerationXMPerS = (thrustX - gravityXN - dragXN) / getTotalMass();
        mAccelerationYMPerS = (thrustY - gravityYN - dragYN) / getTotalMass();

        // very small negative drag gets set to -1, which lowers
        // horizontal velocity too quickly
        mVelocityXMPerS += ceil((float)mAccelerationXMPerS);
        mVelocityYMPerS += mAccelerationYMPerS;

        mEarthPositionM += mVelocityXMPerS;
        mAltitudeM += mVelocityYMPerS;

        if(mAltitudeM <= 0 && previousAltitude == 0 && getVerticalVelocity() < 0) {
            // falling, not sitting on the ground
            // fake upward force of ground
            mAltitudeM = 0;
            mVelocityYMPerS = 0;
        }

        if(mAltitudeM > mTurnBeginAltitudeM) {
            // begin linear tip of rocket
            mAngle = max((float)mAngle,  
                constrain(map(mAltitudeM, mTurnBeginAltitudeM, mTurnFinishAltitudeM, 0, 90), 0, 90));
        }

        if((previousAltitude > 0 && mAltitudeM <= 0))
            simulationRunning = false;
    }

    double getHorizontalAcceleration() {
        return mAccelerationXMPerS;
    }

    double getVerticalAcceleration() {
        return mAccelerationYMPerS;
    }

    int getTotalMass() {
        return mMassKg + mFuel.getAmount();
    }

    int getEmptyMass() {
        return mMassKg;
    }

    double getFootprint() {
        return mFootprintM2;
    }

    int getHorizontalVelocity() {
        return mVelocityXMPerS;
    }

    int getVerticalVelocity() {
        return mVelocityYMPerS;
    }

    double getDragCoefficient() {
        return mDragCoefficient;
    }

    Fuel getFuel() {
        return mFuel;
    }

    int getAltitude() {
        return mAltitudeM;   
    }

    void setEmptyMass(int mass) {
        mMassKg = mass;
    }

    void setDestinationAltitude(int altitude) {
        mDestinationAltitudeM = altitude;
    }

    void setDestinationVelocity(int velocity) {
        mDestinationVelocityMPerS = velocity;
    }

    int getDestinationAltitude() {
        return mDestinationAltitudeM;
    }

    int getDestinationVelocity() {
        return mDestinationVelocityMPerS;
    }

    void setFootprint(int footprint) {
        mFootprintM2 = footprint;
    }
    
    void setDragCoefficient(int coefficient) {
        mDragCoefficient = coefficient;
    }

    void setFuel(Fuel fuel) {
        mFuel = fuel;
    }
}

/**
** Rocket Launch Simulator
** Christopher Peplin
** University of Michigan - AOSS 101 - W09
** 3/12/09
**
** This program is a launch simulator that takes into account the following
** forces acting on a launch vehicle:
**    * Thrust
**    * Drag
**    * Gravity
**
** The user can control many parameters for the launch vehicle and its flight
** pattern. These include:
**    * Final desired altitude (used to scale the screen and for graph labels)
**    * Final desired velocity (used for graph labels and rough fuel estimation)
**    * Empty rocket mass
**    * Area of rocket that will experience drag (vertical only)
**    * Drag coefficient of rocket
**    * Fuel
**     * Exit velocity
**     * Maximum flow rate
**     * Amount of fuel
**     * Minimum throttle (controls flow rate)
**     * Altitude at which to reach the minimum throttle (100% throttle at
**       start)
**    * Altitude at which to begin turn to 90 degrees (for orbit)
**    * Altitude at which to complete the 90 degree turn
**
** If the user leaves the amount of fuel field empty and clicks "Save,"
** the simulator will use the Tsiolkovsky rocket equation to give a rough
** low-end estimate at the amount of fuel required to reach the desired velocity
** with the given rocket mass and fuel exit velocity. This calculation is a 
** ROUGH minimum estimate, and doesn't take into account the turn to 90 degrees
** for orbit or atmospheric drag.
**
** The graphs use a variable x scale - the scale always goes from 0 to the
** current timestep, in order to show the most interest fluctuations in 
** great detail early and also show the entire run at the finish.
**
** There are two buttons for loading preset values for the scenarios described
** in the assignment:
**    * "Load LEO" - 450km orbit at ~7600m/s
**    * "Load Ballistic" - 100km apogee at ~1000m/s
**
** This file defines the graphical look of the simulator, and sets up all of the
** required components for each run. Functions of interest for their scientific
** value are:
**    * calculateFuelRequired
*/

import controlP5.Button;
import controlP5.Textfield;
import controlP5.Textlabel;
import controlP5.ScrollList;

/** Screen Constants **/
int LAUNCHPAD_X;
int LAUNCHPAD_Y;
final int ORBIT_Y = 50;

boolean simulationRunning = false;
int timestep = 0;
int currentPlanetId = 1;
int startingMass;

Rocket rocket;
HashMap planetMap;

Textfield destinationAltitudeField;
Textfield destinationVelocityField;
Textfield rocketMassField;
Textfield rocketFootprintField;
Textfield rocketDragCoefficientField;
Textfield fuelExitVelocityField;
Textfield fuelFlowRateField;
Textfield fuelAmountField;
Textfield turnBeginAltitudeField;
Textfield turnFinishAltitudeField;
Textfield minimumThrustAltitudeField;
Textfield minimumThrustPercentageField;

Textlabel fuelLabel;
Textlabel altitudeLabel;
Textlabel velocityLabel;

Graph gravityGraph;
Graph thrustGraph;
Graph dragXGraph;
Graph dragYGraph;
Graph accelerationXGraph;
Graph accelerationYGraph;
Graph velocityXGraph;
Graph velocityYGraph;
Graph altitudeGraph;
Graph massGraph;

void setup() {
    size(800, 800);
    LAUNCHPAD_X = width / 5;
    LAUNCHPAD_Y = height - 80;

    accelerationXGraph = new Graph("accel X", width - 240, 110, -100, 100);
    accelerationYGraph = new Graph("accel Y", width - 110, 110, -20, 20);
    velocityXGraph = new Graph("vel X", width - 240, 230, 0, 0);
    velocityYGraph = new Graph("vel Y", width - 110, 230, 0, 0);
    dragXGraph = new Graph("drag X", width - 240, 350, 0, 175000);
    dragYGraph = new Graph("drag Y", width - 110, 350, 0, 175000);
    gravityGraph = new Graph("grav", width - 240, 470, 0, 0);
    massGraph = new Graph("mass", width - 110, 470, 0, 0);
    thrustGraph = new Graph("thrust", width - 240, 590, 0, 0);
    altitudeGraph = new Graph("alt", width - 110, 590, 0, 0);

    planetMap = new HashMap();
    planetMap.put(1, new Planet("Earth", 9.822, 1.293));

    fuelLabel = controlP5.addTextlabel(
            "fuelLabel", "", 150, height - 20);
    altitudeLabel = controlP5.addTextlabel(
            "altitudeLabel", "Altitude (m)", 310, height - 20);
    velocityLabel = controlP5.addTextlabel(
            "velocityLabel", "Velocity (X Y) (m/s)", 450, height - 20);
    
    destinationAltitudeField = controlP5.addTextfield(
            "destinationAltitude", 10, 10, 120, 20);
    destinationAltitudeField.setLabel("Final Altitude (km)");
    destinationVelocityField = controlP5.addTextfield(
            "destinationVelocity", 10, 50, 120, 20);
    destinationVelocityField.setLabel("Final Velocity (km/s)");
    rocketMassField = controlP5.addTextfield("rocketMass", 10, 90, 120, 20);
    rocketMassField.setLabel("Empty Rocket Mass (kg)");
    rocketFootprintField = controlP5.addTextfield(
            "rocketFootprint", 10, 130, 120, 20);
    rocketFootprintField.setLabel("Rocket Drag Footprint (m^2)");
    rocketDragCoefficientField = controlP5.addTextfield(
            "rocketDragCoefficient", 10, 170, 120, 20);
    rocketDragCoefficientField.setLabel("Rocket Drag Coeff.");
    fuelExitVelocityField = controlP5.addTextfield("fuelExitVelocity", 10, 210, 120, 20);
    fuelExitVelocityField.setLabel("Fuel Exit Velocity (m/s)");
    fuelFlowRateField = controlP5.addTextfield("fuelFlowRate", 10, 250, 120, 20);
    fuelFlowRateField.setLabel("Fuel Flow Rate (kg/s)");
    fuelAmountField = controlP5.addTextfield("fuelAmount", 10, 290, 120, 20);
    fuelAmountField.setLabel("Amount of Fuel (kg)");
    turnBeginAltitudeField = controlP5.addTextfield("turnBeginAltitude", 10, 330, 120, 20);
    turnBeginAltitudeField.setLabel("Turn Start Altitude (m)");
    turnFinishAltitudeField = controlP5.addTextfield("turnFinishAltitude", 10, 370, 120, 20);
    turnFinishAltitudeField.setLabel("Turn Finish Altitude (m)");
    minimumThrustAltitudeField = 
            controlP5.addTextfield("minimumThrustAltitude", 10, 410, 120, 20);
    minimumThrustAltitudeField.setLabel("Minimum Thrust Altitude (m)");
    minimumThrustPercentageField =
        controlP5.addTextfield("minimumThrustPercentage", 10, 450, 120, 20);
    minimumThrustPercentageField.setLabel("Minimum Thrust Percentage");

    ScrollList list = controlP5.addScrollList("planet", 10, 500, 120, 100);
    Iterator it = planetMap.entrySet().iterator();
    while(it.hasNext()) {
        Map.Entry entry = (Map.Entry) it.next();
        Planet p = (Planet) entry.getValue();
        list.addItem(p.getName(), (Integer) entry.getKey());
    }

    Button button = controlP5.addButton("reset", 0, 10, 530, 120, 20);
    button.setLabel("Save Values & Reset Sim");
    button = controlP5.addButton("playPause", 2, 10, 560, 120, 20);
    button.setLabel("Play/Pause");
    button = controlP5.addButton("loadBallistic", 2, 10, 590, 120, 20);
    button.setLabel("Load Ballistic Missile");
    button = controlP5.addButton("loadOrbit", 2, 10, 620, 120, 20);
    button.setLabel("Load LEO");
    button = controlP5.addButton("save", 2, 10, 700, 120, 20);
    button.setLabel("Save Run to CSV");

    loadOrbit(0);
    reset(0);
}

void draw() {
    background(0);
    pushMatrix();
    fill(255);
    stroke(255);
    text(timestep, width - 20, 10);
    popMatrix();
    if(simulationRunning) {
        doTimestep();
    }

    fuelLabel.draw(this);
    altitudeLabel.draw(this);
    velocityLabel.draw(this);

    drawGraphs();
    ((Planet)(planetMap.get(currentPlanetId))).display();
    rocket.display();
}

public void save(int value) {
    PrintWriter output;
    String savePath = selectOutput();
    if(savePath != null) {
        output = createWriter(savePath);

        output.print("time\t");
        output.print(accelerationXGraph.getName() + "\t");
        output.print(accelerationYGraph.getName() + "\t");
        output.print(velocityXGraph.getName() + "\t");
        output.print(velocityYGraph.getName() + "\t");
        output.print(dragXGraph.getName() + "\t");
        output.print(dragYGraph.getName() + "\t");
        output.print(gravityGraph.getName() + "\t");
        output.print(massGraph.getName() + "\t");
        output.print(thrustGraph.getName() + "\t");
        output.print(altitudeGraph.getName() + "\t\n");

        for(int i = 0; i < timestep; i++) {
            output.print(i + "\t");
            output.print(accelerationXGraph.get(i) + "\t");
            output.print(accelerationYGraph.get(i) + "\t");
            output.print(velocityXGraph.get(i) + "\t");
            output.print(velocityYGraph.get(i) + "\t");
            output.print(dragXGraph.get(i) + "\t");
            output.print(dragYGraph.get(i) + "\t");
            output.print(gravityGraph.get(i) + "\t");
            output.print(massGraph.get(i) + "\t");
            output.print(thrustGraph.get(i) + "\t");
            output.print(altitudeGraph.get(i) + "\t\n");
        }
        
        output.flush();
        output.close();
    }
}

public void reset(int value) {
    simulationRunning = false;
    timestep = 0;
    if(fuelAmountField.getText().equals("")) {
        fuelAmountField.setValue("" + calculateFuelRequired());
    }
    rocket = new Rocket(Integer.valueOf(rocketMassField.getText()),
            Double.valueOf(rocketFootprintField.getText()),
            new Fuel(Integer.valueOf(fuelExitVelocityField.getText()),
                    Integer.valueOf(fuelFlowRateField.getText()),
                    Integer.valueOf(fuelAmountField.getText()),
                    Integer.valueOf(minimumThrustAltitudeField.getText()),
                    Integer.valueOf(minimumThrustPercentageField.getText())),
            Integer.valueOf(destinationAltitudeField.getText()) * 1000,
            Integer.valueOf(destinationVelocityField.getText()),
            Double.valueOf(rocketDragCoefficientField.getText()),
            Integer.valueOf(turnBeginAltitudeField.getText()),
            Integer.valueOf(turnFinishAltitudeField.getText()));
    massGraph.setMax(rocket.getTotalMass());
    gravityGraph.setMax(rocket.getTotalMass() * 20);

    gravityGraph.clear();
    thrustGraph.clear();
    dragXGraph.clear();
    dragYGraph.clear();
    accelerationXGraph.clear();
    accelerationYGraph.clear();
    velocityXGraph.clear();
    velocityYGraph.clear();
    altitudeGraph.clear();
    massGraph.clear();
}

public void loadBallistic(int value) {
    destinationAltitudeField.setValue("" + 100);
    destinationVelocityField.setValue("" + 1500);
    rocketMassField.setValue("" + 2000);
    rocketFootprintField.setValue("" + 2);
    rocketDragCoefficientField.setValue("" + .6);
    fuelExitVelocityField.setValue("" + 3000);
    fuelFlowRateField.setValue("" + 200);
    fuelAmountField.setValue("" + 5200);
    turnBeginAltitudeField.setValue("" + 10000);
    turnFinishAltitudeField.setValue("" + 100000);
    minimumThrustAltitudeField.setValue("" + 24750);
    minimumThrustPercentageField.setValue("" + 5);
    reset(0);
}

public void loadOrbit(int value) {
    destinationAltitudeField.setValue("" + 450);
    destinationVelocityField.setValue("" + 7600);
    rocketMassField.setValue("" + 2000);
    rocketFootprintField.setValue("" + 2);
    rocketDragCoefficientField.setValue("" + .6);
    fuelExitVelocityField.setValue("" + 3500);
    fuelFlowRateField.setValue("" + 250);
    fuelAmountField.setValue("" + 45000);
    turnBeginAltitudeField.setValue("" + 10000);
    turnFinishAltitudeField.setValue("" + 450000);
    minimumThrustAltitudeField.setValue("" + 95000);
    minimumThrustPercentageField.setValue("" + 23);
    reset(0);
}

public void playPause(int value) {
    simulationRunning = !simulationRunning;
}

public void planet(int value) {
    currentPlanetId = value;
}

int calculateFuelRequired() {
    // Tsiolkovsky rocket equation
    int exitVelocity = Integer.valueOf(fuelExitVelocityField.getText());
    int m1 = Integer.valueOf(rocketMassField.getText());
    int deltaV = Integer.valueOf(destinationVelocityField.getText());
    double m0 = m1 * exp(deltaV / exitVelocity);
    return (int)(m0 - m1);
}

void drawGraphs() {
    accelerationXGraph.display(timestep);
    accelerationYGraph.display(timestep);
    altitudeGraph.setMax(rocket.getDestinationAltitude());
    altitudeGraph.display(timestep);
    velocityXGraph.setMax(rocket.getDestinationVelocity());
    velocityXGraph.display(timestep);
    velocityYGraph.setMax(rocket.getDestinationVelocity());
    velocityYGraph.display(timestep);
    massGraph.display(timestep);
    gravityGraph.display(timestep);
    thrustGraph.setMax(rocket.getFuel().getMaximumThrust());
    thrustGraph.display(timestep);
    dragXGraph.display(timestep);
    dragYGraph.display(timestep);
}

void doTimestep() {
    timestep++;
    altitudeGraph.add(rocket.getAltitude());
    gravityGraph.add(((Planet)(planetMap.get(currentPlanetId))).getGravity()
            * rocket.getTotalMass());
    // These are calculated in Rocket, which actually uses them to determine
    // acceleration. They are duplicated here but really shouldn't be - redesign
    // the Rocket API in the next iteration so this is less clunky
    double dragXN = .5
            * ((Planet)(planetMap.get(currentPlanetId)))
                .getAtmosphereMassDensity(rocket.getAltitude())
            * pow((float)rocket.getHorizontalVelocity(), 2)
            * rocket.getDragCoefficient() // this is not accurate - different for x 
            * rocket.getFootprint();
    double dragYN = .5
            * ((Planet)(planetMap.get(currentPlanetId)))
                .getAtmosphereMassDensity(rocket.getAltitude())
            * pow((float)rocket.getVerticalVelocity(), 2)
            * rocket.getDragCoefficient()
            * rocket.getFootprint();
    dragXGraph.add(dragXN);
    dragYGraph.add(dragYN);
    velocityXGraph.add(abs(rocket.getHorizontalVelocity()));
    velocityYGraph.add(abs(rocket.getVerticalVelocity()));
    massGraph.add(rocket.getTotalMass());
    thrustGraph.add(rocket.getFuel().getThrust(rocket.getAltitude()));
    rocket.doTimestep();
    accelerationXGraph.add(rocket.getHorizontalAcceleration());
    accelerationYGraph.add(rocket.getVerticalAcceleration());
}
