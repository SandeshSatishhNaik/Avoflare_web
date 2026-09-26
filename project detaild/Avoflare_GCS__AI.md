# **GCS AI** 

### **Aircraft Engineering Intelligence Platform** 

_Detailed System Architecture and Engineering Design Document_ 

##### **Operational System • Engineering Intelligence Repository (EIR) • Sentinel** 

Architecture baseline developed from the project design discussions 

GCS AI — Detailed System Architecture 

## **Document Structure** 

1. Executive Overview 

2. System Purpose and Design Philosophy 

3. GCS AI System Boundary 

4. Operational System: Complete Flow 

5. Data Acquisition and Digital Thread 

6. Digital Twin 

7. Current Aircraft Model (CAM) 

8. Baseline + Divergence (BDI) 

9. Causal Reasoning 

10. Evidence Competition 

11. World Model 

12. Prognostics 

13. Predictive / Prescriptive Maintenance 

14. Decision Engine 

15. Knowledge Engine and Engineering Intelligence 

16. Confidence, Visualization and Engineer 

17. EIR Architecture 

18. ACR and ACR Builder 

19. Aircraft History, Pattern Memory and ROW 

20. Working Memory, Search and Knowledge Extraction 

21. Sentinel 

22. Digital Twin Learning and Updating 

23. Engineering Decision Traceability 

24. New Aircraft / Sparse-Data Operating Model 

25. Product Differentiation 

26. Data and Model Lifecycle 

27. Validation and Assurance 

28. Technology Architecture 

29. End-to-End Scenarios 

30. Design Constraints and Non-Goals 

31. Final Reference Architecture 

GCS AI — Detailed System Architecture 

## **1. Executive Overview** 

GCS AI is an aircraft engineering-intelligence platform whose purpose is to build and maintain a machinereadable understanding of an aircraft and use that understanding to support diagnosis, prognosis, maintenance planning and engineering decisions. The platform is deliberately broader than a predictivemaintenance model and narrower than an attempt to replace the engineering organization. 

The system is organized around three software domains: the Operational System, the Engineering Intelligence Repository (EIR), and Sentinel. The Operational System performs the active engineering reasoning chain. EIR provides the permanent and temporary information environment needed by that reasoning chain. Sentinel controls the evolution of operational models and engineering knowledge. 

- GCS AI │ ├── Operational System 

- │└── Diagnostic / Engineering Intelligence Chain │ 

- ├── EIR 

- │├── Communication │├── Information Intelligence 

- │├── Knowledge Search 

- │├── Knowledge Extractor 

- │├── Working Memory │└── ACR │ 

- └── Sentinel 

- ├── Operational Sentinel 

- └── Knowledge Sentinel 

The core operational sequence is fixed at the architectural level. Individual algorithms, models and implementation techniques may evolve inside the defined components without creating additional top-level engines. 

Aircraft / UAV 

- ↓ Data Acquisition ↓ Digital Thread ↓ Digital Twin ↓ Current Aircraft Model (CAM) ↓ Baseline + Divergence (BDI) ↓ Causal Reasoning / Causal AI ↓ Evidence Competition ↓ World Model ↓ Prognostics ↓ Predictive Maintenance / PPM ↓ Decision Engine ↓ Knowledge Engine ↓ Engineering Intelligence ↓ Confidence ↓ 3D Visualization ↓ Engineer 

A central design principle is that GCS AI should remain useful for a new aircraft even when long-term failure data is sparse. The aircraft-specific engineering representation can initially be constructed from engineering documentation, configuration, component information, physics, simulations, test information and whatever 

GCS AI — Detailed System Architecture 

operational history exists. As the aircraft operates, its history, recent operational context and persistent patterns become progressively richer. 

#### **1.1 What GCS AI Is Not** 

- It is not only a telemetry dashboard. 

- It is not only an anomaly detector. 

- It is not only a Digital Twin. 

- It is not only a predictive-maintenance model. 

- It is not a black-box failure predictor. 

- It is not an autonomous replacement for the engineer. 

- It does not permit uncontrolled modification of operational models or engineering knowledge. 

#### **1.2 Central Engineering Proposition** 

The platform is intended to move the engineering workflow from observation to an auditable engineering case: understand the aircraft, identify divergence, investigate competing causes, evaluate evidence, model possible futures, evaluate interventions, and preserve the resulting engineering decision and its outcome. 

GCS AI — Detailed System Architecture 

## **2. System Purpose and Design Philosophy** 

#### **2.1 Aircraft as an Engineering System** 

GCS AI treats the aircraft as a configured engineering system rather than as a collection of independent sensor streams. A sensor reading is meaningful in the context of the component producing it, the subsystem in which that component operates, the configuration of the aircraft, the environmental and operational conditions, the relevant physical relationships and the historical behavior of the same aircraft. 

This leads to a layered representation. The permanent knowledge layer describes what the aircraft is and what has happened to it. The operational system uses that representation to infer what is happening now and what may happen next. 

Permanent understanding ↓ Current aircraft understanding ↓ Observed divergence ↓ Cause investigation ↓ Future-state reasoning ↓ Engineering action 

#### **2.2 Dynamic Does Not Mean Unstructured** 

The architecture deliberately combines constraints with freedom. ACR has stable top-level domains and a stable representation contract, but the internal aircraft structure is not hard-coded. The actual hierarchy is discovered from the supplied engineering information. 

This prevents two extremes: a rigid schema that cannot represent novel aircraft, and an unconstrained data lake that cannot support reliable engineering reasoning. 

#### **2.3 Engineering Knowledge Before Failure Data** 

For a new aircraft, a failure-history-only approach is inherently limited. GCS AI instead uses engineering knowledge and model-based understanding as an initial basis. Operational data then calibrates and challenges that baseline. The resulting system should become increasingly aircraft-specific as evidence accumulates. 

#### **2.4 Human Engineering Authority** 

The system is designed to augment engineers. It can construct evidence, compare hypotheses, simulate scenarios and prepare decision records, but the engineer remains the final authority for engineering decisions within the intended operating workflow. 

GCS AI — Detailed System Architecture 

## **3. GCS AI System Boundary** 



