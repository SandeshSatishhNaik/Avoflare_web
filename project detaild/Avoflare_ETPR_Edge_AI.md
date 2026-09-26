AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

# AVOFLARE 

### **ETPR AND EDGE AI TECHNICAL ARCHITECTURE** 

Aircraft-Side Deterministic Telemetry and Autonomous Intelligence 

Technical Design Document — Version 1.0 

Document purpose: Define the aircraft-side telemetry and Edge AI architecture of AVOFLARE, including the deterministic ETPR layer, the CanonicalTelemetryState interface, the onboard AI processing chain, and the communication-loss operating mode. 

Scope boundary: The detailed GCS/cloud AI architecture is intentionally excluded and will be documented separately. 

AVOFLARE Technical Architecture — 1 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **1. Introduction and System Context** 

AVOFLARE is structured as a layered aircraft intelligence architecture in which deterministic telemetry processing is separated from higher-level state estimation, behavior analysis, decision intelligence, and safety enforcement. This separation is important because the AI stack should not be responsible for interpreting raw CAN protocol semantics, while the telemetry layer should not embed model-specific diagnostic or decision logic. 

The aircraft-side processing begins with sensors and ECU-generated CAN traffic. ETPR—Edge Telemetry Processing and Representation—converts these raw frames into a canonical, timestamped, quality-aware representation. The canonical representation is then consumed by the onboard Edge AI pipeline. 

The Edge AI path is designed to remain available when communication with the broader GCS/cloud system is unavailable. Communication availability therefore determines whether external AI resources can be used; it does not determine whether the aircraft can perform local telemetry processing or local AI inference. 

#### **1.1 Architectural Objective** 

The objective of the aircraft-side architecture is to establish a reliable chain from raw telemetry to an actionable, safety-constrained onboard response: 

Sensors / ECU → CAN → ETPR → CanonicalTelemetryState → Edge AI → Safety → Aircraft Response 

The architecture is deliberately divided into three conceptual responsibilities: 

|**Layer**|**Primary question**|**Responsibility**|
|---|---|---|
|ETPR|What did the aircraft measure?|Decode, convert, validate,<br>timestamp, characterize quality,<br>derive deterministic temporal<br>features, and construct canonical<br>telemetry.|
|Edge AI|What does the current telemetry<br>imply?|Estimate physical state, fuse<br>state information, group behavior,<br>analyze temporal patterns, and<br>evaluate operational actions.|
|Safety|What action is permitted?|Apply final deterministic safety<br>constraints and prevent an AI<br>recommendation from bypassing<br>safety requirements.|



#### **1.2 Communication-Independent Edge Principle** 

ETPR is always an aircraft-side service. Its output is available locally regardless of the status of an external communication path. When communication is unavailable, the Edge AI stack uses the same canonical telemetry interface locally. 

AVOFLARE Technical Architecture — 2 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **2. High-Level Aircraft-Side Architecture** 

The architecture has only two major computational domains in this document: ETPR and Edge AI. The GCS/cloud side is treated as an external system boundary and is not expanded here. 

AVOFLARE AIRCRAFT SIDE 

Sensors / ECU | v CAN Bus | v +----------------------------+ | ETPR                       | |                            | | Frame validation           | | Signal decoding            | | Physical conversion        | | Fault / range validation   | | Freshness                  | | Temporal features          | | Canonical state            | +-------------+--------------+ | v CanonicalTelemetryState | v +----------------------------+ | EDGE AI                    | |                            | | PINN / Lite Digital Twin   | |            ↓               | | EKF                        | |            ↓               | | K-means                    | |            ↓               | | Specialized SNN            | |            ↓               | | Dueling Double             | | Distributional QR-DQN      | |            ↓               | | Safety                     | +-------------+--------------+ | v Aircraft Response 

AVOFLARE Technical Architecture — 3 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

#### **2.1 External Communication Boundary** 

The broader communication path may provide access to GCS/cloud processing. That path is external to the detailed architecture in this document. The important aircraft-side property is that ETPR and Edge AI remain locally executable. 

#### **2.2 Communication Failure Behavior** 

ETPR | v Canonical Telemetry | +---- communication available ----> external system path | +---- communication unavailable --> local Edge AI | v Safety | v Aircraft Response 

The fallback mechanism therefore changes the AI execution location rather than creating a second telemetry interpretation pipeline. 

