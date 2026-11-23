# Slide notes: KACST Qiskit Fall Fest 2026

These notes summarize the three decks in this folder, as reference for the challenge.

## 1. Introduction to Qiskit (Joud Alshehri, QSaudiArabia): `Introduction to Qiskit.Joud.pdf`
Companion notebook: `notebooks/Introduction_to_Qiskit_Challenges_Participants.ipynb`
- Method: **Predict → Code → Run → Analyze**. Rule: "Explain the why, not just the answer."
- Four ideas: superposition, measurement, phase/interference, entanglement. The Bloch sphere: every single-qubit gate is a rotation.
- Gates: X (NOT), H (superposition), Z (phase flip on |1⟩), CX (`cx(control, target)`), RY(θ).
- Identities: H·H = I, H·Z·H = X.
- Bell state: H then CNOT gives (|00⟩+|11⟩)/√2. GHZ state: add `cx(1,2)`.
- Seeing correlations alone is not a Bell-inequality test, which needs measurements in different bases.
- H₂ VQE toy: `ry(θ,0); cx(0,1); x(0)` with H = −1.0524 II + 0.3979 IZ − 0.3979 ZI − 0.0113 ZZ + 0.1809 XX. The minimum is **−1.8572 Ha at θ ≈ −0.22** (θ=0 gives −1.837).
- Qiskit history: 2016 cloud, 5 qubits; Qiskit open-sourced on 7 Mar 2017; 1.0 in 2024; 2.x (Rust core); v2.6 released Oct 2026. The notebooks need Qiskit ≥ 2.1.
- Qiskit Patterns: **Map → Optimize → Execute → Post-process**.
- Common mistakes: forgetting to measure; reading bits backwards (little-endian, q0 is the rightmost bit); swapped CNOT wires; old `Aer`/`execute` imports; degrees instead of radians; expecting exact counts; skipping transpile on hardware (`generate_preset_pass_manager`).

## 2. Fundamentals of Quantum Algorithms (Haya Alhawas, sirar by stc / SQCA): `Qiskit_Fall_Fest_2026_FOQA.v3.pptx`
Theme: "What can one call to a black box tell us?" The deck is mostly visuals, so the text is sparse.
- **Deutsch (1985):** with 1 bit, tells constant from balanced in one query. Uses phase kickback: the target is in |−⟩, so the oracle writes (−1)^f(x), and the final H turns matching or opposite signs into 0 or 1.
- **Deutsch–Jozsa (1992):** with n = 3 bits (8 inputs), constant means all equal and balanced means four 0s and four 1s. Classically, 4 matching answers still leave it undecided (2^(n−1)+1 queries are needed). Quantumly, one query is enough: readout 000 means constant, because the 000 amplitude is the average of the signs and cancels for balanced f.
- **Bernstein–Vazirani (1993):** f(x) = s·x mod 2 with a 4-bit s. Classically you need n one-hot queries. Quantumly, one query gives the whole s. It uses the same circuit shape as DJ.
- **Simon (1994):** f(x) = f(x⊕s), the "twin rule". Each run returns a y with y·s = 0 (the clue). Collect about n−1 independent clues and solve the linear system over GF(2). y = 000 carries no information.
- Common pipeline: **Superpose (H⊗n) → Query (oracle as a phase) → Interfere (H⊗n / QFT†) → Measure a global property.**

## 3. Quantum Algorithms from First Principles (Muhammad Faryad, LUMS): `QuantumAlgorithms_SaudiQiskitFallFest_2026_v3.pdf`
Covers Grover, QFT/QPE, VQE and QAOA. Companion repo: **github.com/muf148/quantum-algorithms-first-principles** (Qiskit 2.x + Aer, MIT licence).

### ⚠️ Likely challenge format
> "After this talk: pick one of the four and build an interactive, visual demo of how it works. Each section ends with demo ideas and the question a jury is likely to ask."

**What the jury wants (slide 35):**
1. **Mechanism, not magic:** make amplitudes, phases or energies visible as they change.
2. **Interaction that teaches:** every slider (N, μ, c, θ, R…) must visibly change something.
3. **Correctness you can check:** compare against a classical reference (brute force, numpy eigenvalues, FCI).
4. **Honest limits:** show the failure mode on purpose (overshooting, non-dyadic θ, shot noise).
5. **A three-minute story:** problem → key idea → one worked instance → what it costs. Rehearse it, then let the jury use the sliders.

"Pick the algorithm whose picture you can already draw on a napkin."