<!-- Start of picture text -->
                           GCS AI<br>│<br>┌─────────────────────┼─────────────────────┐<br>│ │ │<br>▼ ▼ ▼<br> OPERATIONAL SYSTEM          EIR                 SENTINEL<br>│ │ │<br>│ │ ┌───────┴────────┐<br>│ │ │ │<br>│ │ ▼ ▼<br>                                    Operational        Knowledge│ │<br>                                     Sentinel          Sentinel│ │<br>│ │<br>▼ ▼<br>Diagnostic /             Engineering,<br>Engineering              Aircraft and<br>Reasoning                Technology Context<br><!-- End of picture text -->

#### **3.1 Operational System Boundary** 

The Operational System begins with aircraft/operational data and ends with engineer-facing engineering intelligence. It owns the active reasoning chain but relies on EIR for persistent knowledge and context. 

#### **3.2 EIR Boundary** 

EIR owns information organization, retrieval, extraction, temporary execution context and permanent ACR storage. Communication is a software interface layer, not a knowledge store. 

#### **3.3 Sentinel Boundary** 

Sentinel is outside EIR. Its role is assurance and controlled evolution: operational model monitoring and controlled updates on one side, and knowledge/document/conflict/version monitoring on the other. 

#### **3.4 Separation of Responsibilities** 

|**Component**|**Primary responsibility**|**Does not own**|
|---|---|---|
|Operational System|Runtime engineering reasoning|Permanent knowledge repository|
|EIR|Knowledge, history, retrieval and<br>working context|Final engineering decisions|
|ACR Builder|Extract and organize supplied<br>information into ACR|Runtime diagnostic reasoning|
|Operational Sentinel|Model performance, drift,<br>deployment and version control|Aircraft engineering reasoning|
|Knowledge Sentinel|Knowledge evolution, conflicts,<br>validation and versioning|Initial ACR construction|
|Engineer|Final engineering authority|Automated model maintenance|



GCS AI — Detailed System Architecture 

## **4. Operational System: Complete Flow** 

The Operational System is the principal technical core of GCS AI. Each stage has a specific responsibility and produces context for the next stage. 

#### **4.1 Full Chain** 

1. Data Acquisition 

2. Digital Thread 

3. Digital Twin 

4. Current Aircraft Model (CAM) 

5. Baseline + Divergence (BDI) 

6. Causal Reasoning / Causal AI 

7. Evidence Competition 

8. World Model 

9. Prognostics 

10. Predictive / Prescriptive Maintenance 

11. Decision Engine 

12. Knowledge Engine 13. Engineering Intelligence 14. Confidence 15. 3D Visualization 16. Engineer 

#### **4.2 Information Flow** 

The system should not be viewed as a simple one-way prediction pipeline. Several stages require retrieval of context from EIR and may create outputs that become new context. For example, BDI may identify a divergence that requires additional historical evidence; causal reasoning may retrieve configuration relationships; the World Model may require calibrated model parameters; and the Decision Engine may require simulations and maintenance constraints. 

Operational Stage ↕ Information Intelligence ↕ Working Memory ↕ ACR / Search / Evidence 

#### **4.3 No Additional Operational Engines** 

The architecture intentionally avoids adding separate engines for physics AI, ML, neuro-symbolic AI, or other methods. These are implementation techniques. This keeps the operational architecture understandable and prevents every new model class from becoming another system-level box. 

GCS AI — Detailed System Architecture 

## **5. Data Acquisition and Digital Thread** 

#### **5.1 Data Acquisition** 

Data Acquisition is responsible for receiving and normalizing operational aircraft information required by the downstream system. The exact acquisition mechanisms can vary by aircraft and integration environment. 

- Aircraft sensors and measurements. 

- Flight/mission data. 

- Avionics or data-bus information. 

- Operational context such as load, environment and mission conditions. 

- Relevant maintenance and inspection events when available. 

- Configuration changes and component replacement information. 

#### **5.2 Data Quality** 

Before data becomes evidence for engineering reasoning, its temporal alignment, units, identity, validity and provenance need to be understood. The system must distinguish missing data from zero values and stale data from current data. 

#### **5.3 Digital Thread** 

The Digital Thread connects information across the aircraft lifecycle. Its role is traceability: a current observation should be linkable to the aircraft configuration and relevant engineering records; a maintenance decision should be linkable to the condition that triggered it; and a later outcome should be linked back to the decision. 



<!-- Start of picture text -->
Configuration<br>│<br>├──> Operation<br>│ │<br>│ ├──> Observation<br>│ │ │<br>│ │ └──> Diagnosis<br>│ │<br>│ └──> Event<br>│<br>└──> Maintenance<br>│<br>└──> Outcome<br><!-- End of picture text -->

#### **5.4 Why the Digital Thread Matters** 

Without the thread, the system can detect patterns but may not be able to explain which aircraft configuration produced them, whether a component was replaced before or after an anomaly, or which engineering decision was based on the observation. 

GCS AI — Detailed System Architecture 

## **6. Digital Twin** 

The Digital Twin is the computational representation of aircraft behavior and configuration used by the Operational System. It should combine engineering structure with physics-based and data-driven behavior rather than being reduced to a single neural network. 

#### **6.1 Digital Twin Inputs** 

- Aircraft configuration and component relationships from ACR. 

- Engineering properties and operating limits. 

- Physics and scientific models. 

- Historical operational data. 

- Test data. 

- Current measurements. 

- Calibrated model parameters. 

- Relevant environmental and mission conditions. 

#### **6.2 Model Classes** 

Different aircraft phenomena may require different model classes. Deterministic physics models, differentialequation models, statistical models, ML models and hybrid physics-ML models can coexist within the Digital Twin. 

Physics model + Data-driven model + Configuration + Calibrated parameters ↓ Aircraft Digital Twin 

#### **6.3 Hybrid Modeling** 

Where the physics model captures the dominant behavior but leaves systematic residual error, a data-driven residual model can be used. Conceptually: 

y_predicted = y_physics + f_ML(inputs) 

This is an implementation pattern, not a mandatory model form. The choice depends on the aircraft subsystem and available data. 

#### **6.4 Digital Twin Lifecycle** 