AVOFLARE Technical Architecture — 4 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **3. ETPR Functional Architecture** 

ETPR is the deterministic telemetry boundary between aircraft data sources and downstream intelligence. It is configuration-driven and operates independently of the AI algorithms that consume its output. 

#### **3.1 Functional Stages** 

|**Stage**|**Function**|**Output**|
|---|---|---|
|CAN acquisition|Receive aircraft CAN frames and<br>retain source timing.|Validated frame candidate.|
|Frame validation|Check message identity and<br>payload length before extraction.|Accepted/rejected frame.|
|Signal decoding|Extract configured bit fields and<br>interpret signedness/endianness.|Raw signal value.|
|Physical conversion|Apply scaling and offset.|Engineering-unit value.|
|Fault validation|Identify reserved raw fault<br>encodings.|Fault status.|
|Range validation|Check physical value against<br>configured bounds.|Range status.|
|Freshness|Compare signal age with its<br>individual timeout.|Freshness status.|
|Temporal processing|Calculate deterministic delta,<br>derivative, and configured<br>statistics.|Temporal features.|
|Canonicalization|Assemble values, status, quality,<br>timestamps, and provenance.|CanonicalTelemetryState.|
|Export/interchange|Represent canonical data for<br>analytical workflows.|Arrow/canonical analytical view.|



#### **3.2 Contract-Driven Operation** 

The signal configuration is the authoritative source for decoding and validation parameters. The runtime pipeline should not hard-code individual signal interpretation into model logic. A signal definition contains the information required to transform its CAN representation into a physical quantity and determine its expected update behavior. 

#### **3.3 Current Signal Coverage** 

The current telemetry specification contains 60 signals distributed across 17 CAN identifiers in the 0x100– 0x110 range. The signal definitions include different widths, signedness, engineering units, update frequencies, engineering ranges, and reserved fault encodings. 

AVOFLARE Technical Architecture — 5 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **4. CAN Frame Processing and Signal Decoding** 

#### **4.1 CAN Frame Representation** 

A received frame is represented conceptually as: 

F_k = (ID_k, DLC_k, D_k, t_k) 

The frame identifier and payload length are checked before signal extraction. The source timestamp is retained as telemetry provenance and is used for freshness and temporal processing. 

#### **4.2 Bit-Level Signal Extraction** 

For a configured signal i, the raw value is obtained by applying its field definition to the payload: 

r_i = Decode(D, b_i, l_i, e_i) 

where b_i is the start bit, l_i is the bit length, and e_i represents the configured encoding/endianness semantics. The implementation supports different signal widths and sub-byte or cross-byte extraction. 

#### **4.3 Signed and Unsigned Representation** 

Signed signals are interpreted according to their configured signedness. The decoder reconstructs the signed integer representation before engineering conversion. Unsigned signals retain their non-negative raw representation. 

#### **4.4 Traceability of Raw Values** 

The raw decoded value is retained in canonical state. This provides a reproducible connection between the original CAN encoding and the physical engineering value. 

#### **4.5 Example** 

Signal: RPM CAN ID: 0x100 Payload bytes: [0x60, 0x09, 0, 0, 0, 0, 0, 0] Raw field: 0x0960 = 2400 Scale: 1.0 Offset: 0 Engineering value: 2400 rpm 

The downstream Edge AI therefore receives an engineering quantity rather than a CAN-specific representation. 

AVOFLARE Technical Architecture — 6 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **5. Physical Conversion and Signal Validation** 

#### **5.1 Engineering Conversion** 

The physical conversion is deterministic: 

x_i = Offset_i + ScalingFactor_i × r_i 

For example, a raw value of 2500 with scale 0.1 and offset 0 produces 250.0 engineering units. 

#### **5.2 Validation Ordering** 

Validation is structured so that explicit reserved-fault encodings are identified before treating a value as a normal engineering observation. Physical range validation is then applied to the converted value. Freshness is evaluated against the source timestamp at snapshot/query time. 

Raw value | +--> reserved fault? ---- yes --> ReservedFault | no | Physical conversion | +--> outside range? ----- yes --> OutOfRange | no | Freshness evaluation at snapshot time | +--> too old? ------------ yes --> Stale | no | Valid 

The state machine distinguishes the reason for invalidity instead of reducing every failure to a single boolean. 

#### **5.3 Reserved Fault** 

