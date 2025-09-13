/*
  # Seed Sample Cambridge Past Paper Questions

  This migration populates the questions table with sample Cambridge past paper questions
  across different subjects to demonstrate the application functionality.

  1. Sample Questions
    - Mathematics (IGCSE, AS Level, A Level)
    - Physics (IGCSE, AS Level, A Level)
    - Chemistry (IGCSE, AS Level, A Level)
    - Biology (IGCSE, AS Level, A Level)
    - Economics (AS Level, A Level)
    - Business Studies (IGCSE, AS Level)
    - Computer Science (IGCSE, AS Level)

  2. Data Structure
    - Each question includes realistic question text
    - Comprehensive mark schemes
    - Relevant keywords for search optimization
    - Proper metadata (subject, year, session, paper)
*/

-- Mathematics Questions
INSERT INTO questions (subject, year, session, paper_number, question_text, mark_scheme, keywords) VALUES
('Mathematics', 2023, 'May/June', '1', 'Find the derivative of f(x) = 3x² + 2x - 1', 'f''(x) = 6x + 2

Step-by-step solution:
1. Apply the power rule to each term
2. d/dx(3x²) = 6x
3. d/dx(2x) = 2  
4. d/dx(-1) = 0
5. Therefore f''(x) = 6x + 2

[3 marks total: 1 mark for each correct term]', ARRAY['derivative', 'differentiation', 'power rule', 'calculus']),

('Mathematics', 2023, 'Oct/Nov', '2', 'Solve the quadratic equation 2x² - 5x + 2 = 0', 'x = 2 or x = 1/2

Method 1 - Factoring:
2x² - 5x + 2 = 0
(2x - 1)(x - 2) = 0
Therefore x = 1/2 or x = 2

Method 2 - Quadratic Formula:
x = (5 ± √(25 - 16))/4 = (5 ± 3)/4
x = 2 or x = 1/2

[4 marks: 2 marks for correct method, 2 marks for both solutions]', ARRAY['quadratic', 'equation', 'factoring', 'quadratic formula']),

('Mathematics', 2022, 'May/June', '1', 'Find the area under the curve y = x² between x = 0 and x = 3', 'Area = 9 square units

Solution:
∫₀³ x² dx = [x³/3]₀³ = 27/3 - 0 = 9

Step-by-step:
1. Set up the definite integral ∫₀³ x² dx
2. Find antiderivative: ∫x² dx = x³/3
3. Apply limits: [x³/3]₀³ = 27/3 - 0 = 9

[4 marks: 1 mark for setup, 2 marks for integration, 1 mark for final answer]', ARRAY['integration', 'definite integral', 'area under curve', 'calculus']),

-- Physics Questions  
('Physics', 2023, 'May/June', '1', 'A car accelerates from rest to 20 m/s in 5 seconds. Calculate the acceleration and distance traveled.', 'Acceleration = 4 m/s²
Distance = 50 m

Given:
- Initial velocity (u) = 0 m/s
- Final velocity (v) = 20 m/s  
- Time (t) = 5 s

For acceleration:
a = (v - u)/t = (20 - 0)/5 = 4 m/s²

For distance:
s = ut + ½at² = 0 + ½(4)(25) = 50 m
OR s = (u + v)t/2 = (0 + 20)(5)/2 = 50 m

[6 marks: 3 marks for acceleration calculation, 3 marks for distance]', ARRAY['kinematics', 'acceleration', 'motion', 'equations of motion']),

('Physics', 2023, 'Oct/Nov', '2', 'Calculate the resistance of a wire with length 2m, cross-sectional area 1.5 × 10⁻⁶ m² and resistivity 1.7 × 10⁻⁸ Ωm', 'Resistance = 0.023 Ω

Using R = ρL/A

Given:
- Length (L) = 2 m
- Area (A) = 1.5 × 10⁻⁶ m²
- Resistivity (ρ) = 1.7 × 10⁻⁸ Ωm

R = (1.7 × 10⁻⁸ × 2)/(1.5 × 10⁻⁶)
R = (3.4 × 10⁻⁸)/(1.5 × 10⁻⁶)
R = 0.023 Ω

[4 marks: 1 mark for formula, 2 marks for substitution, 1 mark for answer]', ARRAY['resistance', 'resistivity', 'electricity', 'ohms law']),

('Physics', 2022, 'May/June', '1', 'A wave has frequency 50 Hz and wavelength 6.8 m. Calculate the wave speed.', 'Wave speed = 340 m/s

Using v = fλ

Given:
- Frequency (f) = 50 Hz
- Wavelength (λ) = 6.8 m

v = fλ = 50 × 6.8 = 340 m/s

[3 marks: 1 mark for formula, 1 mark for substitution, 1 mark for answer with unit]', ARRAY['waves', 'frequency', 'wavelength', 'wave speed']),

-- Chemistry Questions
('Chemistry', 2023, 'May/June', '1', 'Calculate the number of moles in 36g of water (H₂O). [Relative atomic masses: H = 1, O = 16]', 'Number of moles = 2.0 mol

Step-by-step calculation:
1. Calculate molar mass of H₂O:
   M = (2 × 1) + (1 × 16) = 18 g/mol

2. Use n = m/M:
   n = 36g ÷ 18 g/mol = 2.0 mol

[3 marks: 1 mark for molar mass, 1 mark for formula, 1 mark for answer]', ARRAY['moles', 'molar mass', 'stoichiometry', 'calculations']),

('Chemistry', 2023, 'Oct/Nov', '2', 'Balance the equation: C₂H₆ + O₂ → CO₂ + H₂O', 'Balanced equation: 2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O

Balancing steps:
1. Start with carbon: C₂H₆ → 2CO₂
2. Balance hydrogen: 6H → 3H₂O  
3. Count oxygen needed: 4 + 3 = 7 oxygen atoms
4. Final: 2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O

[4 marks: 1 mark for each correctly balanced element]', ARRAY['balancing equations', 'combustion', 'stoichiometry', 'chemical equations']),

('Chemistry', 2022, 'May/June', '1', 'Describe the structure and bonding in sodium chloride (NaCl)', 'Sodium chloride has an ionic structure:

Structure:
- Giant ionic lattice structure
- Each Na⁺ ion surrounded by 6 Cl⁻ ions
- Each Cl⁻ ion surrounded by 6 Na⁺ ions
- Regular, repeating 3D arrangement

Bonding:
- Ionic bonding between Na⁺ and Cl⁻ ions
- Electrostatic attraction between oppositely charged ions
- Na loses 1 electron to form Na⁺
- Cl gains 1 electron to form Cl⁻

[6 marks: 3 marks for structure description, 3 marks for bonding explanation]', ARRAY['ionic bonding', 'crystal structure', 'lattice', 'sodium chloride']),

-- Biology Questions
('Biology', 2023, 'May/June', '1', 'Explain the process of photosynthesis, including the overall equation', 'Photosynthesis equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂

Process explanation:
1. Light-dependent reactions (in thylakoids):
   - Chlorophyll absorbs light energy
   - Water molecules split (photolysis): H₂O → 2H⁺ + ½O₂ + 2e⁻
   - ATP and NADPH produced

2. Light-independent reactions (Calvin cycle in stroma):
   - CO₂ fixed into organic molecules
   - Uses ATP and NADPH from light reactions
   - Produces glucose

Overall: Light energy converts CO₂ and H₂O into glucose and oxygen

[8 marks: 2 marks for equation, 3 marks for light reactions, 3 marks for Calvin cycle]', ARRAY['photosynthesis', 'chlorophyll', 'calvin cycle', 'light reactions']),

('Biology', 2023, 'Oct/Nov', '2', 'Describe the structure and function of mitochondria', 'Structure:
- Double membrane organelle
- Outer membrane: smooth, permeable to small molecules
- Inner membrane: folded into cristae, contains electron transport chain
- Matrix: contains enzymes, DNA, ribosomes
- Intermembrane space: between outer and inner membranes

Function:
- Cellular respiration and ATP production
- Krebs cycle occurs in matrix
- Electron transport chain on inner membrane
- ATP synthesis via chemiosmosis
- Often called "powerhouse of the cell"

[8 marks: 4 marks for structure, 4 marks for function]', ARRAY['mitochondria', 'cellular respiration', 'ATP', 'cristae', 'organelles']),

-- Economics Questions
('Economics', 2023, 'May/June', '1', 'Explain the concept of opportunity cost with an example', 'Opportunity cost definition:
The value of the next best alternative foregone when making a choice.

Key points:
- Scarcity forces choices to be made
- Every choice involves giving up alternatives
- Opportunity cost is the value of the best alternative not chosen

Example:
A student has $20 and can either:
- Buy a textbook ($20)
- Go to the cinema ($15) and buy snacks ($5)

If they choose the textbook, the opportunity cost is the cinema trip and snacks (valued at $20 total).

[6 marks: 2 marks for definition, 2 marks for explanation, 2 marks for relevant example]', ARRAY['opportunity cost', 'scarcity', 'choice', 'alternatives']),

('Economics', 2022, 'Oct/Nov', '1', 'Distinguish between microeconomics and macroeconomics', 'Microeconomics:
- Studies individual economic units
- Focuses on households, firms, and markets
- Examines price determination in specific markets
- Topics: supply and demand, consumer behavior, firm production
- Examples: price of apples, individual firm''s output

Macroeconomics:
- Studies the economy as a whole
- Focuses on aggregate economic variables
- Examines national economic performance
- Topics: inflation, unemployment, economic growth, GDP
- Examples: national unemployment rate, overall price level

Key difference: Scale of analysis - individual units vs. entire economy

[8 marks: 4 marks for microeconomics, 4 marks for macroeconomics]', ARRAY['microeconomics', 'macroeconomics', 'economic analysis', 'scale']),

-- Business Studies Questions
('Business Studies', 2023, 'May/June', '1', 'Explain the advantages and disadvantages of franchising for a franchisor', 'Advantages for franchisor:
1. Rapid expansion with limited capital investment
2. Franchisee provides local knowledge and management
3. Reduced financial risk - franchisee invests capital
4. Ongoing revenue through franchise fees and royalties
5. Brand recognition spreads quickly

Disadvantages for franchisor:
1. Less control over day-to-day operations
2. Potential damage to brand reputation from poor franchisees
3. Sharing profits with franchisees
4. Legal complexities and ongoing support costs
5. Difficulty maintaining consistent quality standards

[10 marks: 5 marks for advantages, 5 marks for disadvantages]', ARRAY['franchising', 'business expansion', 'franchisor', 'business model']),

('Business Studies', 2022, 'Oct/Nov', '2', 'Analyze the factors a business should consider when choosing a location', 'Key location factors:

1. Market proximity:
- Access to target customers
- Local demand for products/services

2. Cost considerations:
- Rent/property prices
- Local wage rates
- Transportation costs

3. Infrastructure:
- Transport links (roads, rail, airports)
- Utilities availability (electricity, water, internet)
- Communication networks

4. Labor supply:
- Availability of skilled workers
- Local education/training facilities
- Unemployment levels

5. Competition:
- Presence of competitors
- Market saturation
- Complementary businesses

6. Government factors:
- Planning permissions
- Tax incentives
- Government support schemes

[12 marks: 2 marks for each factor with explanation]', ARRAY['business location', 'site selection', 'location factors', 'business planning']),

-- Computer Science Questions
('Computer Science', 2023, 'May/June', '1', 'Write a pseudocode algorithm to find the largest number in an array', 'ALGORITHM FindLargest
INPUT: Array[1..n] of integers
OUTPUT: Largest number in array

BEGIN
    SET largest ← Array[1]
    FOR i ← 2 TO n DO
        IF Array[i] > largest THEN
            SET largest ← Array[i]
        ENDIF
    ENDFOR
    OUTPUT largest
END

Explanation:
1. Initialize largest with first array element
2. Compare each remaining element with current largest
3. Update largest if a bigger number is found
4. Return the largest number found

[6 marks: 2 marks for initialization, 2 marks for loop structure, 2 marks for comparison logic]', ARRAY['algorithm', 'pseudocode', 'arrays', 'maximum', 'iteration']),

('Computer Science', 2023, 'Oct/Nov', '2', 'Explain the difference between RAM and ROM', 'RAM (Random Access Memory):
- Volatile memory - loses data when power is off
- Read and write operations possible
- Stores currently running programs and data
- Faster access speeds
- Examples: DDR4, DDR5
- Temporary storage

ROM (Read Only Memory):
- Non-volatile memory - retains data without power
- Primarily read-only (some types can be written to)
- Stores permanent system instructions (BIOS/UEFI)
- Slower than RAM
- Examples: EPROM, EEPROM, Flash memory
- Permanent storage

Key differences:
- Volatility: RAM is volatile, ROM is non-volatile
- Purpose: RAM for temporary storage, ROM for permanent instructions
- Speed: RAM is generally faster than ROM

[8 marks: 4 marks for RAM explanation, 4 marks for ROM explanation]', ARRAY['RAM', 'ROM', 'memory', 'volatile', 'non-volatile', 'computer architecture']);

-- Add more sample questions to reach 30+ total
INSERT INTO questions (subject, year, session, paper_number, question_text, mark_scheme, keywords) VALUES
('Mathematics', 2022, 'Oct/Nov', '2', 'Find the equation of the line passing through points (2,3) and (5,9)', 'Equation: y = 2x - 1

Step-by-step solution:
1. Find gradient: m = (y₂-y₁)/(x₂-x₁) = (9-3)/(5-2) = 6/3 = 2
2. Use point-slope form: y - y₁ = m(x - x₁)
3. Using point (2,3): y - 3 = 2(x - 2)
4. Simplify: y - 3 = 2x - 4
5. Therefore: y = 2x - 1

[5 marks: 2 marks for gradient, 3 marks for equation]', ARRAY['linear equations', 'gradient', 'coordinate geometry', 'straight line']),

('Physics', 2022, 'Oct/Nov', '1', 'Explain why ice floats on water in terms of density', 'Ice floats because it is less dense than liquid water.

Explanation:
- Density = mass/volume
- When water freezes, molecules form a rigid hexagonal structure
- This structure has more space between molecules than liquid water
- Same mass occupies larger volume, so density decreases
- Ice density ≈ 0.92 g/cm³, water density ≈ 1.00 g/cm³
- Less dense materials float on more dense materials

This is unusual as most substances are denser in solid form.

[6 marks: 2 marks for density concept, 4 marks for molecular explanation]', ARRAY['density', 'states of matter', 'molecular structure', 'floating']),

('Chemistry', 2022, 'Oct/Nov', '1', 'Explain why Group 1 metals become more reactive down the group', 'Reactivity increases down Group 1 due to:

1. Atomic radius increases:
- More electron shells added down the group
- Outer electron further from nucleus

2. Shielding effect increases:
- Inner electrons shield outer electron from nuclear attraction
- Reduces effective nuclear charge on outer electron

3. Ionization energy decreases:
- Less energy needed to remove outer electron
- Easier to form positive ions (M⁺)

4. Metallic bonding weakens:
- Outer electrons less tightly held
- Easier to lose electrons in reactions

Therefore: Li < Na < K < Rb < Cs (increasing reactivity)

[8 marks: 2 marks each for atomic radius, shielding, ionization energy, and conclusion]', ARRAY['group 1', 'alkali metals', 'reactivity', 'periodic trends', 'ionization energy']),

('Biology', 2022, 'Oct/Nov', '1', 'Describe the process of protein synthesis', 'Protein synthesis occurs in two main stages:

1. Transcription (in nucleus):
- DNA double helix unwinds
- RNA polymerase reads DNA template strand
- mRNA is synthesized complementary to DNA
- mRNA processing: introns removed, exons joined
- mRNA leaves nucleus through nuclear pores

2. Translation (at ribosomes):
- mRNA binds to ribosome
- tRNA molecules bring amino acids
- Each tRNA has anticodon complementary to mRNA codon
- Amino acids joined by peptide bonds
- Polypeptide chain forms and folds into protein

[10 marks: 5 marks for transcription, 5 marks for translation]', ARRAY['protein synthesis', 'transcription', 'translation', 'mRNA', 'tRNA', 'ribosomes']),

('Economics', 2022, 'May/June', '2', 'Explain the factors that influence demand for a product', 'Factors affecting demand:

1. Price of the product:
- Inverse relationship (law of demand)
- Higher price → lower quantity demanded

2. Income of consumers:
- Normal goods: income ↑ → demand ↑
- Inferior goods: income ↑ → demand ↓

3. Price of substitute goods:
- If substitute price ↑ → demand for product ↑
- Example: tea price ↑ → coffee demand ↑

4. Price of complementary goods:
- If complement price ↑ → demand for product ↓
- Example: petrol price ↑ → car demand ↓

5. Consumer tastes and preferences:
- Fashion, advertising, seasonal changes

6. Population size and demographics:
- More consumers → higher demand

7. Future expectations:
- Expected price changes affect current demand

[14 marks: 2 marks for each factor with explanation]', ARRAY['demand', 'demand factors', 'substitute goods', 'complementary goods', 'consumer behavior']);