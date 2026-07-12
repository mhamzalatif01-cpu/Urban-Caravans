// Public-website sourced reference notes — distinct from internal drafting notes.
// Kept separate and clearly labeled since these are marketing-published specs,
// which may round or simplify figures compared to internal build truth.
export const WEBSITE_NOTES = [

{title: "Public Website — Model Range Positioning Overview", model: "", topic: "Reference", content:
`Source: urbancaravans.com.au (public marketing site, collected 12 Jul 2026). Cross-check exact figures against internal notes before using in drafting — public copy is simplified for customers.

Tungsten Track — touring-focused entry model, previously called the "Tourer." TIG-welded aluminium frame. Positioned as the gateway model for touring and caravan travel.

Tungsten Tuff — entry-level off-road model in the Tungsten range. Adds off-road capability while retaining touring comfort. TIG-welded aluminium frame.

Tungsten Armorlite — lightweight hybrid caravan, full off-road format. Combines reduced size/weight with internal comforts. TIG-welded construction.

Tungsten X-Terrain — full off-road caravan combining creature comforts with core off-road equipment. Sits below the range-topping X-Treme variants.

Tungsten X-Treme — range-leading off-road and off-grid caravan for demanding remote-area travel. Higher-capacity electrical and water systems than the lower-range models.

Tungsten X-Treme X — highest-specification full-luxury off-grid and off-road model. Uses a higher-voltage (24V), substantially larger electrical system. Positioned above the Tungsten X-Treme.

Public model pages: /tungsten-track/, /tungsten-tuff/, /tungsten-armorlite/, /tungsten-x-terrain/, /tungsten-x-treme/, /tungsten-x-treme-x/ on urbancaravans.com.au.`},

{title: "Public Website — Electrical Spec Comparison by Model", model: "", topic: "Electrical", content:
`Source: urbancaravans.com.au (public marketing site). These are customer-facing published specs — treat as a naming/positioning cross-check, not the authoritative internal build spec.

| Model | System voltage | Battery capacity | Solar | Inverter |
|---|---|---|---|---|
| Tungsten Track | 12V | 2×100Ah lithium | 2×250W | Optional |
| Tungsten Tuff | 12V | 2×100Ah lithium | 2×250W | Optional |
| Tungsten Armorlite | 12V | 2×150Ah lithium | 2×250W | Optional |
| Tungsten X-Terrain | 12V | 2×150Ah lithium | 2×250W | Optional |
| Tungsten X-Treme | 12V | 2×200Ah lithium | 4×250W | 3000W |
| Tungsten X-Treme X | 24V | 600Ah lithium at 24V | 4×250W | 5000W |

All models publicly list a 12V Victron battery-management system (X-Treme X uses 24V Victron) and Garmin monitoring as an available option. This roughly lines up with the internal X-Terrain 24V upgrade path and Victron System tiers already documented internally — the X-Treme X appears to be the model where 24V is standard rather than an upgrade.`},

{title: "Public Website — Chassis & Suspension Comparison by Model", model: "", topic: "Chassis/Suspension", content:
`Source: urbancaravans.com.au (public marketing site).

| Model | Hitch | Chassis | Suspension | Tyres |
|---|---|---|---|---|
| Tungsten Track | DO35 | 150mm | 3.5T independent tandem axle | 245/75R16 all-terrain |
| Tungsten Tuff | Not publicly listed | Not publicly listed | Not publicly listed | Not publicly listed |
| Tungsten Armorlite | DO35 | 200mm trussed | 3T independent single axle (400mm A-frame extension, 12" brakes) | 265/75R16 mud-terrain |
| Tungsten X-Terrain | DO35 | 300mm trussed | 4.3T tandem / 3T single, both independent | 265/65R18 mud-terrain |
| Tungsten X-Treme | DO45 | 300mm trussed | 4.3T tandem air-bag / 3T single air-bag | 285/65R18 mud-terrain |
| Tungsten X-Treme X | DO45 | 300mm trussed | 4.3T tandem air-bag / 3T single air-bag | 285/65R18 mud-terrain |

Note the hitch jump from DO35 to DO45 starting at X-Treme — worth checking against internal coupling notes when specifying those two models. Public site also references "TerraGlide suspension" as part of the chassis/suspension construction messaging (see Construction Methods note).`},

{title: "Public Website — Water System Comparison by Model", model: "", topic: "Plumbing", content:
`Source: urbancaravans.com.au (public marketing site).

| Model | Drinking water | Fresh water | Grey water |
|---|---|---|---|
| Tungsten Track | Not separately listed | 2×110L | 95L |
| Tungsten Tuff | Not separately listed | 2×110L | 95L |
| Tungsten Armorlite | 1×43L | 2×65L | Not publicly listed |
| Tungsten X-Terrain | Not publicly listed | Not publicly listed | Not publicly listed |
| Tungsten X-Treme | 1×110L | 2×110L | 95L |
| Tungsten X-Treme X | 1×110L | 2×110L | Not publicly listed |

Common features listed across most models: mains-pressure water inlet, UV water filtration, and hot/cold external shower (offered as an option on Track and Tuff, standard-listed on Armorlite/X-Treme/X-Treme X). Matches the internal 95L grey tank and 110L fresh tank standards already documented — good cross-check, not new information.`},

{title: "Public Website — Construction Methods & Standard Systems", model: "", topic: "Process", content:
`Source: urbancaravans.com.au (public marketing site) — customer-facing description of build methods, useful for understanding how these are pitched externally.

TIG welding: TIG = tungsten inert gas welding, used for the aluminium caravan frame. The frame is described publicly as both welded AND mechanically fastened/bolted, intended to withstand vibration from caravan travel. Marketed as rot-resistant due to the aluminium construction.

Chassis & suspension: public copy references "X-Treme chassis construction" and "TerraGlide suspension" by name, aimed at stability on sealed and off-road surfaces.

Interior construction: CNC-cut interior furniture, tongue-and-groove furniture joints, summarized publicly as a three-part process — "glue, screw and seal." Intended to tolerate caravan movement and vibration over time.

Dust reduction system: publicly listed as standard equipment on Tungsten Tuff, Tungsten Armorlite, Tungsten X-Terrain, and Tungsten X-Treme (not confirmed for Track or X-Treme X in public copy). This lines up with the internal note about adding a 12V dust reduction system hatch — worth checking whether it's genuinely standard-fit across those four models or optional per job.`},

{title: "Public Website — Warranty Terms", model: "", topic: "Reference", content:
`Source: urbancaravans.com.au (public marketing site, /warranty/). Legal wording should always be confirmed against the live policy page — this is a summary of publicly stated terms, not the full legal text.

- 10-year crack-free wall-frame warranty, applying to new caravans purchased after 1 January 2024.
- A lifetime rot-free wall-related warranty is also referenced publicly.
- Warranty registration, transfer (to a subsequent owner, within the applicable factory-warranty period), and claims are handled through dedicated pages/forms on the site (/warranty-registration/, /warranty-transfer/, /warranty-claim/).`},

{title: "Public Website — Company Background", model: "", topic: "Reference", content:
`Source: urbancaravans.com.au (public marketing site, /about-us/).

Urban Caravans describes a family history in caravan manufacturing dating back to the 1970s, Melbourne-based design and manufacturing, and a focus on durable TIG-welded aluminium-frame caravans adapted to individual travel requirements. Founder Steve Trajcevski's involvement in caravan building is described as starting around age 16.

As of mid-2026, Urban Caravans has entered the US market — the first Australian caravan brand to do so — trading there as "Urban X Campers."`}

];