A reserved raw encoding represents an explicit invalid or fault condition defined by the signal contract. For a 16-bit signal whose reserved value is 0xFFFF, an input equal to that value is marked ReservedFault rather than being interpreted as a normal physical measurement. 

#### **5.4 Range Validation** 

The physical value is compared with its configured engineering bounds: 

x_min ≤ x_i ≤ x_max 

If the condition fails, the signal is marked OutOfRange. The implementation can retain the unmodified converted value for traceability rather than silently clamping it. 

AVOFLARE Technical Architecture — 7 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **6. Freshness, Status, and Quality Semantics** 

#### **6.1 Signal-Specific Freshness** 

Signals have heterogeneous update frequencies. A global timeout would incorrectly classify slow signals as stale or permit fast signals to remain valid for too long. ETPR therefore calculates a signal-specific nominal period and timeout: 

T_i = 1 / f_i 

T_timeout,i = 3T_i 

|**Frequency**|**Period**|**Timeout**|
|---|---|---|
|50 Hz|20 ms|60 ms|
|20 Hz|50 ms|150 ms|
|10 Hz|100 ms|300 ms|
|5 Hz|200 ms|600 ms|
|1 Hz|1 s|3 s|
|0.1 Hz|10 s|30 s|



#### **6.2 Status Definitions** 

|**Status**|**Definition**|**Physical value handling**|
|---|---|---|
|Valid|Observation exists and passes<br>configured checks.|Valid current value.|
|Missing|No observation has been received<br>since initialization.|No current value; invalid/NaN<br>representation.|
|Stale|Observation existed, but age<br>exceeds its signal-specific<br>timeout.|Last value may be retained with<br>stale status.|
|ReservedFault|Raw value equals configured<br>reserved-fault encoding.|Invalid/NaN representation.|
|OutOfRange|Converted physical value violates<br>configured bounds.|Converted value may be retained<br>without clamping.|



#### **6.3 Missing versus Stale** 

Missing and Stale represent different telemetry histories. Missing means that no observation has ever arrived. Stale means that an observation was previously received but is no longer fresh. 

This distinction is important to downstream state estimation. A stale value contains historical information and a timestamp; a missing signal has no observed value from the current runtime instance. 

#### **6.4 Quality Representation** 

q_i = q_range,i × q_fault,i × q_fresh,i 

The current binary quality representation provides a compact validity mask. The explicit status remains necessary because q_i alone does not explain why a signal is invalid. 

AVOFLARE Technical Architecture — 8 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

#### **6.5 Canonical Snapshot Time** 

A canonical snapshot is queried at a common time, but each signal retains its own source timestamp and independently evaluated freshness. Consequently, synchronized representation does not imply simultaneous physical sampling. 

AVOFLARE Technical Architecture — 9 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **7. Temporal Feature Processing** 

#### **7.1 First Difference** 

For consecutive valid observations: 

− − Δx_t = x_t x_(t 

1) 

The difference captures the change between consecutive observations. 

#### **7.2 Time Derivative** 

dx/dt ≈ (x_t − x_(t 

1)) / Δt 

The derivative is calculated only when Δt > 0 and the required current and previous observations satisfy the validity conditions. 

#### **7.3 Invalid-State Recovery** 

When a signal transitions from an invalid condition back to a valid condition, the implementation avoids treating the recovery jump as a normal dynamic transition. This prevents false derivative spikes caused by telemetry validity transitions. 

#### **7.4 Change Detection** 

|Δx_t| > θ_i  →  change_detected = true 

The change threshold is signal-specific. Change detection is deterministic and is not a fault classifier. 

#### **7.5 Rolling Statistics and Bounded History** 

ETPR maintains bounded temporal history using ring buffers. Where configured, rolling mean, variance, and standard deviation can be calculated from the bounded history. This provides temporal context without unbounded memory growth. 

#### **7.6 Model Independence** 

ETPR temporal features are intentionally model-agnostic. A derivative is a numerical feature; it is not inherently an SNN spike rate. If an SNN consumes it, a separate input-encoding stage converts the numerical feature into the representation required by the SNN. 

AVOFLARE Technical Architecture — 10 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **8. CanonicalTelemetryState** 

CanonicalTelemetryState_t is the principal output contract of ETPR. It consolidates the physical measurement, source information, temporal information, and data-quality semantics required by downstream AI. 

#### **8.1 Logical Data Model** 

