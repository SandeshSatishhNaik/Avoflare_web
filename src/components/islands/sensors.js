// Approximate sensor locations on the representative engine model (model space, after centring).
export const SENSORS = [
  { id: 'egt', label: 'EGT', name: 'Exhaust gas temperature', pos: [0.62, 0.05, 0.42] },
  { id: 'turbo', label: 'TURBO', name: 'Turbocharger compressor', pos: [0.78, 0.38, 0.1] },
  { id: 'cht', label: 'CHT', name: 'Cylinder head temperature', pos: [-0.1, 0.55, 0.2] },
  { id: 'rpm', label: 'RPM', name: 'Crankshaft speed', pos: [-0.72, -0.2, 0.35] },
  { id: 'oil', label: 'OIL', name: 'Oil pressure and temperature', pos: [0.05, -0.7, 0.3] },
  { id: 'fuel', label: 'FUEL', name: 'Fuel flow', pos: [-0.35, 0.35, 0.5] },
  { id: 'vib', label: 'VIB', name: 'Vibration', pos: [0.2, -0.25, 0.62] },
  { id: 'elec', label: 'ELEC', name: 'Alternator voltage and current', pos: [-0.78, 0.2, -0.1] },
];