Construct → Identify Parameters → Calibrate → Validate → Deploy ↑ │ └── Controlled Update 

#### **6.5 State Versus Parameters** 

A key distinction is between rapidly changing state variables and slower model parameters. Recent operational information may update state estimates frequently, while changes to physical or degradation parameters should require stronger evidence and controlled validation. 

GCS AI — Detailed System Architecture 

## **7. Current Aircraft Model (CAM)** 

CAM is the current validated representation of the aircraft at the operational moment. It should not be interpreted as simply the Digital Twin itself or as a snapshot of raw telemetry. 

#### **7.1 CAM Contains** 

- Current aircraft configuration. 

- Current estimated states. 

- Relevant calibrated Digital Twin parameters. 

- Current operating context. 

- Known component condition where supported. 

- Current model version and knowledge context. 

- Uncertainty/confidence associated with important estimates. 

#### **7.2 CAM Construction** 

Digital Twin + Current configuration + Recent operational context + Current observations + Validated state estimation ↓ Current Aircraft Model 

#### **7.3 CAM and BDI** 

CAM is the object against which divergence can be evaluated. BDI therefore needs both a current representation and an appropriate baseline. A change in state is not automatically a fault; its meaning depends on operating conditions and expected behavior. 

GCS AI — Detailed System Architecture 

## **8. Baseline + Divergence (BDI)** 

BDI determines whether the aircraft is behaving materially differently from what is expected. The baseline may be derived from engineering knowledge, the Digital Twin, historical behavior, configuration-specific behavior or a combination. 

#### **8.1 Baseline Selection** 

A meaningful baseline must be conditional. Comparing an aircraft operating under one load and environmental condition to a baseline built under another condition can create false divergence. 

#### **8.2 Divergence Types** 

- Point deviation — an observation outside expected bounds. 

- Trend deviation — a sustained change over time. 

- Relationship deviation — two or more variables no longer behave in their expected relationship. 

- Model residual deviation — measured behavior differs systematically from the Digital Twin. 

- Configuration-conditioned deviation — behavior changes after a component/configuration change. 

#### **8.3 BDI Output** 

BDI Output 

- ├── What deviated? 

- ├── Magnitude 

- ├── Duration 

- ├── Operating context 

- ├── Expected behavior 

- ├── Evidence quality 

- ├── Affected entity 

- └── Candidate investigation scope 

#### **8.4 BDI Is Not Diagnosis** 

BDI identifies a meaningful difference. It does not decide the cause. Cause investigation begins in the Causal Reasoning layer. 

GCS AI — Detailed System Architecture 

## **9. Causal Reasoning** 

Causal Reasoning investigates why an observed divergence may have occurred. It uses relationships and mechanisms rather than treating a statistical association as a sufficient explanation. 

#### **9.1 Inputs** 

- BDI divergence. 

- CAM state. 

- Aircraft configuration. 

- Engineering relationships. 

- Digital Twin behavior. 

- Aircraft History. 

- ROW. 

- Pattern Memory. 

- Internal and external evidence. 

#### **9.2 Candidate Cause Structure** 

Observed: 

Temperature ↑ 

Candidate causes: 

A — increased load 

B — ambient condition 

C — cooling degradation D — combustion/fuel behavior E — sensor degradation 

For each: supporting evidence contradicting evidence expected signatures model consistency historical similarity 

#### **9.3 Causal Reasoning Output** 

The output should be a structured set of candidate explanations and the reasoning/evidence associated with each. It should preserve uncertainty rather than manufacturing certainty when evidence is insufficient. 

#### **9.4 Implementation Technologies** 

Graph relationships, symbolic reasoning, causal models, physics-based constraints and statistical/ML models may all contribute. These are implementation mechanisms within the Causal Reasoning component. 

GCS AI — Detailed System Architecture 

## **10. Evidence Competition** 

Evidence Competition is the mechanism for comparing competing explanations against the available evidence. It is especially important when multiple causes can produce similar observable symptoms. 

#### **10.1 Evidence Sources** 

- Current aircraft observations. 

- Digital Twin predictions and residuals. 

- Aircraft History. 

- Pattern Memory. 

- ROW. 

- Engineering documentation. 

- Maintenance records. 

- Internal technical knowledge. 

- External technical sources. 

#### **10.2 Evidence Representation** 

Evidence Record 

├── Evidence ID ├── Source ├── Source location / reference 

- ├── Observation / claim 

- ├── Timestamp / validity 

- ├── Related entity 

- ├── Supporting hypothesis 

- ├── Contradicting hypothesis ├── Extraction / validation status └── Provenance 

#### **10.3 Competition Process** 

Candidate hypotheses ↓ Retrieve relevant evidence ↓ Evaluate support ↓ Evaluate contradiction ↓ Check physics/model consistency ↓ Check historical consistency ↓ Update confidence ↓ Engineering hypothesis set 

#### **10.4 No Forced Winner** 

When evidence is insufficient or contradictory, the system should preserve the ambiguity and escalate the engineering investigation rather than presenting an unjustified single cause. 

GCS AI — Detailed System Architecture 

## **11. World Model** 

The World Model provides a structured representation of relevant aircraft state, relationships and possible future states. It becomes useful after the system understands the present condition and needs to reason about what could happen next. 

#### **11.1 World Model Inputs** 

- Current Aircraft Model. 

- Aircraft configuration. 

- Physical relationships. 

- Validated Digital Twin behavior. 

- Causal hypotheses. 

- Environmental and operational constraints. 

- Relevant historical patterns. 

#### **11.2 Counterfactual Reasoning** 

The World Model should support questions such as: what happens if the aircraft continues under the current condition, what happens if an intervention is applied, and how does a different operating condition change the predicted trajectory. 

- Current state │ ├── Continue operation │ ↓ 

- Future state A│ │ ├── Inspect component │ ↓ 

- Future state B│ │ └── Replace component ↓ 

   - Future state C 

#### **11.3 Relationship to Simulation** 

Simulation results are evidence for scenario evaluation. Important selected simulations and their reasoning should be preserved as engineering artifacts for later traceability. 

GCS AI — Detailed System Architecture 

## **12. Prognostics** 

