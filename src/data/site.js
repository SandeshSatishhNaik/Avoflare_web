// Shared site content. Facts come from project detaild/*.md, REPO_AUDIT.md and the TAPAS simulation.

export const nav = [
  { href: '/problem/', label: 'Problem' },
  { href: '/how-it-works/', label: 'How it works' },
  { href: '/digital-twin/', label: 'Digital twin' },
  { href: '/whats-new/', label: "What's new" },
  { href: '/fault-response/', label: 'Fault response' },
  { href: '/demo/', label: 'Demo' },
  { href: '/validation/', label: 'Validation' },
  { href: '/roadmap/', label: 'Roadmap' },
  { href: '/resources/', label: 'Resources' },
];

export const glossary = {
  ETPR: 'Edge Telemetry Processing and Representation: the aircraft-side layer that turns raw CAN frames into validated, timestamped engineering values.',
  CanonicalTelemetryState: 'The single, quality-aware snapshot of every signal (value, unit, status, age, timestamp) that ETPR hands to the Edge AI.',
  CAN: 'Controller Area Network: the bus the engine control unit and sensors use to send data frames of up to 8 bytes.',
  ECU: 'Engine control unit. FADEC is the full-authority digital engine control that runs the engine.',
  PINN: 'Physics-informed neural network: a model whose training is constrained by physical equations.',
  EKF: 'Extended Kalman filter: a recursive estimator that tracks a state and its uncertainty over time.',
  SNN: 'Spiking neural network: used here to read temporal patterns such as onset, persistence and progression.',
  'QR-DQN': 'Quantile-regression deep Q-network: a reinforcement-learning model that values each possible action as a distribution of outcomes.',
  GCS: 'Ground control station: where operators fly the UAV and engineers analyse its data.',
  CAM: 'Current Aircraft Model: the up-to-date representation of this specific aircraft, its configuration and state.',
  BDI: 'Baseline + Divergence: decides whether the aircraft behaves materially differently from what is expected. It does not decide the cause.',
  EIR: 'Engineering Intelligence Repository: the knowledge, history, search and working-memory environment the ground chain draws on.',
  ACR: 'The permanent engineering repository inside EIR: engineering knowledge, aircraft history and technology knowledge.',
  PPM: 'Predictive and prescriptive maintenance: predicts degradation and proposes when and what maintenance to do.',
  RUL: 'Remaining useful life: how long a component can keep operating before it needs action.',
  EGT: 'Exhaust gas temperature.',
  CHT: 'Cylinder head temperature.',
  MALE: 'Medium Altitude Long Endurance: a UAV class flying long missions at medium altitude.',
  Sentinel: 'The assurance layer that monitors model performance and knowledge changes and controls how either may be updated.',
};