|**Section**|**Representative contents**|**Purpose**|
|---|---|---|
|Physical|60 engineering-unit signals|Primary numerical telemetry.|
|Raw|Decoded raw representations|Traceability and reproducibility.|
|Temporal|Delta, derivative, configured<br>rolling statistics|Dynamic behavior features.|
|Quality|q_i|Compact validity mask.|
|Status|Valid, Missing, Stale,<br>ReservedFault, OutOfRange|Reason for validity/invalidity.|
|Provenance|Signal identity, CAN ID, source<br>timestamp|Source traceability.|
|Metadata|Configuration/version information<br>as required|Contract and interpretation<br>context.|



#### **8.2 Traceability Invariant** 

For a valid signal, the canonical representation preserves the source CAN identifier, source timestamp, raw decoded value, physical engineering value, and status. This permits downstream systems to trace an AI input back to its telemetry source. 

Example: CAN ID       = 0x100 timestamp    = source frame timestamp raw value    = 2400 physical     = 2400.0 rpm status       = Valid 

#### **8.3 Configuration Separation** 

Static signal definitions are configuration; runtime signal state is mutable data. Runtime frame processing updates pipeline state without modifying the signal-definition contract. This separation prevents accidental coupling between configuration and live telemetry. 

#### **8.4 Arrow Representation** 

The current wide analytical representation contains 361 columns under the defined six-field-per-signal layout: 

1 + (60 × 6) = 361 columns 

Arrow is treated as a representation/interchange layer for canonical telemetry. It is not a separate algorithm in the AVOFLARE decision chain. 

AVOFLARE Technical Architecture — 11 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **9. ETPR-to-Edge-AI Interface Specification** 

The ETPR-to-Edge-AI interface is the most important software boundary in the aircraft-side architecture. Edge AI consumes CanonicalTelemetryState and does not duplicate CAN decoding, scaling, or low-level validation. 

#### **9.1 Interface Contents** 

|**Interface item**|**Required meaning**|
|---|---|
|Physical value|Engineering-unit measurement or invalid<br>representation.|
|Raw value|Original decoded raw representation where<br>available.|
|Timestamp|Source measurement timestamp.|
|Signal identity|Stable signal identifier.|
|CAN source|Source CAN identifier.|
|Status|Explicit validity state.|
|Quality|Compact quality/validity mask.|
|Delta|Deterministic sample-to-sample change when<br>valid.|
|Derivative|Deterministic rate of change when valid.|
|Metadata|Contract/version information needed for<br>interpretation.|



#### **9.2 Edge AI Input Principle** 

Edge AI should select the relevant portions of the canonical state for each algorithm. ETPR should not be redesigned around the input vector of one particular AI model. 

This preserves modularity: the telemetry contract describes the aircraft, while each AI model defines which canonical variables it requires. 

#### **9.3 Quality-Aware Consumption** 

AI components must use the status and quality information when interpreting observations. A stale measurement must not be treated as equivalent to a fresh measurement merely because both contain numerical values. 

#### **9.4 Stable Boundary** 

The ETPR contract should be treated as a stable interface. Changes to individual AI models should not require changes to CAN decoding or telemetry validation unless a new physical signal or telemetry requirement is formally introduced. 

AVOFLARE Technical Architecture — 12 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **10. Edge AI Architecture and Responsibilities** 

The onboard Edge AI pipeline transforms canonical telemetry into increasingly higher-level representations. Each stage has a distinct responsibility and should not duplicate the role of another stage. 

|**Stage**|**Primary role**|**Primary output**|
|---|---|---|
|PINN / Lite Digital Twin|Physics-informed current<br>physical-state estimation.|Current-state estimate.|
|EKF|Recursive state estimation and<br>uncertainty tracking.|State estimate and covariance.|
|K-means|Current behavior/trend grouping.|Cluster identity/key.|
|Specialized SNN|Temporal analysis of cluster-<br>relevant behavior.|Behavior/fault evidence.|
|Dueling Double Distributional QR-<br>DQN|Operational action valuation.|Action-value distributions /<br>selected recommendation.|
|Safety|Final constraint and authority<br>layer.|Permitted aircraft action.|



#### **10.1 PINN / Lite Digital Twin** 

The current AVOFLARE role of the PINN/Lite Digital Twin is current physical-state estimation. It uses relevant canonical observations together with operating/control/environment variables to estimate an underlying current state. 

xJ _t = f_θ(y_t, u_t, e_t) 