Prognostics estimates future behavior, degradation or remaining useful life where the evidence supports such an estimate. It should consume current state, model behavior, historical evidence and uncertainty. 

#### **12.1 Prognostic Inputs** 

- Current component/system state. 

- Historical degradation. 

- Digital Twin behavior. 

- Operational load and environment. 

- Observed divergence. 

- Relevant patterns. 

- Model uncertainty. 

#### **12.2 Prognostic Output** 

Prognostics 

- ├── Expected trajectory 

- ├── Degradation estimate 

- ├── Relevant time/horizon 

- ├── Uncertainty 

- ├── Assumptions 

- └── Evidence / model provenance 

#### **12.3 RUL Is Not Always the Output** 

A remaining-useful-life estimate is only one possible prognostic output. In some cases the more appropriate result is a probability distribution, degradation trajectory, threshold-crossing estimate or scenario-dependent health projection. 

GCS AI — Detailed System Architecture 

## **13. Predictive / Prescriptive Maintenance** 

PPM turns prognostic understanding into maintenance-relevant information. The objective is not merely to forecast failure, but to connect the forecast to maintenance timing and intervention options. 

#### **13.1 Predictive Layer** 

- Expected degradation. 

- Expected threshold crossing. 

- Potential failure window. 

- Maintenance urgency. 

- Uncertainty and assumptions. 

#### **13.2 Prescriptive Layer** 

Prescriptive maintenance evaluates possible interventions and their consequences. Candidate actions may include inspection, monitoring, repair, replacement or controlled continued operation, depending on the engineering context. 

#### **13.3 Decision Context** 

The Decision Engine receives these candidate actions together with constraints, evidence and simulation results. The system should distinguish a model prediction from an engineering decision. 

GCS AI — Detailed System Architecture 

## **14. Decision Engine** 

The Decision Engine evaluates candidate engineering actions. It should account for the aircraft state, evidence strength, operational constraints, maintenance constraints, predicted consequences and relevant scenario results. 

#### **14.1 Decision Inputs** 

- Current Aircraft Model. 

- Cause hypotheses and evidence. 

- Prognostic trajectories. 

- Candidate interventions. 

- Simulation/scenario results. 

- Operational constraints. 

- Maintenance constraints. 

- Confidence and uncertainty. 

#### **14.2 Decision Output** 

Decision 

- ├── Problem / trigger 

- ├── Candidate actions 

- ├── Evidence 

- ├── Simulation results 

- ├── Constraints 

- ├── Selected / proposed action 

- ├── Expected outcome 

- ├── Confidence 

- ├── Authority / engineer 

- └── Provenance 

#### **14.3 Human Approval** 

The platform prepares and structures the engineering case. The intended operating model retains human engineering authority, particularly where the action affects flight safety, configuration or maintenance release. 

GCS AI — Detailed System Architecture 

## **15. Knowledge Engine and Engineering Intelligence** 

#### **15.1 Knowledge Engine** 

The Knowledge Engine is the LLM-based reasoning and reporting layer. It turns structured engineering outputs into understandable reports, explanations, summaries and engineering context. 

- Explain observed divergence. 

- Summarize competing hypotheses. 

- Present supporting and contradictory evidence. 

- Explain relevant Digital Twin/simulation results. 

- Produce structured engineering reports. 

- Preserve references and provenance. 

#### **15.2 Engineering Intelligence** 

Engineering Intelligence is the agentic layer that can coordinate multi-step engineering workflows using the outputs of the operational components and EIR. It should not become a hidden replacement for the defined engines. 

Engineering Intelligence 

- │ 

   - ├── retrieve context 

   - ├── request analysis 

   - ├── compare results 

   - ├── coordinate workflow 

   - ├── prepare engineering case 

   - └── present to engineer 

#### **15.3 Knowledge Engine vs Engineering Intelligence** 

The Knowledge Engine primarily reasons over and communicates engineering knowledge and results. Engineering Intelligence coordinates tasks and multi-step workflows. They remain distinct responsibilities even though both may use LLM-based technology. 

GCS AI — Detailed System Architecture 

## **16. Confidence, Visualization and Engineer** 

#### **16.1 Confidence** 

Confidence should communicate the strength and limitations of a result. It is not a universal truth score. Different outputs can have different uncertainty sources: sensor quality, model uncertainty, conflicting evidence, insufficient history or extrapolation beyond validated operating conditions. 

#### **16.2 3D Visualization** 

Visualization provides spatial context for the engineering result. A detected or predicted issue should be associated with the relevant aircraft entity/component when the available model supports that mapping. 

#### **16.3 Engineer Interface** 

The engineer should be able to move from summary to evidence, model behavior, historical context and decision provenance. A useful interface therefore exposes the reasoning chain rather than displaying only a final alert. 

Alert ↓ Affected component ↓ Observed deviation ↓ Current model ↓ Candidate causes ↓ Evidence ↓ Simulation ↓ Prognosis ↓ Candidate action ↓ Decision record 

GCS AI — Detailed System Architecture 

## **17. EIR — Engineering Intelligence Repository** 

EIR is the supporting intelligence environment. It separates permanent knowledge from temporary reasoning context and separates internal knowledge from external retrieval. 

EIR 

- ├── Communication Layer 

- ├── Information Intelligence 

- ├── Knowledge Search 

- │├── Internal 

- │└── External ├── Knowledge Extractor 

- ├── Working Memory 

- └── ACR 

#### **17.1 Communication Layer** 

Communication is software infrastructure for requests, responses, routing, events, authentication and interaction between GCS AI components and external users/systems. It is not a knowledge store. 

#### **17.2 Information Intelligence** 

Information Intelligence determines what information a particular operational component needs. It retrieves and aggregates relevant ACR records, search results, history, patterns and evidence, then constructs an execution context for Working Memory. 

#### **17.3 Information Flow** 

Operational Engine 

   - ↓ request context 

- Information Intelligence 

   - ↓ retrieve 

ACR + Search + History + Evidence 

- ↓ assemble 

Working Memory ↓ Operational Engine 

GCS AI — Detailed System Architecture 

## **18. ACR and ACR Builder** 

#### **18.1 ACR Role** 

ACR is the permanent engineering repository. Its three top-level domains are Engineering Knowledge / Engineering Memory, Aircraft History and Technology Knowledge. 