// Requirement coverage for Problem Statement 26054.
// status: 'impl' implemented in the MATLAB/Simulink work, 'partial', 'design' designed only, 'gap' not yet addressed.
export const coverage = [
  { group: 'A. Digital twin core', items: [
    { req: 'Virtual engine model synchronised with live engine data', status: 'partial', where: 'Physics engine model and healthy reference run exist; live synchronisation is designed (GCS Digital Twin, CAM).', href: '/digital-twin/' },
    { req: 'Modular architecture for future scalability', status: 'impl', where: 'Subsystem modules (environment, intake/turbo, fuel, combustion, mechanical, propulsion, flight) and a contract-driven CAN layer.', href: '/how-it-works/' },
    { req: 'Real-time data ingestion', status: 'partial', where: 'CAN encoder/decoder and frame datasets implemented; ETPR runtime designed.', href: '/how-it-works/' },
  ]},
  { group: 'B. Health monitoring', items: [
    { req: 'Engine parameters monitored (RPM, CHT, EGT, oil, fuel flow, vibration, alternator, injection timing)', status: 'partial', where: 'Six of eight are simulated signals on the CAN bus; vibration is a single level, not a signature; injection timing is not yet a signal.', href: '/problem/#sensors' },
    { req: 'Health indices for predictive maintenance', status: 'design', where: 'Designed in the GCS chain (BDI, Prognostics, PPM).', href: '/how-it-works/' },
  ]},
  { group: 'C. Fault detection and prediction', items: [
    { req: 'Misfire, injector, cooling, lubrication, sensor drift, combustion, overheating, vibration faults', status: 'partial', where: 'A 52-type fault library injects all eight classes in simulation; automated detection is the designed Edge AI chain.', href: '/problem/#faults' },
    { req: 'Move from threshold alarms to predictive diagnostics', status: 'design', where: 'Divergence from the healthy twin (BDI) instead of fixed limits; shown on simulated data.', href: '/fault-response/' },
  ]},
  { group: 'D. AI/ML layer', items: [
    { req: 'Anomaly detection algorithms', status: 'design', where: 'Edge: PINN, EKF, K-means, SNN. Ground: BDI, causal reasoning, evidence competition.', href: '/how-it-works/' },
    { req: 'Remaining useful life estimation', status: 'design', where: 'Prognostics stage; RUL is deliberately left empty in the data until a validated lifetime model exists.', href: '/validation/' },
    { req: 'Trend analysis', status: 'partial', where: 'Degradation trend across severity levels shown from simulation runs.', href: '/digital-twin/#trend' },
    { req: 'Predictive maintenance recommendations', status: 'design', where: 'PPM and Decision Engine, with engineer sign-off.', href: '/fault-response/' },
  ]},
  { group: 'E. Simulation and replay', items: [
    { req: 'Replay of historical mission data', status: 'impl', where: 'Recorded runs replay in the browser.', href: '/demo/' },
    { req: 'Environmental condition simulation', status: 'impl', where: 'ISA atmosphere, ambient temperature and density per altitude.', href: '/digital-twin/' },
    { req: 'High altitude, endurance, hot weather, rapid throttle transitions', status: 'impl', where: 'Mission profiles M03 high-altitude ISR, M10 extended endurance, M09 hot environment, M08 cold; throttle profiles per phase.', href: '/digital-twin/#missions' },
  ]},
  { group: 'F. Visualisation dashboard', items: [
    { req: 'Real-time health status, fault alerts, efficiency trends, maintenance advisory, mission reports', status: 'partial', where: 'MATLAB dashboard app and the browser replay; advisory text is an example of the designed output.', href: '/demo/' },
  ]},
];

// Requirement B parameters mapped to the simulated CAN telemetry.
export const sensors = [
  { param: 'RPM', signal: 'engine_rpm', can: '0x100 ENGINE_CRITICAL', status: 'impl', note: 'Also propeller RPM on 0x104.' },
  { param: 'Cylinder head temperature', signal: 'cht_C', can: '0x101 THERMAL', status: 'impl', note: '' },
  { param: 'Exhaust gas temperature', signal: 'egt_C', can: '0x101 THERMAL', status: 'impl', note: 'Divergence from the healthy twin is the clearest fault signal in the current runs.' },
  { param: 'Oil pressure and temperature', signal: 'oil_pressure_Pa, oil_temp_C', can: '0x101 THERMAL', status: 'impl', note: 'Oil pressure is constant in the current runs.' },
  { param: 'Fuel flow', signal: 'fuel_flow_kg_h', can: '0x103 FUEL_COMBUSTION', status: 'impl', note: 'With fuel pressure, fuel temperature and lambda.' },
  { param: 'Vibration signatures', signal: 'vibration_g', can: '0x105 MECHANICAL_VIBRATION', status: 'partial', note: 'A single vibration level today; a spectrum/signature is future work.' },
  { param: 'Battery and alternator health', signal: 'voltage_V, current_A', can: '0x106 ELECTRICAL', status: 'partial', note: 'Voltage and current exist; no health index yet.' },
  { param: 'Injection timing parameters', signal: 'none yet', can: 'none', status: 'gap', note: 'Only an ignition-timing-drift fault exists; a timing signal is future work.' },
];

