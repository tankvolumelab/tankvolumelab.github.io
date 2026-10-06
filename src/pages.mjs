export const pages = [
  {
    slug: '', shape: 'vertical', nav: 'Tank Volume',
    title: 'Tank Volume Calculator - Gallons, Litres & Capacity',
    heading: 'Tank Volume Calculator',
    description: 'Calculate tank volume and capacity in US gallons, litres and cubic metres. Supports cylindrical and rectangular tanks with optional liquid fill levels.',
    intro: "Enter your tank's inside dimensions to find its capacity. Add a liquid depth to see how much is inside.",
    researchStatus: 'Primary cluster provisionally validated by supplied Semrush snapshot',
    sections: [
      ['how-to', 'How to Calculate Tank Volume', `<p>Capacity is the space inside a tank. Choose its shape, select the unit you measured in, and enter the internal dimensions. The result is the full geometric capacity, with conversions to liters and both types of gallon.</p><p>For current liquid volume, enter the vertical distance from the inside bottom to the liquid surface. Leave that field blank for capacity only; enter zero for an empty tank.</p>`],
      ['formulas', 'Tank Volume Formulas by Shape', `<h3>Cylindrical Tanks</h3><p>A cylinder has a circular cross-section. Its radius is half its inside diameter. Multiply the circular area by the height for an upright cylinder, or by the length for a cylinder lying on its side.</p><p class="formula">V = &pi; &times; (diameter / 2)&sup2; &times; height or length</p><p>A flat-ended cylinder 1 m in diameter and 2 m long holds approximately 1,570.796 liters, or 414.960 US gallons. For depth-based measurements, use the <a href="{{horizontal}}">horizontal cylindrical tank calculator</a>.</p><h3>Rectangular Tanks</h3><p class="formula">V = length &times; width &times; height</p><p>A tank measuring 2 m by 1 m by 0.5 m holds 1 m&sup3;, or 1,000 liters. The <a href="{{rectangular}}">rectangular tank capacity calculator</a> includes metric and inch-based examples.</p>`],
      ['partial-fill', 'Calculating Liquid Volume in a Partially Filled Tank', `<p>In an upright cylinder or rectangular tank, the horizontal area stays constant, so liquid volume is proportional to depth. Half the height means half the capacity.</p><p>In a horizontal cylinder, the width of the liquid surface changes with depth. The circular-segment formula accounts for that curved cross-section. Half the diameter still means half the capacity, but a quarter of the diameter holds about 19.55% of the capacity, not 25%.</p>`],
      ['units', 'Litres, Gallons and Cubic Metres', `<p>A liter and a litre are the same unit. A US liquid gallon and an Imperial gallon are different sizes, so results label both explicitly.</p><table class="unit-table"><thead><tr><th scope="col">Unit</th><th scope="col">Equivalent</th></tr></thead><tbody><tr><td>1 cubic meter</td><td>1,000 liters</td></tr><tr><td>1 US liquid gallon</td><td>3.785411784 liters</td></tr><tr><td>1 Imperial gallon</td><td>4.54609 liters</td></tr><tr><td>1 cubic foot</td><td>28.316846592 liters</td></tr></tbody></table><p>Dimensions are converted to meters before calculation. Only the displayed results are rounded.</p>`]
    ],
    faqs: [
      ['How do I calculate tank capacity?', 'Use inside dimensions and the formula for the shape: length times width times height for a rectangular tank, or circular area times length or height for a flat-ended cylinder.'],
      ['How many gallons are in my tank?', 'Divide the volume in liters by 3.785411784 for US liquid gallons, or by 4.54609 for Imperial gallons. All five volume units are shown in the results.'],
      ['Should I use inside or outside dimensions?', 'Use inside dimensions. Outside measurements include wall thickness and can overestimate the liquid space.'],
      ['Can I calculate a partially filled tank?', 'Yes. Add liquid depth measured vertically from the inside bottom. The calculator uses the selected shape to determine liquid volume and remaining geometric capacity.']
    ]
  },
  {
    slug: 'horizontal-cylinder-tank-calculator/', shape: 'horizontal', nav: 'Horizontal Cylinder',
    title: 'Horizontal Tank Volume Calculator - Liquid Fill & Gallons',
    heading: 'Horizontal Cylindrical Tank Volume Calculator',
    description: 'Calculate the capacity and liquid volume of a horizontal cylindrical tank. Enter diameter, length and fill depth for gallons, litres and a geometric dip chart.',
    intro: 'Measure the inside diameter, straight length and liquid depth of a level, flat-ended cylinder. Get capacity, liquid volume and a dip chart.',
    researchStatus: 'Provisional target: US page traffic, demand, SERP separation and link competition unverified',
    sections: [
      ['how-to', 'How a Horizontal Tank Volume Calculator Works', `<p>The circular end determines the tank's cross-sectional area. Multiplying that area by the inside length gives full capacity. To find liquid volume, the calculator uses only the submerged part of the circle.</p><p>Enter the inside diameter, the straight internal length between the flat ends, and the liquid depth. Measure depth vertically from the lowest inside point, not down from the top. If measuring empty space above the liquid, subtract that measurement from the diameter first.</p>`],
      ['formulas', 'Horizontal Cylinder Volume Formula', `<p>Let <strong>r</strong> be the inside radius, <strong>L</strong> the inside length and <strong>h</strong> the liquid depth. The full capacity is:</p><p class="formula">V = &pi;r&sup2;L</p><h3>How to Calculate Liquid Volume at a Given Depth</h3><p>The submerged area is a circular segment. Use radians for the inverse cosine:</p><p class="formula">A = r&sup2; arccos((r &minus; h) / r)<br>&minus; (r &minus; h) &radic;(2rh &minus; h&sup2;)<br>Liquid volume = A &times; L</p><p>The calculator treats empty, half-depth and full conditions explicitly. It uses an equivalent small-angle expansion near empty to avoid loss of precision when subtracting nearly equal numbers.</p>`],
      ['example', 'Worked Example', `<p>Consider a flat-ended tank with a 1 m inside diameter, 2 m length and 0.25 m liquid depth. The radius is 0.5 m.</p><p class="formula">Full capacity = &pi; &times; 0.5&sup2; &times; 2<br>= 1.570796 m&sup3; = 1,570.796 liters</p><p>At 0.25 m depth, the segment area is approximately 0.153546 m&sup2;. Multiplying by 2 m gives <strong>307.092 liters</strong>, about <strong>81.125 US gallons</strong> or <strong>19.55%</strong> of capacity. At 0.5 m depth, it holds 785.398 liters, exactly half of its geometric capacity.</p>`],
      ['nonlinear', 'Why Depth and Volume Are Not Proportional', `<p>The cross-section is narrow near the bottom and widest in the middle. A small rise near the center adds more liquid than the same rise near the bottom. Exactly half the diameter gives half the volume, but most other depth fractions do not match their volume fractions.</p><p>This differs from a <a href="{{rectangular}}">rectangular tank</a>, where each equal increase in depth adds the same volume. For upright cylinders and other supported shapes, use the <a href="{{home}}">general tank volume calculator</a>.</p>`],
      ['mistakes', 'Common Measurement Mistakes', `<p>Enter diameter, not radius, and use internal dimensions. This tool assumes a level, uniform cylinder with flat ends. Dished, hemispherical, conical and ellipsoidal ends are not included; using the full outside length of those tanks will produce an incorrect estimate.</p><p>A dip chart based on ideal geometry is not a certified calibration chart. Tank tilt, deformation, fittings and sediment can change the relationship between measured depth and actual volume.</p>`]
    ],
    faqs: [
      ['Is half the depth exactly half the volume?', 'Yes, for a level, uniform, flat-ended horizontal cylinder. This symmetry does not make the relationship linear at other depths.'],
      ['What is a tank dip chart?', 'It pairs liquid depths with calculated volumes for a specific tank. This page provides a table at 10% increments of the diameter and a CSV download.'],
      ['Can I use this for rounded tank ends?', 'No. Rounded or dished ends require additional geometry. This calculator supports flat-ended cylinders only.']
    ]
  },
  {
    slug: 'rectangular-tank-calculator/', shape: 'rectangular', nav: 'Rectangular Tank',
    title: 'Rectangular Tank Calculator - Litres, Gallons & Volume',
    heading: 'Rectangular Tank Capacity Calculator',
    description: 'Find how many litres or gallons a rectangular tank holds. Enter inside length, width and height, with optional liquid depth for partial capacity.',
    intro: 'Enter inside length, width and height to calculate a rectangular tank. Add the liquid depth for current volume and remaining space.',
    researchStatus: 'Provisional target: US page traffic, demand, SERP separation and link competition unverified',
    sections: [
      ['how-to', 'How to Calculate Rectangular Tank Capacity', `<p>Measure the clear internal length, width and vertical height. Choose the corresponding unit and enter all three measurements. The tank must have a level, rectangular bottom and straight vertical sides.</p><p>For a working liquid level, enter the depth above the inside bottom. A blank depth returns full capacity only; zero depth explicitly means the tank is empty.</p>`],
      ['formulas', 'Rectangular Tank Volume Formula', `<p class="formula">Full volume = length &times; width &times; height<br>Liquid volume = length &times; width &times; liquid depth</p><p>Use the same length unit for every dimension. The resulting volume is in that unit cubed.</p><h3>Calculating Capacity in Litres</h3><p>Multiply cubic meters by 1,000. If all measurements are in centimeters, divide the product by 1,000 instead.</p><h3>Calculating Capacity in US Gallons</h3><p>When measurements are in inches, divide length &times; width &times; height by 231. One US liquid gallon is exactly 231 cubic inches. Imperial gallons use a different conversion.</p>`],
      ['partial-fill', 'Partial Water Level Calculations', `<p>A rectangular tank's base area stays constant at every height. A tank filled to 60% of its inside height contains 60% of its geometric capacity. Remaining capacity is the full volume minus current liquid volume.</p><p>That proportional relationship does not apply to a cylinder lying on its side. Use the <a href="{{horizontal}}">horizontal cylinder liquid-volume calculator</a> for that shape, or the <a href="{{home}}">tank volume calculator</a> to compare all three supported shapes.</p>`],
      ['example', 'Worked Examples', `<h3>Metric: a 1,000-liter tank</h3><p>An internal length of 2 m, width of 1 m and height of 0.5 m gives 2 &times; 1 &times; 0.5 = 1 m&sup3;, or <strong>1,000 liters</strong>. At 0.3 m liquid depth, it holds 600 liters and has 400 liters of geometric space remaining.</p><h3>US customary: dimensions in inches</h3><p>A rectangular tank measuring 48 in &times; 24 in &times; 20 in has 23,040 cubic inches of capacity. Dividing by 231 gives <strong>99.740 US gallons</strong> (377.558 liters). At 12 in liquid depth, it holds 59.844 US gallons, or 60% of its full volume.</p>`],
      ['mistakes', 'Common Measurement Mistakes', `<p>Outside dimensions include wall thickness. Measure inside when possible; if thickness is uniform, subtract both walls from each outside dimension that includes two walls. Do not automatically subtract two wall thicknesses from the height of an open-top tank.</p><p>Nominal tank sizes may differ from usable liquid capacity. Freeboard, internal fittings, baffles, rounded corners and a sloping base can reduce the available space. This tool does not estimate those adjustments.</p>`]
    ],
    faqs: [
      ['Does a square tank use the same formula?', 'Yes. A square base simply has equal length and width. Multiply those by the internal height.'],
      ['Why is my result different from the tank label?', 'A label may give a nominal size or recommended working capacity. The calculator uses only the ideal space implied by your internal measurements.'],
      ['Does this work for a sloping tank bottom?', 'No. The rectangular formula assumes a level base, straight vertical walls and a constant horizontal cross-section.']
    ]
  }
];