ACR 

- ├── Engineering Knowledge / Engineering Memory 

- ├── Aircraft History 

- └── Technology Knowledge 

#### **18.2 Tree-Oriented Structure** 

The intended ACR organization is a tree with freedom inside constraints. The system can represent different aircraft structures without requiring a universal predefined subsystem list. 

Engineering Knowledge 

- └── Aircraft 

- ├── UAV-001 

- │├── configuration 

- │├── discovered engineering structure 

- │├── entities/components 

- │├── properties 

- │├── relationships 

- │└── engineering artifacts 

- └── UAV-002 └── aircraft-specific structure 

#### **18.3 Relationships in a Tree-Oriented ACR** 

The tree provides organization; references can connect nodes that have engineering relationships. This preserves hierarchy without preventing cross-links. 

Aircraft 

└── Propulsion └── Engine-001 Engine-001 ──controlled_by──> ECU-001 Engine-001 ──installed_on──> UAV-001 Sensor-001 ──measures──────> Engine Temperature 

#### **18.4 ACR Builder's Sole Job** 

ACR Builder extracts information and relationships from supplied data, maps them into the appropriate ACR structure and stores them. It does not perform runtime diagnosis, prognostics or engineering decisionmaking. 

Supplied engineering data ↓ Information extraction ↓ Relationship extraction ↓ Dynamic structure mapping ↓ 

GCS AI — Detailed System Architecture 

ACR write 

#### **18.5 Dynamic Schema Discovery** 

The builder should identify actual entities, properties and relationships from supplied documents rather than imposing a fixed aircraft architecture. The input contract remains stable while the aircraft-specific contents remain flexible. 

GCS AI — Detailed System Architecture 

## **19. Aircraft History, Pattern Memory and ROW** 

#### **19.1 Aircraft History** 

Aircraft History is persistent. It records what actually happened to a particular aircraft over its lifecycle. 

- Aircraft History 

- ├── UAV 

- │├── UAV-001 

- ││├── flights 

- ││├── operating conditions ││├── maintenance ││├── inspections ││├── anomalies/failures 

- ││├── repairs ││├── component changes 

- ││├── engineering decisions 

- ││└── simulations │└── UAV-002 

└── Jet └── JET-001 

#### **19.2 Pattern Memory** 

Pattern Memory is derived from accumulated history. It captures persistent behavioral patterns that may be useful for interpreting future aircraft behavior. 

#### **19.3 ROW** 

ROW is the Recent Operational Window. It is a rolling representation of recent operational context rather than a second permanent copy of all history. 

#### **19.4 Their Impact on the Digital Twin** 

ROW can influence current state estimation and recent context. Pattern Memory can provide historical context and support parameter-estimation or recalibration candidates. Neither should arbitrarily rewrite the Digital Twin. 

ROW → current state/context Pattern Memory → historical pattern/context ↓ state / parameter estimation ↓ candidate update ↓ validation ↓ new approved DT version 

#### **19.5 Why the Separation Matters** 

Separating history, patterns and recent context prevents the operational model from becoming an uncontrolled reflection of every new observation. The DT remains a validated model while contextual stores evolve continuously. 

GCS AI — Detailed System Architecture 

## **20. Working Memory, Search and Knowledge Extraction** 

#### **20.1 Working Memory** 

Working Memory contains temporary context required for an active reasoning task. It may include retrieved records, current observations, hypotheses, intermediate calculations, model results and task-specific context. 

Working Memory should have configurable retention and should not become a permanent knowledge store. 

#### **20.2 Knowledge Search** 

- Knowledge Search 

- ├── Internal 

- │└── ACR / approved internal knowledge └── External 

- └── OEM / regulatory / scientific / technical sources 

Search results should remain traceable to their sources and should not automatically become permanent ACR knowledge without the appropriate extraction and validation path. 

#### **20.3 Knowledge Extractor** 

Knowledge Extractor converts documents and other supplied information into candidate structured knowledge. After validation, appropriate records can be written into ACR. 

#### **20.4 Information Intelligence as the Mediator** 

The Operational System should not need to know the physical details of every EIR store. Information Intelligence mediates access and constructs the context required by each operational component. 

GCS AI — Detailed System Architecture 

## **21. Sentinel** 

Sentinel governs controlled evolution. It is intentionally separated from the operational reasoning chain and from initial ACR construction. 

Sentinel 

- ├── Operational Sentinel 

- └── Knowledge Sentinel 

#### **21.1 Operational Sentinel** 

- Monitor model performance. 

- Detect model drift. 

- Track validation state. 

- Control model versions. 

- Support controlled deployment. 

- Identify candidates for recalibration or update. 

#### **21.2 Knowledge Sentinel** 

- Monitor knowledge/document evolution. 

- Track validation status. 

- Identify conflicts. 

- Control knowledge versioning. 

- Monitor relationship/graph updates. 

- Track pattern and evidence evolution. 

#### **21.3 Sentinel and Safety of Change** 

New data / candidate update ↓ Sentinel monitoring ↓ Validation ↓ Comparison with current version ↓ Controlled approval ↓ 

New version 

#### **21.4 Physics Knowledge** 

Physics itself is treated as immutable engineering knowledge in the current architecture. A change to physicsrelated knowledge would require enhanced validation rather than ordinary autonomous knowledge updating. 

GCS AI — Detailed System Architecture 

## **22. Digital Twin Learning and Updating** 

#### **22.1 Why 'Training' Is Not Enough** 

For an aerospace Digital Twin, training may refer to only one part of the process. Construction, parameter identification, calibration, validation and adaptation are distinct. 

#### **22.2 Initial Construction** 

Engineering documents + aircraft configuration + component information + physics + available test data ↓ initial Digital Twin 

#### **22.3 Parameter Identification** 

Unknown parameters can be estimated from observed aircraft behavior. Conceptually, model parameters are chosen to reduce the discrepancy between measured and modeled behavior while respecting engineering constraints. 

Observed data + Physics/model equations ↓ Parameter estimation ↓ Candidate parameters ↓ Validation 

#### **22.4 Calibration** 