The physics component constrains the learned estimator during training. The exact physical state vector and governing equations must be derived from the validated MATLAB/Simulink physics source; they should not be invented merely to fill the architecture document. 

The output is a physics-informed current-state estimate. It is not, by itself, a final fault diagnosis or aircraft action. 

#### **10.2 EKF** 

The EKF combines state-transition information and measurement information recursively while maintaining covariance. 

− x_t = f(x_(t 1), u_t) + w_t y_t = h(x_t) + v_t w_t ~ N(0,Q) v_t ~ N(0,R) 

The result is a temporally consistent state estimate with uncertainty information that can be consumed by later stages. 

#### **10.3 K-means** 

K-means groups the current behavior/trend feature representation into learned clusters. The selected cluster generates a key that determines which specialized temporal analysis path is relevant. 

μ_k||² 

− k* = argmin_k ||F_t 

The cluster key is a routing/hypothesis mechanism. It is not treated as the final confirmation of a fault. 

AVOFLARE Technical Architecture — 13 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

#### **10.4 Specialized SNN** 

The selected SNN receives the relevant EKF information associated with the identified cluster and analyzes temporal behavior. Its purpose is to provide evidence about patterns such as onset, persistence, progression, or severity trend. 

#### **10.5 Dueling Double Distributional QR-DQN** 

The decision layer evaluates the available operational actions using a distributional return representation. Dueling decomposition separates state value from action advantage, double-Q logic reduces selection/evaluation coupling, and quantile regression represents the return distribution. 

#### **10.6 Safety Layer** 

Safety is the final authority. The decision model can recommend an operational action, but the safety layer determines whether that action is permitted under the defined constraints. 

AVOFLARE Technical Architecture — 14 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **11. Communication Loss and Autonomous Edge Operation** 

The defining resilience property of the aircraft-side design is that the local telemetry and AI chain does not depend on continuous external communication. 

#### **11.1 Normal Operation** 

ETPR continuously converts CAN telemetry into CanonicalTelemetryState. The aircraft can expose this state to the broader communication path while retaining the local Edge AI capability. 

#### **11.2 Communication Failure** 

When communication to the broader GCS/cloud system is unavailable, the aircraft does not need to create a different telemetry representation. ETPR continues operating and the local Edge AI consumes the same canonical state. 

Communication unavailable | v Local ETPR | v CanonicalTelemetryState | v Edge AI | v Safety | v Local aircraft response 

#### **11.3 Why ETPR Must Remain Independent** 

If telemetry processing were coupled to external AI services, communication failure could also interrupt the aircraft's ability to establish trusted local telemetry. Keeping ETPR local ensures that the aircraft retains deterministic signal interpretation, quality assessment, timestamps, and temporal features even when the external link is unavailable. 

#### **11.4 Recovery** 

When external communication becomes available again, the broader system can resume its normal communication path. State reconciliation, cloud synchronization, and fleet-level processing are outside this document. 

#### **11.5 Critical Requirement** 

The Edge AI path must be capable of operating using locally available canonical telemetry for control-critical onboard inference. A live external response must not be an implicit prerequisite for every critical local decision. 

AVOFLARE Technical Architecture — 15 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **12. Software and Runtime Architecture** 

#### **12.1 Current Technology Allocation** 

|**Component**|**Technology**|**Reason for allocation**|
|---|---|---|
|ETPR|Rust|Deterministic, bounded, low-level<br>telemetry processing and runtime<br>control.|
|PINN / Lite Digital Twin|Julia|Scientific computing and physics-<br>oriented model development.|
|EKF|Python|Rapid scientific implementation<br>and numerical ecosystem.|
|K-means|Python|Model development and<br>clustering ecosystem.|
|Specialized SNN|Python|Neural/spiking model<br>development ecosystem.|
|Dueling Double Distributional QR-<br>DQN|Python|Reinforcement-learning<br>development ecosystem.|
|Safety|Python initially|Initial system implementation;<br>deployment strategy can be<br>hardened/optimized later.|



#### **12.2 Deployment Model** 

Research and training environments may use Python and Julia directly. Trained neural models can subsequently be exported into a portable inference representation where required, allowing the aircraft runtime to use optimized inference engines without moving CAN interpretation into the model runtime. 

#### **12.3 Runtime Separation** 