// Requirement C fault classes mapped to the simulation fault library.
export const faults = [
  { cls: 'Misfire conditions', lib: 'MISFIRE', signals: 'RPM, EGT, vibration, torque' },
  { cls: 'Injector abnormalities', lib: 'INJECTOR_CLOG, INJECTOR_STICKING, INJECTOR_LEAK', signals: 'Fuel flow, fuel pressure, EGT, CHT' },
  { cls: 'Cooling degradation', lib: 'COOLANT_TEMP_HIGH, COOLANT_LEAK, INTERCOOLER_FOULING', signals: 'Coolant temperature, CHT, intake temperature' },
  { cls: 'Lubrication issues', lib: 'ENGINE_OIL_PRESSURE_LOW, ENGINE_OIL_TEMP_HIGH, GEAR_LUBRICATION_LOW', signals: 'Oil pressure, oil temperature, gearbox temperature' },
  { cls: 'Sensor drift or failure', lib: 'RPM_SENSOR_BIAS / DRIFT / NOISE / STUCK, TEMPERATURE_SENSOR_BIAS / DRIFT, PRESSURE_SENSOR_DROPOUT, VIBRATION_SENSOR_FAULT, FUEL_SENSOR_FAULT', signals: 'The affected sensor channel' },
  { cls: 'Combustion instability', lib: 'COMBUSTION_INEFFICIENCY, IGNITION_TIMING_DRIFT', signals: 'EGT, CHT, fuel flow, RPM' },
  { cls: 'Overheating trends', lib: 'ENGINE_OIL_TEMP_HIGH, COOLANT_TEMP_HIGH, GEAR_OVERHEATING, FUEL_TEMPERATURE_HIGH', signals: 'Oil, coolant, gearbox and fuel temperatures' },
  { cls: 'Abnormal vibration patterns', lib: 'EXCESSIVE_VIBRATION, TORSIONAL_VIBRATION, ENGINE_MOUNT_LOOSENING, CRANKSHAFT_IMBALANCE, PROPELLER_IMBALANCE', signals: 'Vibration, RPM, torque' },
];

export const etprStages = [
  ['CAN acquisition', 'Receive frames and keep source timing.'],
  ['Frame validation', 'Check message identity and payload length.'],
  ['Signal decoding', 'Extract bit fields, signedness and byte order.'],
  ['Physical conversion', 'Apply scale and offset into engineering units.'],
  ['Fault validation', 'Catch reserved raw fault codes.'],
  ['Range validation', 'Check each value against its configured bounds.'],
  ['Freshness', 'Compare each signal\'s age with its own timeout (three update periods).'],
  ['Temporal features', 'Deterministic delta, derivative and rolling statistics.'],
  ['Canonicalisation', 'Assemble value, status, quality, timestamp and provenance.'],
];

export const edgeChain = [
  ['PINN / Lite Digital Twin', 'Physics-informed estimate of the engine\'s current physical state.'],
  ['EKF', 'Recursive state estimate with uncertainty.'],
  ['K-means', 'Groups current behaviour and routes it to the right specialist.'],
  ['Specialized SNN', 'Reads onset, persistence and progression of a pattern.'],
  ['QR-DQN', 'Values the possible operational actions as outcome distributions.'],
  ['Safety', 'Final authority: decides which action is permitted.'],
];

export const gcsChain = [
  ['Data acquisition', 'Aircraft, test and maintenance data enter the platform.'],
  ['Digital Thread', 'Links every observation to its configuration, time and source.'],
  ['Digital Twin', 'Physics and data models of this engine.'],
  ['CAM', 'The current model of this specific aircraft.'],
  ['BDI', 'Is the aircraft behaving differently from what is expected?'],
  ['Causal Reasoning', 'Which causes could explain the difference?'],
  ['Evidence Competition', 'Weighs the candidate causes against each other; no forced winner.'],
  ['World Model', 'Plays forward what happens under each possible action.'],
  ['Prognostics', 'Estimates the degradation trajectory.'],
  ['PPM', 'Proposes a maintenance window and action.'],
  ['Decision Engine', 'Evaluates candidate actions against constraints.'],
  ['Knowledge Engine', 'Explains the case in plain engineering language, with references.'],
  ['Engineering Intelligence', 'Coordinates the multi-step workflow and prepares the case.'],
  ['Confidence', 'States the strength and limits of the result.'],
  ['Engineer', 'Reviews the case and keeps final authority.'],
];

export const missions = [
  ['M01', 'Training / acceptance', 'Baseline ISR'],
  ['M02', 'Persistent ISR', 'Long-duration surveillance'],
  ['M03', 'High-altitude ISR', 'High-altitude surveillance'],
  ['M04', 'Maritime surveillance', 'Maritime ISR'],
  ['M05', 'Communication relay', 'Persistent relay'],
  ['M06', 'ELINT / COMINT patrol', 'Electronic intelligence'],
  ['M07', 'Post-event assessment', 'Detailed area assessment'],
  ['M08', 'Cold environment', 'Cold-weather test'],
  ['M09', 'Hot environment', 'Hot-weather test'],
  ['M10', 'Endurance', 'Extended endurance'],
];
