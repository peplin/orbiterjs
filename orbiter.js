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

    public void add(float value) {
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

        int time = 0;
        noFill();
        if(mData.size() > 0) {
            beginShape();
            for(int i = 0; i < mData.size(); i++) {
                float value = float(mData.get(i));
                float value = map(float(value), mMin, mMax, 0, 100);
                vertex(map((float)time++, 0, timestep, 0, 80), -constrain(value, 0, 100));
            }
            endShape();
        }
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
    private float mGravity;
    private float mBaseAtmosphereMassDensity;

    Planet(String name, float gravity, float atmosphereDensity) {
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

    public void setGravity(float gravity) {
        mGravity = gravity;
    }

    public void setBaseAtmosphereMassDensity(float density) {
        mBaseAtmosphereMassDensity = density;
    }

    public void setName(String name) {
        mName = name;
    }

    public float getGravity() {
        return mGravity;
    }

    public float getAtmosphereMassDensity(float altitude) {
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
    float mAccelerationXMPerS;
    float mAccelerationYMPerS;
    int mMassKg;
    float mFootprintM2;
    float mDragCoefficient;
    Fuel mFuel;
    int mAltitudeM;
    int mEarthPositionM;
    int mTurnBeginAltitudeM;
    int mTurnFinishAltitudeM;
    float mAngle;

    Rocket(int mass, float footprint, Fuel fuel,
            int destinationAltitude, int destinationVelocity, 
            float dragCoefficient, int turnBeginAltitude, int
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
        float previousAltitude = mAltitudeM;
        float angleFromCenter; 
        if(mEarthPositionM == 0) {
            angleFromCenter = 0;
        } else {
            angleFromCenter = atan(mAltitudeM / mEarthPositionM);
        }
        int totalThrust = getFuel().burn(getAltitude()); //subtracts mass
        float thrustX = sin(radians((float)mAngle)) * totalThrust;
        float thrustY = cos(radians((float)mAngle)) * totalThrust;

        /** TODO this isn't quite right...not sure how to simulate
        ** gravity in a certain direction. we don't want to slow down
        ** horizontal velocity, but it's tricky since "horizontal"
        ** changes meaning as you travel across the planet */
        //float gravityXN = sin(radians((float) angleFromCenter)) * 
        //       planet.getGravity()
         //      * rocket.getTotalMass();
         //
        //float gravityYN = cos(radians((float) angleFromCenter)) * 
        //        planet.getGravity()
        //        * rocket.getTotalMass();
        float gravityXN = 0;
        float gravityYN =  
                planet.getGravity()
                * getTotalMass();

        float dragXN = .5
                * planet
                    .getAtmosphereMassDensity(getAltitude())
                * pow((float)getHorizontalVelocity(), 2)
                * getDragCoefficient() // this is not accurate - different for x 
                * getFootprint();
        float dragYN = .5
                * planet
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

    float getHorizontalAcceleration() {
        return mAccelerationXMPerS;
    }

    float getVerticalAcceleration() {
        return mAccelerationYMPerS;
    }

    int getTotalMass() {
        return mMassKg + mFuel.getAmount();
    }

    int getEmptyMass() {
        return mMassKg;
    }

    float getFootprint() {
        return mFootprintM2;
    }

    int getHorizontalVelocity() {
        return mVelocityXMPerS;
    }

    int getVerticalVelocity() {
        return mVelocityYMPerS;
    }

    float getDragCoefficient() {
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

/** Screen Constants **/
int LAUNCHPAD_X;
int LAUNCHPAD_Y;
final int ORBIT_Y = 50;

boolean simulationRunning = false;
int timestep = 0;
int currentPlanetId = 1;
int startingMass;

Rocket rocket;
Planet planet;

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
    frameRate(30);
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

    planet = new Planet("Earth", 9.822, 1.293);

    loadOrbit(0);
    reset(0);

    $('#play_pause').click(function(event) {
        playPause();
        event.preventDefault();
    });
    $('#reset').click(function(event) {
        reset();
        event.preventDefault();
    });
    $('#ballistic').click(function(event) {
        loadBallistic();
        event.preventDefault();
    });
    $('#orbit').click(function(event) {
        loadOrbit();
        event.preventDefault();
    });
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

    text("Remaining Fuel (kg)", 170, height - 13);
    text("Altitude (m)", 340, height - 13);
    text("Velocity (X Y) (m/s)", 500, height - 13);

    drawGraphs();
    planet.display();
    rocket.display();
}

String destinationAltitudeField = "#destination_altitude";
String destinationVelocityField = "#destination_velocity";
String rocketMassField = "#rocket_mass";
String rocketFootprintField = "#rocket_footprint";
String rocketDragCoefficientField = "#rocket_drag";
String fuelExitVelocityField = "#fuel_velocity";
String fuelFlowRateField = "#fuel_flow";
String fuelAmountField = "#fuel_amount";
String turnBeginAltitudeField = "#turn_start";
String turnFinishAltitudeField = "#turn_finish";
String minimumThrustAltitudeField = "#minimum_thrust_altitude";
String minimumThrustPercentageField = "#minimum_thrust";

public void reset(int value) {
    simulationRunning = false;
    timestep = 0;
    if($(fuelAmountField).val() == "") {
        $(fuelAmountField).val(calculateFuelRequired());
    }
    rocket = new Rocket(int($(rocketMassField).val()),
            float($(rocketFootprintField).val()),
            new Fuel(int($(fuelExitVelocityField).val()),
                    int($(fuelFlowRateField).val()),
                    int($(fuelAmountField).val()),
                    int($(minimumThrustAltitudeField).val()),
                    int($(minimumThrustPercentageField).val())),
            int($(destinationAltitudeField).val()) * 1000,
            int($(destinationVelocityField).val()),
            float($(rocketDragCoefficientField).val()),
            int($(turnBeginAltitudeField).val()),
            int($(turnFinishAltitudeField).val()));
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
    $(destinationAltitudeField).val(100);
    $(destinationVelocityField).val(1500);
    $(rocketMassField).val(2000);
    $(rocketFootprintField).val(2);
    $(rocketDragCoefficientField).val(.6);
    $(fuelExitVelocityField).val(3000);
    $(fuelFlowRateField).val(200);
    $(fuelAmountField).val(5200);
    $(turnBeginAltitudeField).val(10000);
    $(turnFinishAltitudeField).val(100000);
    $(minimumThrustAltitudeField).val(24750);
    $(minimumThrustPercentageField).val(5);
    reset(0);
}

public void loadOrbit(int value) {
    $(destinationAltitudeField).val(450);
    $(destinationVelocityField).val(7600);
    $(rocketMassField).val(2000);
    $(rocketFootprintField).val(2);
    $(rocketDragCoefficientField).val(.6);
    $(fuelExitVelocityField).val(3500);
    $(fuelFlowRateField).val(250);
    $(fuelAmountField).val(45000);
    $(turnBeginAltitudeField).val(10000);
    $(turnFinishAltitudeField).val(450000);
    $(minimumThrustAltitudeField).val(95000);
    $(minimumThrustPercentageField).val(23);
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
    int exitVelocity = int($(fuelExitVelocityField).val());
    int m1 = int($(rocketMassField).val());
    int deltaV = int($(destinationVelocityField).val());
    float m0 = m1 * exp(deltaV / exitVelocity);
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
    gravityGraph.add(planet.getGravity()
            * rocket.getTotalMass());
    // These are calculated in Rocket, which actually uses them to determine
    // acceleration. They are duplicated here but really shouldn't be - redesign
    // the Rocket API in the next iteration so this is less clunky
    float dragXN = .5
            * planet
                .getAtmosphereMassDensity(rocket.getAltitude())
            * pow((float)rocket.getHorizontalVelocity(), 2)
            * rocket.getDragCoefficient() // this is not accurate - different for x 
            * rocket.getFootprint();
    float dragYN = .5
            * planet
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