The runtime should preserve the distinction between deterministic telemetry services and model inference services. An AI model failure should not corrupt the underlying telemetry state, and telemetry validation should not depend on successful AI inference. 

#### **12.4 Resource Constraints** 

- ETPR memory usage should remain bounded. 

- Temporal buffers should have explicit capacities. 

- AI inference must satisfy the aircraft's latency and compute budget. 

- The local system must remain operational during communication loss. 

- Model interfaces should be versioned and validated. 

- Safety processing should remain available independently of AI model output. 

AVOFLARE Technical Architecture — 16 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **13. Verification, Testing, and Invariants** 

The implementation evidence supplied for the current ETPR codebase describes automated tests covering the major deterministic processing functions and reports successful execution without reported failures. 

#### **13.1 Invariant 7 — Data Traceability** 

The canonical state preserves the source CAN ID, source timestamp, raw decoded value, physical engineering value, and signal status. This establishes a traceable chain from source frame to AI input. 

#### **13.2 Invariant 8 — Configuration Separation** 

Static signal definitions are separated from runtime telemetry state. A new pipeline instance starts with its own runtime state while the signal-definition contract remains unchanged. 

#### **13.3 Invariant 9 — Explicit Invalidity** 

The implementation distinguishes ReservedFault, OutOfRange, Stale, and Missing. This prevents all invalid measurements from collapsing into an unexplained boolean failure. 

#### **13.4 Decoder Verification** 

Decoder tests cover 8-, 16-, and 32-bit values, sub-byte/cross-boundary extraction, and signed/unsigned interpretation. 

#### **13.5 Conversion Verification** 

Conversion tests verify the configured scaling and offset formula across the defined signal types. 

#### **13.6 Freshness Verification** 

Freshness tests verify signal-specific timeout behavior and the transition from an existing valid observation to Stale when the configured age threshold is exceeded. 

#### **13.7 Temporal Verification** 

Temporal tests verify derivatives, time intervals, invalid timing conditions, and bounded temporal buffers. 

#### **13.8 Integration Verification** 

The reported comprehensive integration tests verify that the ETPR stages work together from raw CAN input through canonical output. 

#### **13.9 Release Verification Requirement** 

Before a formal release, the exact repository test command and resulting counts should be recorded in the verification report. This document treats the supplied test evidence as implementation evidence rather than as a certification claim. 

AVOFLARE Technical Architecture — 17 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **14. System Requirements and Design Rules** 

#### **14.1 ETPR Requirements** 

|**ID**|**Requirement**|
|---|---|
|ETPR-01|Decode telemetry according to the configured signal<br>contract.|
|ETPR-02|Preserve source timestamps.|
|ETPR-03|Preserve raw decoded values for traceability.|
|ETPR-04|Apply deterministic physical conversion.|
|ETPR-05|Detect configured reserved fault encodings.|
|ETPR-06|Perform engineering-range validation.|
|ETPR-07|Evaluate freshness per signal.|
|ETPR-08|Expose explicit signal status.|
|ETPR-09|Generate deterministic temporal features only<br>under valid timing/data conditions.|
|ETPR-10|Maintain bounded temporal history.|
|ETPR-11|Produce CanonicalTelemetryState.|
|ETPR-12|Remain independent of downstream AI model<br>execution.|



#### **14.2 Edge AI Requirements** 

|**ID**|**Requirement**|
|---|---|
|EDGE-01|Consume canonical telemetry rather than raw CAN<br>frames.|
|EDGE-02|Respect ETPR status and quality information.|
|EDGE-03|Estimate current system state using the defined<br>PINN/Lite Digital Twin.|
|EDGE-04|Maintain recursive state and uncertainty using EKF.|
|EDGE-05|Use K-means to form behavior/trend groups and<br>produce routing keys.|
|EDGE-06|Use the selected SNN for cluster-specific temporal<br>analysis.|
|EDGE-07|Use QR-DQN for action valuation under the defined<br>action/reward formulation.|
|EDGE-08|Apply Safety as final authority.|
|EDGE-09|Operate locally when external communication is<br>unavailable.|
|EDGE-10|Maintain stable module interfaces.|



#### **14.3 Architectural Non-Goals** 

- ETPR is not a fault-diagnosis neural network. 

AVOFLARE Technical Architecture — 18 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

- ETPR is not a flight decision engine. 

- K-means is not the final fault confirmation mechanism. 

- The SNN is not the action-selection authority. 