Calibration aligns the model with the particular aircraft or configuration. Calibration is not equivalent to blindly fitting every measurement; it should preserve the engineering meaning of the model. 

#### **22.5 Validation** 

Validation should use data that tests the model under relevant conditions and, where possible, conditions not used directly for calibration. 

#### **22.6 Controlled Adaptation** 

New data can reveal systematic model mismatch. A candidate update can be generated, but the current model remains unchanged until the update passes the required validation and versioning process. 

GCS AI — Detailed System Architecture 

## **23. Engineering Decision Traceability** 

A major objective is that engineers should be able to look back at any significant engineering decision and reconstruct what happened. 

#### **23.1 Decision Record** 

Decision ID Aircraft / Entity Date / Time Trigger / Problem Current aircraft state Candidate causes Evidence Candidate simulations Selected simulation Constraints Selected / proposed action Reasoning Expected outcome Confidence Engineer / authority Model version Engineering knowledge version Provenance 

#### **23.2 Simulation Provenance** 

The selected simulation should be retained or linked as an engineering artifact. Its inputs, configuration, environment, initial state, model version, results and uncertainty should be recoverable where applicable. 

#### **23.3 Outcome Feedback** 

The eventual outcome of the engineering decision becomes part of Aircraft History. This allows later Pattern Memory and engineering retrieval to use not just what was predicted, but what actually happened after the decision. 

Decision ↓ Intervention ↓ Observed outcome ↓ Aircraft History ↓ Pattern Memory ↓ Future engineering cases 

GCS AI — Detailed System Architecture 

## **24. New Aircraft / Sparse-Data Operating Model** 

One of the most important intended use cases is a new-generation UAV or aircraft with limited operational history. 

#### **24.1 Initial State** 

New UAV 

- ├── Engineering documents 

- ├── Configuration ├── Component information ├── Sensor definitions 

- ├── Physics / engineering knowledge ├── Test information 

- └── Limited operational history 

#### **24.2 Onboarding** 

1. Supply engineering and aircraft information. 

2. ACR Builder extracts entities, properties and relationships. 

3. ACR is organized into the aircraft-specific hierarchy. 

4. Initial Digital Twin is constructed. 

5. Aircraft History container is initialized. 

6. Current model is calibrated and validated as data permits. 

7. Operational System begins with the available evidence. 

#### **24.3 Learning Over Lifecycle** 

Initial engineering knowledge ↓ Initial aircraft model ↓ Test flights ↓ Calibration / validation ↓ Operational history ↓ Pattern Memory + ROW ↓ Improved aircraft-specific intelligence ↓ Engineering decisions and outcomes ↓ Further knowledge 

#### **24.4 Why This Matters** 

The product is intended to avoid a design in which usefulness begins only after a large number of failures have accumulated. The initial model can be engineering-driven, while operational data progressively makes it more aircraft-specific. 

GCS AI — Detailed System Architecture 

## **25. Product Differentiation** 

The differentiation must be customer-visible rather than a list of technologies. AI, Digital Twins, predictive maintenance, sensor fusion, physics-based modeling and anomaly detection are not sufficient differentiators by themselves. 

#### **25.1 Intended Product Difference** 

GCS AI is intended to create a persistent aircraft-specific engineering intelligence layer that can begin from engineering information, reason about current aircraft behavior, investigate why behavior diverges, compare competing evidence, evaluate future scenarios and preserve engineering decisions and outcomes. 

|**Common product claim**|**GCS AI intended distinction**|
|---|---|
|Predict failure|Explain and investigate aircraft divergence|
|Depend heavily on historical failure data|Start from engineering knowledge and physics, then<br>learn from operational life|
|Monitor a known asset model|Construct aircraft-specific engineering structure<br>from supplied information|
|Produce an alert|Produce a traceable engineering case|
|Store maintenance history|Build reusable engineering memory from decisions<br>and outcomes|
|Digital Twin|Digital Twin integrated into a larger diagnostic and<br>engineering reasoning chain|



#### **25.2 The Hard Case** 

The strongest product test is a new aircraft with sparse failure history and fragmented engineering information. The platform should be able to construct an initial engineering representation, become useful before large-scale failure data exists, and improve as the aircraft accumulates operational experience. 

#### **25.3 What Must Be Demonstrated** 

8. Speed and correctness of aircraft-specific knowledge construction. 

9. Usefulness with sparse historical failure data. 

10. Ability to distinguish multiple plausible causes. 

11. Traceability of evidence and engineering reasoning. 

12. Quality of scenario and intervention analysis. 

13. Ability to preserve decisions and learn from outcomes. 

GCS AI — Detailed System Architecture 

## **26. Data and Model Lifecycle** 

#### **26.1 Information Lifecycle** 

Source information ↓ Ingestion ↓ Extraction ↓ Validation ↓ ACR ↓ Retrieval / Working Memory ↓ Operational reasoning ↓ Decision / outcome ↓ Aircraft History ↓ Pattern Memory 

#### **26.2 Model Lifecycle** 

Model candidate ↓ Training / parameter estimation ↓ Calibration ↓ Validation ↓ Versioned deployment ↓ Monitoring ↓ Drift / mismatch ↓ Candidate update ↓ Revalidation ↓ New version 

#### **26.3 Knowledge Lifecycle** 

Document / source ↓ Knowledge extraction ↓ 

GCS AI — Detailed System Architecture 

Candidate knowledge ↓ Validation ↓ Permanent ACR knowledge ↓ Knowledge Sentinel monitoring ↓ Revision / conflict handling ↓ Versioned knowledge 

#### **26.4 Separation of Persistent and Temporary Data** 

|**Information**|**Persistence**|**Purpose**|
|---|---|---|
|ACR|Permanent|Engineering knowledge, aircraft<br>history, technology knowledge|
|Evidence|Persistent/traceable|Support claims and hypotheses|
|Pattern Memory|Persistent derived|Long-term behavioral patterns|
|ROW|Rolling / temporary|Recent operational context|
|Working Memory|Temporary|Current reasoning context|
|Raw documents|Persistent|Original source/provenance|
|Simulation artifacts|Persistent/linked|Engineering decision traceability|



GCS AI — Detailed System Architecture 

## **27. Validation and Assurance** 

