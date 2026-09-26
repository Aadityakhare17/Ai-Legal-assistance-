"""
NyayaSetu Constitution & Citizen Rights Module
Covers Fundamental Rights (Part III, Articles 12-35),
Right to Education (Article 21A & RTE Act Section 12(1)(c) 25% Private Quota),
Right to Health & Emergency Medical Access (Article 21, Parmanand Katara, Ayushman Bharat),
Constitutional Remedies & Writs (Articles 32 & 226), and Free Legal Aid (Article 39A & NALSA).
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/api/constitution", tags=["constitution"])

class AskConstitutionRequest(BaseModel):
    query: str
    category: Optional[str] = "all"

# ─── 1. FUNDAMENTAL RIGHTS (ARTICLES 12-35) ───────────────────────────────

FUNDAMENTAL_RIGHTS_DATA = [
    {
        "id": "equality",
        "title": "Right to Equality",
        "articles": "Articles 14 – 18",
        "badge": "Articles 14-18",
        "summary": "Guarantees equality before the law, prohibits discrimination, ensures equal opportunity in public employment, and abolishes untouchability and colonial titles.",
        "icon": "Scale",
        "color": "blue",
        "clauses": [
            {
                "article": "Article 14",
                "title": "Equality Before Law & Equal Protection of the Laws",
                "text": "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
                "plain_meaning": "No individual is above the law. Whether a government official, billionaire, or everyday citizen, everyone is governed by the same legal standards.",
                "landmark_case": "E.P. Royappa v. State of Tamil Nadu (1974) — Equality is antithetic to arbitrariness; where an act is arbitrary, it violates Article 14.",
                "citizen_takeaway": "No government authority or police officer can act on arbitrary personal whims without a valid, rational basis."
            },
            {
                "article": "Article 15",
                "title": "Prohibition of Discrimination on Grounds of Religion, Race, Caste, Sex or Place of Birth",
                "text": "The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them.",
                "plain_meaning": "Access to public shops, restaurants, wells, tanks, and public roads cannot be restricted based on caste, religion, or gender. Permits special provisions for women, children, and socially/educationally backward classes.",
                "landmark_case": "Navtej Singh Johar v. Union of India (2018) — Discrimination based on gender identity or sexual orientation violates Article 15.",
                "citizen_takeaway": "Private entities providing public utility access cannot discriminate or segregate based on birth, gender, or community."
            },
            {
                "article": "Article 16",
                "title": "Equality of Opportunity in Matters of Public Employment",
                "text": "There shall be equality of opportunity for all citizens in matters relating to employment or appointment to any office under the State.",
                "plain_meaning": "Equal chance for all citizens to apply for government jobs, with constitutional reservations for backward classes, SC/ST, and EWS.",
                "landmark_case": "Indra Sawhney v. Union of India (1992) — Affirmed reservations while capping total quota normally at 50%.",
                "citizen_takeaway": "Public job recruitments must follow transparent merit criteria and official reservation rules without nepotism."
            },
            {
                "article": "Article 17",
                "title": "Abolition of Untouchability",
                "text": "'Untouchability' is abolished and its practice in any form is forbidden. The enforcement of any disability arising out of 'Untouchability' shall be an offence punishable in accordance with law.",
                "plain_meaning": "Practicing untouchability, refusing service, or humiliating someone due to caste is a non-bailable criminal offence under the Protection of Civil Rights Act, 1955 and SC/ST PoA Act.",
                "landmark_case": "State of Karnataka v. Appa Balu Ingale (1993) — Abolition of untouchability is a fundamental imperative to establish human dignity.",
                "citizen_takeaway": "Zero tolerance for caste-based exclusion from public temples, eateries, water sources, or gatherings."
            }
        ]
    },
    {
        "id": "freedom",
        "title": "Right to Freedom",
        "articles": "Articles 19 – 22",
        "badge": "Articles 19-22",
        "summary": "Protects six democratic freedoms (speech, assembly, association, movement, residence, profession), safeguards against arbitrary arrest, and guarantees the Right to Life, Dignity, and Education.",
        "icon": "Shield",
        "color": "emerald",
        "clauses": [
            {
                "article": "Article 19(1)",
                "title": "Six Core Democratic Freedoms",
                "text": "All citizens shall have the right to: (a) speech and expression, (b) assemble peaceably, (c) form associations/unions, (d) move freely throughout India, (e) reside in any part of India, and (g) practice any profession, trade or business.",
                "plain_meaning": "You have the constitutional right to express your thoughts, critique public policies, start a peaceful business, and travel freely across every Indian state.",
                "landmark_case": "Shreya Singhal v. Union of India (2015) — Struck down Section 66A of IT Act; citizens cannot be arrested merely for online social media posts expressing dissent.",
                "citizen_takeaway": "Peaceful dissent, constructive critique of authority, and freelance employment are your constitutional guarantees."
            },
            {
                "article": "Article 21",
                "title": "Protection of Life & Personal Liberty (The Gold Standard)",
                "text": "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
                "plain_meaning": "Expanded by the Supreme Court to include the Right to Dignity, Right to Emergency Medical Care, Right to Clean Drinking Water, Right to Privacy, and Right to Shelter.",
                "landmark_case": "Maneka Gandhi v. Union of India (1978) & K.S. Puttaswamy v. Union of India (2017) — Procedure depriving life or liberty must be 'fair, just, and reasonable'; Privacy is a Fundamental Right.",
                "citizen_takeaway": "Your body, health, privacy, and personal liberty cannot be encroached without strict, fair due process of law."
            },
            {
                "article": "Article 21A",
                "title": "Right to Free & Compulsory Education (Ages 6-14)",
                "text": "The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine.",
                "plain_meaning": "Every single child in India aged 6 to 14 has the constitutional right to receive completely free education in neighbourhood schools, with 25% free reserved seats in private schools under RTE Act.",
                "landmark_case": "Society for Unaided Private Schools of Rajasthan v. Union of India (2012) & 2026 Supreme Court Ruling (Dinesh Biwaji Ashtikar) — Upheld 25% mandatory private school reservation for EWS.",
                "citizen_takeaway": "No school (govt or private) can deny an eligible child education due to poverty. Fees, uniforms, and textbooks are guaranteed."
            },
            {
                "article": "Article 22",
                "title": "Protection Against Arbitrary Arrest & Detention",
                "text": "Guarantees: (1) Right to be informed of grounds of arrest immediately, (2) Right to consult and be defended by a lawyer of choice, (3) Mandatory production before the nearest Magistrate within 24 hours.",
                "plain_meaning": "Police cannot detain you secretly. You must be told why you are arrested, allowed a call to family/lawyer, and produced before a judge within 24 hours.",
                "landmark_case": "D.K. Basu v. State of West Bengal (1997) — Mandatory arrest memo, name tag on arresting officer, inspection memo, medical checkup every 48 hours.",
                "citizen_takeaway": "If detained, demand your right to consult an advocate and ensure production before a Judicial Magistrate within 24 hours."
            }
        ]
    },
    {
        "id": "exploitation",
        "title": "Right against Exploitation",
        "articles": "Articles 23 – 24",
        "badge": "Articles 23-24",
        "summary": "Strictly prohibits human trafficking, bonded/forced labor (begar), and bans child labor in hazardous factories, mines, and establishments.",
        "icon": "AlertTriangle",
        "color": "amber",
        "clauses": [
            {
                "article": "Article 23",
                "title": "Prohibition of Traffic in Human Beings and Forced Labour",
                "text": "Traffic in human beings and begar and other similar forms of forced labour are prohibited and any contravention of this provision shall be an offence punishable in accordance with law.",
                "plain_meaning": "No employer, contractor, or landlord can force you to work against your will, withhold your wages, or keep you in debt bondage.",
                "landmark_case": "People's Union for Democratic Rights (PUDR) v. Union of India (Asiad Workers Case, 1982) — Paying less than statutory minimum wages constitutes 'forced labour' under Article 23.",
                "citizen_takeaway": "Employers paying below legal minimum wages or refusing to pay earned wages commit a constitutional violation."
            },
            {
                "article": "Article 24",
                "title": "Prohibition of Employment of Children in Factories, Mines, etc.",
                "text": "No child below the age of fourteen years shall be employed to work in any factory or mine or engaged in any other hazardous employment.",
                "plain_meaning": "Complete ban on children under 14 working in commercial jobs; reinforced by Child Labour (Prohibition and Regulation) Amendment Act, 2016.",
                "landmark_case": "M.C. Mehta v. State of Tamil Nadu (1996) — Directed creation of Child Labour Rehabilitation Welfare Fund.",
                "citizen_takeaway": "Children belong in schools, not in brick kilns, restaurants, or fireworks factories."
            }
        ]
    },
    {
        "id": "religion",
        "title": "Right to Freedom of Religion",
        "articles": "Articles 25 – 28",
        "badge": "Articles 25-28",
        "summary": "Guarantees freedom of conscience, the right to profess, practice, and propagate religion freely, subject to public order, morality, and health.",
        "icon": "Heart",
        "color": "purple",
        "clauses": [
            {
                "article": "Article 25",
                "title": "Freedom of Conscience & Free Profession, Practice, and Propagation",
                "text": "All persons are equally entitled to freedom of conscience and the right freely to profess, practise and propagate religion.",
                "plain_meaning": "Every person has the absolute freedom to follow any faith, change their beliefs, or follow no religion at all.",
                "landmark_case": "Bijoe Emmanuel v. State of Kerala (1986) — Standing respectfully during national anthem without singing due to religious conscience is protected.",
                "citizen_takeaway": "State has no official religion; all citizens are guaranteed equal religious dignity."
            }
        ]
    },
    {
        "id": "cultural_education",
        "title": "Cultural & Educational Rights",
        "articles": "Articles 29 – 30",
        "badge": "Articles 29-30",
        "summary": "Protects language, script, and culture of minorities, and guarantees the right of minorities to establish and administer educational institutions.",
        "icon": "BookOpen",
        "color": "indigo",
        "clauses": [
            {
                "article": "Article 29",
                "title": "Protection of Interests of Minorities",
                "text": "Any section of the citizens having a distinct language, script or culture of its own shall have the right to conserve the same.",
                "plain_meaning": "Linguistic and cultural diversity is constitutionally safeguarded against forced homogenization.",
                "landmark_case": "T.M.A. Pai Foundation v. State of Karnataka (2002) — Defined regulatory limits on private and minority educational institutions.",
                "citizen_takeaway": "Every linguistic group has the right to preserve its native script, literature, and identity."
            }
        ]
    },
    {
        "id": "remedies",
        "title": "Right to Constitutional Remedies",
        "articles": "Article 32 & 226",
        "badge": "Articles 32 & 226",
        "summary": "The 'Heart and Soul of the Indian Constitution' (Dr. B.R. Ambedkar). Gives every citizen the direct power to approach the Supreme Court and High Courts to enforce Fundamental Rights via Writs.",
        "icon": "FileCheck",
        "color": "rose",
        "clauses": [
            {
                "article": "Article 32",
                "title": "Remedies for Enforcement of Rights (Supreme Court)",
                "text": "The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed.",
                "plain_meaning": "If the government or any state agency violates your Fundamental Rights, you do NOT have to wait through lower courts. You have a direct constitutional right to knock on the doors of the Supreme Court of India.",
                "landmark_case": "Kesavananda Bharati v. State of Kerala (1973) — Judicial review and fundamental rights remedies are part of the unalterable Basic Structure of the Constitution.",
                "citizen_takeaway": "Fundamental Rights are not mere paper promises; they are enforceable through five powerful Constitutional Writs."
            }
        ]
    }
]

# ─── 2. RIGHT TO EDUCATION DEEP-DIVE (ARTICLE 21A & RTE ACT) ──────────────

EDUCATION_RIGHTS_DATA = {
    "headline": "Right to Free and Compulsory Education in India",
    "constitutional_foundation": "Article 21A of the Indian Constitution (Inserted by 86th Constitutional Amendment Act, 2002) & The Right of Children to Free and Compulsory Education (RTE) Act, 2009.",
    "core_guarantee": "Every child between 6 to 14 years of age has the fundamental right to free, quality, elementary education (Classes 1 to 8) in a neighbourhood school.",
    "institutional_breakdown": [
        {
            "sector": "Private Unaided Schools (Non-Minority)",
            "rule": "Mandatory 25% Seat Reservation under Section 12(1)(c) of RTE Act 2009",
            "what_is_free": [
                "100% Tuition Fees waived completely (Government reimburses the school directly)",
                "Free Textbooks, Workbooks, and Stationery",
                "Free School Uniforms",
                "No admission fee, capitation fee, or screening interview allowed"
            ],
            "who_qualifies": "Children from Economically Weaker Sections (EWS: family income below state thresholds, typically ₹1 Lakh to ₹2.5 Lakh/year) and Disadvantaged Groups (SC, ST, OBC non-creamy, Children with Special Needs, Orphan/HIV affected).",
            "legal_teeth": "Supreme Court rulings (Society for Unaided Private Schools 2012; Dinesh Biwaji Ashtikar 2026) confirmed that private schools CANNOT deny admission allotted by the State. Denying admission violates Article 21A.",
            "how_to_apply": "State RTE online admissions portal (e.g., RTE Maharashtra, RTE Delhi, RTE Karnataka, RTE UP) usually opens between January and March every year for entry levels (Nursery/KG/Class 1)."
        },
        {
            "sector": "Government & Local Body Schools (Municipal, Zilla Parishad, Kendriya Vidyalaya)",
            "rule": "100% Completely Free Education for All Children",
            "what_is_free": [
                "Zero tuition fees for entire elementary schooling",
                "Free Mid-Day Meals (PM POSHAN) meeting daily nutrition standards",
                "Free seasonal uniforms and bags",
                "Free textbooks in regional and English mediums",
                "Free bicycle schemes in many states for secondary girl students"
            ],
            "who_qualifies": "Every resident child in India. No birth certificate or previous school leaving certificate can be used as a reason to deny admission.",
            "legal_teeth": "Section 4 of RTE Act: Even older out-of-school children must be admitted into an age-appropriate class with special bridge training.",
            "how_to_apply": "Direct walk-in to the nearest neighbourhood government school. Headmaster is legally obligated to enroll the child."
        },
        {
            "sector": "Government-Aided & Semi-Government Schools",
            "rule": "Schools receiving state grant-in-aid must provide free education proportionate to their state grant",
            "what_is_free": [
                "Government pays teacher salaries; tuition fees are abolished or capped at nominal state rates",
                "Mid-Day Meal access",
                "State board textbook allocations"
            ],
            "who_qualifies": "All admitted students as per state grant-in-aid rules.",
            "legal_teeth": "Aided schools are public authorities and subject to Right to Information (RTI Act 2005) and RTE inspection.",
            "how_to_apply": "Apply through school admission windows as per state education department calendar."
        },
        {
            "sector": "Higher Education (Colleges, Universities, IITs, NITs, Central Universities)",
            "rule": "Constitutional & Statutory Fee Waivers, Merit-cum-Means Scholarships, Post-Matric Schemes",
            "what_is_free": [
                "100% Tuition Fee Waiver in IITs/NITs/Central Universities for SC/ST and PwD students",
                "Full or 2/3rd fee remission for General/OBC students with parental income below ₹1-5 Lakhs/year",
                "National Scholarship Portal (NSP) Post-Matric Scholarships covering maintenance allowance and course fees",
                "State-specific EBC (Economically Backward Class) Rajarshi Shahu Maharaj / Vidyasiri schemes"
            ],
            "who_qualifies": "College students meeting statutory reservation categories or annual family income criteria.",
            "legal_teeth": "UGC Regulations and Ministry of Social Justice & Empowerment guidelines.",
            "how_to_apply": "Via National Scholarship Portal (scholarships.gov.in) and university scholarship cells."
        }
    ],
    "what_to_do_if_denied": [
        "File an immediate written complaint to the Block Education Officer (BEO) or District Education Officer (DEO).",
        "Lodge a complaint on the National Commission for Protection of Child Rights (NCPCR) e-BaalNidan portal (ebaalnidan.nic.in).",
        "Approach the High Court by filing a Writ of Mandamus under Article 226 for immediate admission enforcement.",
        "Call Childline Emergency Helpline: 1098."
    ]
}

# ─── 3. RIGHT TO HEALTH & EMERGENCY MEDICAL TREATMENT (ARTICLE 21) ────────

HEALTH_RIGHTS_DATA = {
    "headline": "Right to Health, Emergency Medical Care & Hospital Accountability",
    "constitutional_foundation": "Article 21 (Right to Life & Personal Liberty) as interpreted by the Supreme Court of India in landmark judgments.",
    "core_guarantee": "Preservation of human life is paramount. Every doctor and hospital—whether government, semi-government, charitable trust, or private—has a binding constitutional duty to provide immediate emergency medical treatment.",
    "key_legal_mandates": [
        {
            "title": "Immediate Emergency Medical Treatment in ANY Hospital (Govt or Private)",
            "legal_basis": "Supreme Court Landmark Judgment: Parmanand Katara v. Union of India (1989) 4 SCC 286",
            "the_rule": "Every hospital, public or private, MUST provide immediate emergency life-saving medical care to any injured person or accident victim.",
            "critical_protections": [
                "NO advance money deposit can be demanded as a precondition to starting life-saving treatment.",
                "NO waiting for police arrival, FIR, or medico-legal documentation before starting medical intervention.",
                "Hospitals CANNOT turn away an emergency victim citing 'we are not a medico-legal hospital'.",
                "Good Samaritans who bring injured victims to hospitals cannot be detained, harassed, or forced to pay bills."
            ],
            "citizen_action": "If a private hospital refuses immediate emergency treatment, report immediately to local Police Station, District Medical Officer, and State Medical Council for criminal negligence and contempt of court."
        },
        {
            "title": "10% Free Beds & 20% Free OPD in Charitable Trust & Private Hospitals",
            "legal_basis": "Public Trust Acts (e.g. Bombay Public Trusts Act Section 41AA) & High Court Land Concession Orders",
            "the_rule": "Large private hospitals that received subsidized government land, tax exemptions, or duty concessions MUST reserve a mandatory quota of beds and outpatient care completely free for poor citizens.",
            "critical_protections": [
                "10% of total operational indoor beds must be reserved completely FREE for indigent patients (annual income under ₹85,000 to ₹1.6 Lakhs depending on state).",
                "Another 10% of beds must be provided at heavily subsidized rates for weaker sections.",
                "Free medicines, doctor consultations, diagnostics, and food during the hospital stay.",
                "Monitored by Indigent Patients Fund (IPF) and State Charity Commissioners."
            ],
            "citizen_action": "Carry Ration Card (BPL/Antyodaya) or Tehsildar Income Certificate. Ask for the hospital's 'Medical Social Worker' (MSW) or IPF Helpdesk."
        },
        {
            "title": "Ayushman Bharat PM-JAY (World's Largest Free Healthcare Scheme)",
            "legal_basis": "National Health Authority (NHA) & Government of India Health Guarantee",
            "the_rule": "Completely cashless hospital treatment up to ₹5,00,000 per family per year across 27,000+ empanelled private and public hospitals.",
            "critical_protections": [
                "Covers 1,949 medical and surgical procedures (including cardiac surgeries, cancer therapy, neurosurgery, orthopedics).",
                "Pre-existing illnesses covered from Day 1.",
                "No cap on family size or age (recently expanded to all senior citizens aged 70+ irrespective of income).",
                "Cashless and paperless at the point of delivery."
            ],
            "citizen_action": "Check eligibility on pmjay.gov.in or call toll-free 14555. Visit Ayushman Mitra desk at any empanelled hospital."
        },
        {
            "title": "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (Affordable Medicines)",
            "legal_basis": "Department of Pharmaceuticals, Ministry of Chemicals and Fertilizers",
            "the_rule": "Quality generic medicines made available at 50% to 90% cheaper rates compared to branded market alternatives across 10,000+ Jan Aushadhi Kendras.",
            "critical_protections": [
                "Covers over 2,000 generic medicines and 300 surgical devices.",
                "Every batch tested by NABL-accredited laboratories for equivalence."
            ],
            "citizen_action": "Ask your doctor to write the generic formulation name on prescriptions as mandated by National Medical Commission (NMC) regulations."
        }
    ],
    "what_to_do_if_hospital_violates": [
        "Emergency Refusal: Call Police Emergency (112) immediately and state that the hospital is violating the Supreme Court's Parmanand Katara ruling.",
        "File a complaint with the State Medical Council for professional misconduct against the treating management.",
        "Lodge a Consumer Complaint under Consumer Protection Act, 2019 for medical deficiency of service and harassment.",
        "National Emergency Medical Ambulance Helpline: Call 108 / 102."
    ]
}

# ─── 4. CONSTITUTIONAL REMEDIES & THE 5 WRITS (ARTICLES 32 & 226) ──────────

WRITS_DATA = [
    {
        "writ": "Habeas Corpus",
        "literal_meaning": "'To have the body of'",
        "purpose": "Protects against illegal detention or kidnapping by police, state agencies, or private persons.",
        "when_used": "When someone is arrested without grounds, kept in custody past 24 hours without magistrate order, or unlawfully detained.",
        "court_action": "The Court orders the detaining authority to bring the detained person before the bench immediately and sets them free if custody is illegal.",
        "article": "Article 32 (SC) / Article 226 (HC)"
    },
    {
        "writ": "Mandamus",
        "literal_meaning": "'We Command'",
        "purpose": "Commands a public official, government department, municipal body, or university to perform a mandatory statutory duty they failed to do.",
        "when_used": "When an authority refuses to process an RTE admission, grant a legal license, release legitimate pensions, or clean public drains.",
        "court_action": "Orders the public official to immediately execute their legal duty within a fixed timeframe.",
        "article": "Article 32 (SC) / Article 226 (HC)"
    },
    {
        "writ": "Certiorari",
        "literal_meaning": "'To be certified'",
        "purpose": "Quashes or cancels an illegal order passed by a lower court, tribunal, or quasi-judicial authority that exceeded its jurisdiction.",
        "when_used": "When a tribunal passes an order in violation of Natural Justice (without hearing your side).",
        "court_action": "The higher court cancels the erroneous order and transfers the case for lawful rehearing.",
        "article": "Article 32 (SC) / Article 226 (HC)"
    },
    {
        "writ": "Prohibition",
        "literal_meaning": "'To forbid'",
        "purpose": "A preventive order issued to a lower court or tribunal to stop them from continuing proceedings outside their legal authority.",
        "when_used": "Issued while proceedings are ongoing before an illegal final order is passed.",
        "court_action": "Directs the lower court to halt proceedings immediately.",
        "article": "Article 32 (SC) / Article 226 (HC)"
    },
    {
        "writ": "Quo-Warranto",
        "literal_meaning": "'By what authority?'",
        "purpose": "Prevents unlawful usurpation of a public office by an unqualified person.",
        "when_used": "When someone is appointed to a high public office without possessing the mandatory qualifications.",
        "court_action": "Ousts the person from public office if appointment was unlawful.",
        "article": "Article 32 (SC) / Article 226 (HC)"
    }
]

# ─── 5. FREE LEGAL AID (ARTICLE 39A & NALSA) ───────────────────────────────

LEGAL_AID_DATA = {
    "headline": "Free Legal Aid in India (Article 39A & Legal Services Authorities Act, 1987)",
    "core_mandate": "Equal justice and free legal aid. The State shall provide free legal services to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities.",
    "who_is_entitled_to_free_lawyer": [
        "Women and Children (regardless of income)",
        "Members of Scheduled Castes (SC) and Scheduled Tribes (ST)",
        "Victims of human trafficking or forced labor (begar)",
        "Persons with Disabilities (PwD) / Mental illness",
        "Victims of mass disasters, ethnic violence, flood, drought, earthquake, or industrial accidents",
        "Industrial workmen",
        "Persons in judicial custody, undertrials, or juvenile home inmates",
        "Any citizen whose annual family income is below statutory ceiling (typically ₹1,00,000 to ₹3,00,000 depending on state High Court rules)"
    ],
    "services_provided_free": [
        "Payment of court fees, process fees, and advocate retainers by the government",
        "Drafting of legal petitions, appeals, and bail applications",
        "Representation by an empanelled advocate in District Courts, High Courts, and Supreme Court (SCLSC)",
        "Free certified copies of judgments, police papers, and transcripts"
    ],
    "how_to_access": [
        "Visit the District Legal Services Authority (DLSA) office located in every District Court complex.",
        "Apply online via NALSA Portal: nalsa.gov.in / National Legal Services Authority.",
        "Call National Legal Aid Toll-Free Helpline: 15100 (24x7 pan-India)."
    ]
}

# ─── ROUTER ENDPOINTS ──────────────────────────────────────────────────────

@router.get("/rights")
async def get_all_fundamental_rights():
    """Retrieve all 6 Fundamental Rights clusters under Part III of the Constitution."""
    return {"status": "success", "data": FUNDAMENTAL_RIGHTS_DATA}

@router.get("/education-rights")
async def get_education_rights():
    """Retrieve full guidance on Article 21A, RTE Act Section 12(1)(c) 25% quota in private schools, and fee waivers."""
    return {"status": "success", "data": EDUCATION_RIGHTS_DATA}

@router.get("/health-rights")
async def get_health_rights():
    """Retrieve constitutional medical rights, emergency private hospital care rules, and Ayushman Bharat."""
    return {"status": "success", "data": HEALTH_RIGHTS_DATA}

@router.get("/remedies")
async def get_constitutional_remedies():
    """Retrieve Article 32 & 226 Constitutional Writs guide."""
    return {"status": "success", "data": WRITS_DATA}

@router.get("/legal-aid")
async def get_free_legal_aid():
    """Retrieve Article 39A and NALSA free lawyer eligibility rules."""
    return {"status": "success", "data": LEGAL_AID_DATA}

@router.post("/ask")
async def ask_constitution_question(req: AskConstitutionRequest):
    """Answer citizen rights questions grounded in the Indian Constitution, RTE Act, and Supreme Court rulings."""
    q = req.query.lower()

    if any(w in q for w in ["rte", "school", "private school", "admission", "education", "child", "25%"]):
        return {
            "answer": "Under Article 21A of the Constitution and Section 12(1)(c) of the RTE Act 2009, all private unaided non-minority schools MUST reserve at least 25% of entry-level seats (Nursery/Class 1) for children from Economically Weaker Sections (EWS) and disadvantaged groups. The education is 100% free: no tuition, no admission fees, and free uniforms/textbooks. The Supreme Court in 2012 and 2026 affirmed that schools cannot unlawfully deny admission.",
            "article": "Article 21A & Section 12(1)(c) RTE Act 2009",
            "landmark_case": "Society for Unaided Private Schools v. UOI (2012) & SC 2026 Ruling",
            "action_step": "Apply via state RTE admission portal. If denied, complain to BEO/DEO or NCPCR (1098)."
        }
    elif any(w in q for w in ["hospital", "medical", "doctor", "emergency", "accident", "health", "ayushman"]):
        return {
            "answer": "Under Article 21 (Right to Life), the Supreme Court ruled in the landmark Parmanand Katara (1989) case that EVERY doctor and hospital—whether government or private—is constitutionally obligated to provide immediate life-saving emergency medical treatment. No advance deposit or police clearance can be demanded prior to care. Additionally, trust hospitals on government land must provide 10% free beds, and Ayushman Bharat provides up to ₹5 Lakhs free coverage.",
            "article": "Article 21 (Right to Life & Health)",
            "landmark_case": "Parmanand Katara v. Union of India (1989) & Paschim Banga (1996)",
            "action_step": "If emergency care is denied, call 112 immediately. Hospitals face criminal negligence and contempt."
        }
    elif any(w in q for w in ["arrest", "police", "jail", "custody", "bail", "detain"]):
        return {
            "answer": "Under Article 22 and the D.K. Basu guidelines, you have the fundamental right to know the grounds of arrest immediately, the right to consult an advocate of your choice, a phone call to inform family, and mandatory production before a Judicial Magistrate within 24 hours of arrest. Handcuffing without court permission is prohibited.",
            "article": "Article 22 & D.K. Basu Guidelines",
            "landmark_case": "D.K. Basu v. State of West Bengal (1997)",
            "action_step": "Insist on an Arrest Memo signed by a witness. Do not sign blank papers."
        }
    elif any(w in q for w in ["free lawyer", "legal aid", "cannot afford", "lawyer fee", "nalsa", "dlsa"]):
        return {
            "answer": "Under Article 39A and the Legal Services Authorities Act, 1987, the State provides 100% free legal representation for all women, children, SC/ST citizens, disabled individuals, undertrials, and anyone with annual family income below state statutory ceilings (typically ₹1L to ₹3L). The government pays all court fees and advocate charges.",
            "article": "Article 39A (Equal Justice & Free Legal Aid)",
            "landmark_case": "Hussainara Khatoon v. Home Secretary, State of Bihar (1979)",
            "action_step": "Visit your District Court's DLSA office or call the national NALSA toll-free helpline: 15100."
        }
    elif any(w in q for w in ["writ", "article 32", "article 226", "remedy", "habeas corpus"]):
        return {
            "answer": "Article 32 allows citizens to approach the Supreme Court directly, and Article 226 allows approaching the High Court for violations of Fundamental Rights. Courts issue five constitutional writs: Habeas Corpus (against illegal detention), Mandamus (compelling public duty), Prohibition (halting illegal trial), Certiorari (quashing illegal orders), and Quo-Warranto (challenging illegal public appointments).",
            "article": "Article 32 & 226",
            "landmark_case": "Kesavananda Bharati v. State of Kerala (1973)",
            "action_step": "File a Writ Petition in High Court under Art 226 or Supreme Court under Art 32."
        }
    else:
        return {
            "answer": "The Indian Constitution guarantees 6 Fundamental Rights in Part III (Articles 12-35): Right to Equality (Art 14-18), Right to Freedom (Art 19-22), Right against Exploitation (Art 23-24), Freedom of Religion (Art 25-28), Cultural & Educational Rights (Art 29-30), and Constitutional Remedies (Art 32). These rights bind both central and state governments.",
            "article": "Part III of Constitution (Articles 12-35)",
            "landmark_case": "Fundamental Rights Chapter of Indian Constitution",
            "action_step": "Explore the Constitution Hub tabs to learn about specific entitlements."
        }