- QR-DQN is not the final safety authority. 

- Communication loss must not force the aircraft to interpret raw CAN data using a different software path. 

AVOFLARE Technical Architecture — 19 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **15. End-to-End Technical Summary** 

The AVOFLARE aircraft-side architecture establishes a deterministic telemetry foundation followed by modular onboard intelligence. Raw aircraft telemetry enters through CAN and is processed by ETPR. ETPR decodes each signal according to its contract, converts it into engineering units, identifies reserved faults, validates engineering ranges, evaluates freshness, calculates deterministic temporal features, and assembles the CanonicalTelemetryState. 

The canonical state contains the physical measurement together with the information needed to judge its provenance and quality. This prevents downstream AI models from having to reconstruct telemetry semantics and allows AI components to operate on a stable aircraft-oriented interface. 

The Edge AI pipeline then operates on this canonical state. The PINN/Lite Digital Twin estimates the current physical state under physics constraints. The EKF recursively estimates state and uncertainty. K-means groups current behavior and generates a routing key. A specialized SNN analyzes the relevant temporal behavior. Dueling Double Distributional QR-DQN evaluates operational actions. The Safety layer remains the final authority over what action is permitted. 

The architecture is resilient to communication loss because ETPR and Edge AI remain local to the aircraft. When external communication is available, the broader system can use the external path. When communication fails, the local canonical telemetry continues to feed the onboard Edge AI and Safety chain. 

Final aircraft-side contract: 

Sensors / ECU ↓ CAN ↓ ETPR ↓ CanonicalTelemetryState ↓ PINN / Lite Digital Twin ↓ EKF ↓ K-means ↓ Specialized SNN ↓ Dueling Double Distributional QR-DQN ↓ Safety ↓ Aircraft Response 

#### **15.1 Architectural Boundary** 

ETPR ends at CanonicalTelemetryState. Edge AI begins at that interface. This boundary should be treated as a controlled software contract so that telemetry implementation and AI model development can evolve independently. 

AVOFLARE Technical Architecture — 20 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

#### **15.2 Communication Resilience Principle** 

External communication may expand computational capability, but it is not the foundational dependency of the aircraft's local telemetry and Edge AI chain. Local operation remains possible using ETPR-generated canonical telemetry. 

#### **15.3 Current Architecture Baseline** 

The architecture defined in this document is the current aircraft-side baseline. Detailed physical equations for the Digital Twin, exact model dimensions, EKF matrices, K-means cluster count, SNN architecture, QRDQN hyperparameters, and formal Safety rules should be frozen in their respective detailed specifications after the required validation work. 

AVOFLARE Technical Architecture — 21 

AVOFLARE | ETPR & EDGE AI TECHNICAL ARCHITECTURE 

## **Appendix A — Core Mathematical Definitions** 

|**Function**|**Definition**|
|---|---|
|Raw decoding|r_i = Decode(D, b_i, l_i, e_i)|
|Physical conversion|x_i = Offset_i + ScalingFactor_i × r_i|
|Signal period|T_i = 1 / f_i|
|Freshness timeout|T_timeout,i = 3T_i|
|Quality|q_i = q_range,i × q_fault,i × q_fresh,i|
|First difference|Δx_t = x_t − x_(t−1)|
|Derivative|dx/dt ≈ (x_t − x_(t−1)) / Δt|
|Change detection||Δx_t| > θ_i|
|K-means assignment|k* = argmin_k ||F_t − μ_k||²|
|PINN current-state estimate|xY _t = f_θ(y_t, u_t, e_t)|



## **Appendix B — Terminology** 

|**Term**|**Definition**|
|---|---|
|ETPR|Edge Telemetry Processing and Representation.|
|CanonicalTelemetryState|Standardized telemetry state containing physical<br>values, quality/status, temporal information, and<br>provenance.|
|PINN / Lite Digital Twin|Physics-informed current physical-state estimation<br>component.|
|EKF|Extended Kalman Filter for recursive state<br>estimation and covariance tracking.|
|K-means|Behavior/trend clustering mechanism producing a<br>cluster key.|
|SNN|Specialized Spiking Neural Network for temporal<br>behavior analysis.|
|QR-DQN|Quantile Regression Distributional Deep Q-<br>Network; used with dueling and double-Q structure.|
|Safety|Final constraint and authority layer for aircraft<br>action.|



AVOFLARE Technical Architecture — 22 