The architecture depends on controlled validation because aerospace engineering decisions cannot rely on opaque or uncontrolled updates. 

#### **27.1 Validation Layers** 

- Data validation — integrity, units, identity, timestamps and provenance. 

- Knowledge validation — correctness and conflict handling. 

- Model validation — predictive/behavioral performance under relevant conditions. 

- Causal validation — consistency of proposed mechanisms with evidence and physics. 

- Simulation validation — appropriate model, inputs and assumptions. 

- Decision validation — constraints, evidence and engineering authority. 

#### **27.2 Conflicting Information** 

Conflicting sources should not be silently merged. The system should preserve the competing values, their provenance and their validation status until the conflict is resolved. 

Source A → value X Source B → value Y ↓ Conflict ↓ Validation / authority ↓ Approved knowledge version 

#### **27.3 Uncertainty** 

Uncertainty should be carried through the chain when meaningful. A high-confidence sensor observation does not automatically create a high-confidence causal explanation. Confidence should therefore be contextual. 

GCS AI — Detailed System Architecture 

## **28. Technology Architecture** 

The implementation stack is polyglot by capability. The languages are not intended to define the conceptual architecture. 

#### **28.1 Python + Mojo** 

- AI and machine learning. 

- Deep learning. 

- Statistics and time-series methods. 

- Feature engineering. 

- Agentic and LLM workflows. 

- High-performance AI kernels where appropriate. 

#### **28.2 Julia** 

- Physics-based computation. 

- Differential equations. 

- SciML. 

- Physics-informed neural networks. 

- Scientific and numerical modeling. 

#### **28.3 Rust** 

- Infrastructure and runtime components. 

- High-performance platform services. 

- Reliability-critical services. 

- Sentinel implementation. 

- System integration components where deterministic performance is valuable. 

#### **28.4 Storage Principle** 

ACR is a logical permanent repository. Its eventual physical implementation can use specialized stores for hierarchical/relationship data, metadata, time-series data and original artifacts. Specific database technologies should be selected after the logical schema and workload requirements are finalized rather than prematurely fixed. 

#### **28.5 Deployment Principle** 

The architecture should support edge-to-platform operation where aircraft connectivity, latency and data volume require it. The exact partitioning between aircraft/edge and central infrastructure is an implementation decision that should follow the aircraft integration constraints. 

GCS AI — Detailed System Architecture 

## **29. End-to-End Engineering Scenarios** 

#### **29.1 Scenario A — New UAV Onboarding** 

Engineering PDFs ↓ ACR Builder ↓ Aircraft-specific ACR tree ↓ Initial Digital Twin ↓ Validation / calibration ↓ Operational System ready 

The new UAV does not need to have years of failure history before an engineering representation can exist. History begins empty and becomes populated through operation. 

#### **29.2 Scenario B — Temperature Divergence** 

Sensor data ↓ CAM ↓ BDI detects abnormal thermal residual ↓ Causal Reasoning generates candidates ↓ Evidence Competition compares causes ↓ World Model evaluates future states ↓ Prognostics estimates degradation trajectory ↓ PPM proposes maintenance window ↓ Decision Engine evaluates actions ↓ Engineer reviews engineering case 

#### **29.3 Scenario C — Post-Maintenance Change** 

A component is replaced. The Digital Thread records the configuration change. Subsequent observations are interpreted against the new configuration. If behavior changes systematically, BDI and causal reasoning can distinguish a configuration-related effect from unrelated degradation. 

#### **29.4 Scenario D — Repeated Historical Pattern** 

A new anomaly resembles a previously investigated event. Pattern Memory and Aircraft History provide the historical case. The system compares conditions rather than copying the old diagnosis blindly. Evidence Competition determines whether the previous mechanism remains applicable. 

GCS AI — Detailed System Architecture 

#### **29.5 Scenario E — Engineering Decision Review** 

An engineer asks why a component was replaced several months earlier. The system retrieves the decision record, triggering divergence, candidate causes, evidence, simulation, selected action, model/knowledge versions and subsequent outcome. 

GCS AI — Detailed System Architecture 

## **30. Design Constraints and Non-Goals** 

#### **30.1 Architectural Constraints** 

- Do not add new top-level operational engines without an explicit architecture change. 

- Do not hard-code a universal aircraft subsystem tree into ACR Builder. 

- Do not allow Pattern Memory or ROW to arbitrarily rewrite the Digital Twin. 

- Do not treat Working Memory as permanent knowledge. 

- Do not collapse evidence into history or pattern memory. 

- Do not treat communication as a knowledge store. 

- Do not make ACR Builder responsible for runtime diagnosis. 

- Do not make Sentinel responsible for initial ACR construction. 

- Do not treat physics as ordinary mutable knowledge. 

- Do not allow an LLM output to replace the underlying engineering model or evidence. 

#### **30.2 Non-Goals** 

- Replacing the aircraft engineer. 

- Creating a universal fixed subsystem taxonomy for all aircraft. 

- Building a purely black-box predictive system. 

- Automatically accepting every new document as authoritative knowledge. 

- Automatically deploying every newly trained model. 

- Creating separate operational engines for every AI technique. 

#### **30.3 Architecture Discipline** 

The system should grow by improving the capabilities inside the existing components before adding new boxes. This preserves the clarity of the operational reasoning chain and prevents architectural fragmentation. 

GCS AI — Detailed System Architecture 

## **31. Final Reference Architecture** 

GCS AI │ ┌────────────────────────┼────────────────────────┐ │ │ │ ▼ ▼ ▼ OPERATIONAL SYSTEM             EIR                    SENTINEL │ │ │ │ ┌──────────┼──────────┐ ┌─────┴─────┐ │ │ │ │ │ │ │ ▼ ▼ ▼ ▼ ▼ ACR      Knowledge   Working  Operational Knowledge│ Search      Memory    Sentinel   Sentinel│ │ ▼ Data Acquisition ↓ Digital Thread ↓ Digital Twin ↓ Current Aircraft Model ↓ Baseline + Divergence ↓ Causal Reasoning ↓ Evidence Competition ↓ World Model ↓ Prognostics ↓ Predictive / Prescriptive Maintenance ↓ Decision Engine ↓ Knowledge Engine ↓ Engineering Intelligence ↓ Confidence ↓ 3D Visualization ↓ Engineer 