### Grover
- Oracle U_f = I − 2|w⟩⟨w| (flips the sign). Diffuser V = 2|s⟩⟨s| − I, which is inversion about the mean, coded as H X C^(n−1)Z X H.
- Geometry: sin θ = 1/√N, and each iteration rotates by 2θ. Pr = sin²((2r+1)θ), and the best r is about (π/4)√(N/μ).
- For N=8, Pr(w) by r: 1→0.78, 2→0.95, 3→0.33, **4→0.01**, 5→0.55, 6→1.00. Overshooting makes it worse.
- It is not a database search. It needs f computed as a circuit, and it halves effective AES key length.
- Demo ideas: amplitude bars step by step; the live rotation picture; an oracle from a real predicate (3-SAT or Sudoku).
- **Jury question:** "Why does running more iterations make the answer worse?" (and "what did your oracle actually compute?")

### QFT and phase estimation
- QFT|j⟩ = (1/√N) Σ e^{2πijk/N}|k⟩. On 1 qubit it is H. In product form there is no entanglement, and j lives in the phases.
- Gates: n H + n(n−1)/2 controlled phases + ⌊n/2⌋ SWAPs, so O(n²). Use **CPhaseGate, not RZ**. The approximate QFT drops R_k for k > log₂(n/ε). Qiskit is little-endian, so its circuit looks mirrored.
- QPE: U|u⟩ = e^{2πiθ}|u⟩. Controlled U^(2^t) shifts the binary point (phase kickback). Then QFT† gives the bits of θ, with θ ≈ m/2^c. It costs 2^c − 1 applications of U.
- Example: S on |1⟩ gives θ = 1/4, so with c=3 you read 010 deterministically.
- For non-dyadic θ the result is a sinc² peak, with Pr(best m) ≥ 4/π² ≈ 0.41 (θ=0.3, c=4 gives 0.88).
- Uses: Shor (order finding), chemistry, HHL, amplitude estimation.
- Demo ideas: the phase odometer; QPE histogram sharpening as c grows; iterative single-ancilla QPE.
- **Jury question:** "What does one more counting qubit cost you, in qubits and in applications of U?"

### VQE
- Variational principle: E(θ) = ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀, so the estimate approaches the true value from above.
- For H₂ (STO-3G, 2 qubits): H = g₀I + g₁Z₀ + g₂Z₁ + g₃Z₀Z₁ + g₄X₀X₁ + g₅Y₀Y₁. The Hartree–Fock reference is |01⟩, and RY + CNOT mixes in |10⟩.
- The loop: the QPU prepares the state and measures, then a classical optimizer (COBYLA, SPSA) proposes the next θ. On a statevector, COBYLA converges in about 10 iterations.
- Dissociation curve: PySCF → Jordan–Wigner, 4 qubits → UCCD → COBYLA over 23 bond lengths. VQE matches FCI, while HF misses bond breaking by about 0.25 Ha.
- Qiskit: `SparsePauliOp`, `EfficientSU2`, `EstimatorV2`, `scipy.optimize.minimize`.
- Pitfalls: barren plateaus, noise, measurement cost, optimizer choice.
- Demo ideas: an energy landscape explorer (θ and R sliders, HF and FCI lines); an optimizer race with a noise toggle; how ⟨H⟩ is assembled from Pauli terms, with error bars shrinking as 1/√shots.
- **Jury question:** "Why does the energy never go below the true ground state, and what makes it go above?"

### QAOA (MaxCut)
- C = Σ_edges (1 − Z_iZ_j)/2. It is diagonal, so you want the largest eigenvalue.
- Cost layer: RZZ(γ) per edge. Mixer: RX(2β) on every qubit. Start from |+⟩⊗n, use p layers (2p angles).
- At p=1 the best ⟨C⟩ is about 4.1 of 5. γ is periodic in 2π and β in π.
- Approximation ratio goes from 0.82 to 0.99 for p=1…4. For 3-regular graphs, p=1 guarantees 0.692, while classical Goemans–Williamson gives 0.878.
- Honesty points: the classical bar is high; depth grows with edges and SWAPs; constraints need penalties.
- Demo ideas: the cut live with a (γ,β) landscape; depth vs quality compared with local search; beyond MaxCut (partitioning with a penalty term).
- **Jury question:** "What does the cost layer do that a classical algorithm cannot, and did you beat local search?"

### Comparison table (slide 34)
| | Grover | QFT/QPE | VQE | QAOA |
|---|---|---|---|---|
| Speed-up | O(√N) | n bits from ~2ⁿ uses of U | none proven | none proven |
| Core move | 2 reflections = rotation | powers of U shift the binary point | E(θ) ≥ E₀ | cost and mixer layers |
| Failure mode | overshooting r | non-dyadic θ | barren plateaus, noise | flat landscape, shallow p |
| Era | fault-tolerant | fault-tolerant | today | today |
