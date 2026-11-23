# Challenge 03 · Grid sensor placement (QAOA)

UnState's solution to challenge 03 of the Quantum Computing Challenge 2026, Riyadh: [03_move_grid_sensors_qaoa.ipynb](03_move_grid_sensors_qaoa.ipynb).

## Original

This notebook comes from the organizers' repository:

- **Repository:** [QTACInstitute/Quantum-Computing-Challenge](https://github.com/QTACInstitute/Quantum-Computing-Challenge)
- **Original notebook:** [notebooks/03_move_grid_sensors_qaoa.ipynb](https://github.com/QTACInstitute/Quantum-Computing-Challenge/blob/main/notebooks/03_move_grid_sensors_qaoa.ipynb)
- **Credits:** prepared by Ahmed Elghadban, [Quantumy](https://quantumy.ai). Reviewed by Ola Tarig.

The text, the checks and the `qff` helper package are theirs. Our work is the solutions to tasks T1, T2 and T3.

## Run it

The notebook needs the `qff` package from the original repository. From this folder:

```bash
git clone https://github.com/QTACInstitute/Quantum-Computing-Challenge.git
pip install -r Quantum-Computing-Challenge/requirements.txt
jupyter lab 03_move_grid_sensors_qaoa.ipynb
```

On Google Colab, the first cell does this for you.

## Results

| QAOA layers | Chance of a best placement | Two-qubit gates |
|---|---|---|
| Random guess | 3% | 0 |
| 1 | 11% | 14 |
| 2 | 28% | 28 |
| 3 | 51% | 42 |

These come from an exact, noise-free simulation of 6 substations. Brute force finds the same 3-sensor answer instantly, so nothing here shows a quantum advantage.