#### **31.1 EIR Reference** 

EIR 

├── Communication Layer 

GCS AI — Detailed System Architecture 

├── Information Intelligence 

├── Knowledge Search │├── Internal │└── External ├── Knowledge Extractor ├── Working Memory └── ACR ├── Engineering Knowledge / Engineering Memory ├── Aircraft History └── Technology Knowledge 

#### **31.2 Sentinel Reference** 

Sentinel 

├── Operational Sentinel │├── model performance │├── drift │├── validation 

│└── controlled deployment/versioning │ 

- └── Knowledge Sentinel 

- ├── knowledge evolution 

- ├── document evolution 

- ├── validation/conflicts 

├── relationship updates └── versioning 

#### **31.3 Final Design Principle** 

GCS AI should be understood as an engineering intelligence system, not a collection of independent AI features. The permanent knowledge representation, current aircraft model, diagnostic reasoning, evidence competition, future-state reasoning, prognostics and decision traceability form one coherent engineering lifecycle. EIR supplies the memory and context; Sentinel controls evolution; the Operational System performs the active engineering work. 

GCS AI — Detailed System Architecture 

## **Appendix A — Core Definitions** 

|**Term**|**Definition**|
|---|---|
|ACR|Permanent engineering repository containing<br>Engineering Knowledge/Engineering Memory,<br>Aircraft History and Technology Knowledge.|
|ACR Builder|Onboarding component whose sole job is to extract<br>information and relationships from supplied data<br>and store them appropriately in ACR.|
|Aircraft History|Persistent record of what has happened to a specific<br>aircraft over its operational lifecycle.|
|Pattern Memory|Persistent derived representation of behavioral<br>patterns extracted from aircraft history.|
|ROW|Recent Operational Window: rolling recent<br>operational context used by runtime reasoning.|
|Working Memory|Temporary context assembled for a current<br>reasoning task.|
|Digital Twin|Computational representation of aircraft<br>configuration and behavior using engineering,<br>physics and data-driven models.|
|CAM|Current Aircraft Model: validated representation of<br>the aircraft's current state and relevant model<br>context.|
|BDI|Baseline + Divergence: mechanism for comparing<br>current aircraft behavior with expected behavior and<br>identifying meaningful deviation.|
|Causal Reasoning|Investigation of possible underlying causes of<br>observed divergence.|
|Evidence Competition|Comparison of competing explanations against<br>supporting and contradictory evidence.|
|World Model|Representation supporting current-state, future-<br>state and counterfactual engineering reasoning.|
|Prognostics|Estimation of future degradation or behavior under<br>stated assumptions and uncertainty.|
|PPM|Predictive/Prescriptive Maintenance: conversion of<br>prognostic information into maintenance-relevant<br>predictions and intervention options.|
|Decision Engine|Component that evaluates candidate engineering<br>actions using evidence, constraints and predicted<br>consequences.|
|Knowledge Engine|LLM-based layer for structured engineering reporting<br>and knowledge reasoning.|
|EngineeringIntelligence|Agentic layer coordinatingmulti-stepengineering|



GCS AI — Detailed System Architecture 

||workflows.|
|---|---|
|Operational Sentinel|Sentinel component responsible for operational<br>model performance, drift, validation, deployment<br>and versioning.|
|Knowledge Sentinel|Sentinel component responsible for<br>knowledge/document evolution, validation,<br>conflicts and versioning.|



## **Appendix B — Reference Data Relationships** 

- Aircraft → 

- ├── has_configuration Configuration ├── contains / includes → Entity 

- ├── has_history → Aircraft History └── has_current_model → CAM 

###### Entity 

- ├── has_property → Property ├── related_to → Entity ├── affected_by → Event └── supported_by → Evidence 

Event 

- ├── affects → Entity ├── produces → Observation 

- ├── triggers → Investigation 

- └── associated_with → Decision 

###### Decision 

- ├── based_on → Evidence ├── evaluates → Simulation ├── affects → Aircraft / Entity └── produces → Outcome 

## **Appendix C — Implementation Readiness Checklist** 

- Freeze logical Operational System sequence. 

- Freeze EIR top-level components. 

- Define ACR meta-schema and tree constraints. 

- Define ACR Builder input contract. 

- Define entity/property/relationship extraction representation. 

- Define provenance model. 

- Define Aircraft History event model. 

- Define Pattern Memory derivation strategy. 

- Define ROW generation and retention. 

- Define Digital Twin state/parameter distinction. 

- Define DT calibration and validation protocol. 

- Define BDI baseline representation. 

GCS AI — Detailed System Architecture 

- Define causal hypothesis representation. 

- Define evidence representation and competition mechanism. 

- Define World Model state/scenario representation. 

- Define prognostic uncertainty representation. 

- Define decision-record schema. 

- Define Sentinel model/knowledge lifecycle states. 

- Select physical storage technologies after workload analysis. 

- Define APIs and runtime interfaces. 

- Define validation datasets and engineering test cases. 

## **Appendix D — Final One-Page Concept** 

GCS AI │ ├── OPERATIONAL SYSTEM │   Aircraft Data │ ↓ │   Digital Thread │ ↓ │   Digital Twin │ ↓ │   CAM │ ↓ │   BDI │ ↓ │   Causal Reasoning │ ↓ │   Evidence Competition │ ↓ │   World Model │ ↓ │   Prognostics │ ↓ │   PPM │ ↓ │   Decision Engine │ ↓ │   Knowledge Engine │ ↓ │   Engineering Intelligence │ ↓ │   Engineer │ ├── EIR │├── Communication │├── Information Intelligence │├── Knowledge Search │├── Knowledge Extractor │├── Working Memory │└── ACR 

GCS AI — Detailed System Architecture 

- │ ├── Engineering Knowledge 

- │ ├── Aircraft History 

- │ └── Technology Knowledge 

- │ 

- └── SENTINEL 

- ├── Operational Sentinel 

- └── Knowledge Sentinel 

End of GCS AI Detailed System Architecture Document. 

GCS AI — Detailed System Architecture 

