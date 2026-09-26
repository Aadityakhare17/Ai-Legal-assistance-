"""
Demo data — fictional legal documents and pre-computed analysis for hackathon demo.
All names, addresses, and entities are entirely fictional.
"""

DEMO_RENTAL_AGREEMENT_TEXT = """
RESIDENTIAL RENTAL AGREEMENT

This Residential Rental Agreement ("Agreement") is entered into as of 1st April, 2024, between:

LANDLORD: Demo Properties Pvt. Ltd., a company incorporated under the Companies Act, 2013,
having its registered office at 42, Fictional Tower, Business District, Mumbai – 400001
("Landlord")

AND

TENANT: Aarav Sharma, S/o Ramesh Sharma, residing at 15, Old Street, Pune – 411001
("Tenant")

TOGETHER referred to as "the Parties."

PROPERTY DESCRIPTION
The Landlord agrees to rent the following residential premises to the Tenant:
Address: Flat No. 304, Block B, Harmony Heights, Andheri West, Mumbai – 400058
("Premises")
Area: 1,050 square feet (approximately)

TERM
1. This Agreement shall commence on 1st April, 2024, and shall continue for a period of
ELEVEN (11) MONTHS, expiring on 28th February, 2025 ("Term").

2. LOCK-IN PERIOD: The Tenant agrees to a lock-in period of SIX (6) MONTHS from the
commencement date. During the lock-in period, the Tenant shall not vacate the Premises
without forfeiting the security deposit.

3. RENEWAL: Upon expiry of the Term, this Agreement may be renewed by mutual written
consent of both Parties. The Tenant must provide written notice of renewal intent at least
SIXTY (60) days before the expiry of the Term.

RENT AND PAYMENT
4. MONTHLY RENT: The Tenant agrees to pay a monthly rent of Rs. 28,000/- (Rupees
Twenty-Eight Thousand Only) on or before the 5th day of each calendar month.

5. SECURITY DEPOSIT: The Tenant has paid a refundable security deposit of Rs. 84,000/-
(Rupees Eighty-Four Thousand Only) equivalent to three months' rent. This deposit shall
be refunded within THIRTY (30) days of vacating, subject to deductions for damages.

6. RENT ESCALATION: The monthly rent shall be subject to an annual escalation of TEN
PERCENT (10%) upon renewal of this Agreement.

7. LATE PAYMENT PENALTY: In the event the Tenant fails to pay rent by the 10th of the
month, a late payment penalty of Rs. 500/- per day shall be charged for each day of delay.

8. MAINTENANCE CHARGES: The Tenant shall pay monthly maintenance charges of Rs. 2,500/-
directly to the Housing Society, in addition to the monthly rent.

OBLIGATIONS OF THE TENANT
9. The Tenant shall:
   a) Use the Premises solely for residential purposes
   b) Not sublet or assign the Premises to any third party without prior written consent of Landlord
   c) Maintain the Premises in good condition and repair minor damages
   d) Pay all utility bills including electricity, gas, and water charges
   e) Comply with all rules and regulations of the housing society
   f) Not carry out any structural alterations to the Premises
   g) Allow the Landlord or their authorized representative to inspect the Premises with 48 hours prior notice

OBLIGATIONS OF THE LANDLORD
10. The Landlord shall:
    a) Ensure the Premises are in habitable condition at the time of handover
    b) Be responsible for major structural repairs
    c) Not disturb the Tenant's peaceful enjoyment of the Premises
    d) Refund the security deposit within 30 days of vacating, subject to deductions

TERMINATION
11. TERMINATION BY TENANT: The Tenant may terminate this Agreement by providing THREE
(3) MONTHS written notice after the lock-in period. During the notice period, full rent
must be paid.

12. TERMINATION BY LANDLORD: The Landlord may terminate this Agreement for breach of
terms by giving ONE (1) MONTH written notice.

13. IMMEDIATE TERMINATION: The Landlord reserves the right to seek immediate eviction
if the Tenant:
    a) Fails to pay rent for two consecutive months
    b) Uses the Premises for illegal activities
    c) Causes willful damage to the property

14. EARLY TERMINATION PENALTY: If the Tenant terminates within the lock-in period, the
security deposit shall stand forfeited and the Tenant shall pay rent for the remaining
lock-in period.

GENERAL PROVISIONS
15. DISPUTE RESOLUTION: Any disputes arising from this Agreement shall first be attempted
to be resolved through mutual negotiation. If unresolved within 30 days, disputes shall
be referred to arbitration under the Arbitration and Conciliation Act, 1996.

16. GOVERNING LAW: This Agreement shall be governed by the laws of India and the State
of Maharashtra.

17. ENTIRE AGREEMENT: This Agreement constitutes the entire agreement between the
Parties and supersedes all prior understandings.

IN WITNESS WHEREOF, the Parties have executed this Agreement on the date first mentioned above.

LANDLORD:
Demo Properties Pvt. Ltd.
Authorized Signatory: Mr. Vikram Mehta (Director)
Date: 1st April, 2024

TENANT:
Aarav Sharma
Date: 1st April, 2024
"""

DEMO_ANALYSIS = {
    "document_type": "Residential Rental Agreement",
    "document_type_confidence": 0.98,
    "summary": "This is a residential rental agreement between Demo Properties Pvt. Ltd. (Landlord) and Aarav Sharma (Tenant) for Flat No. 304, Harmony Heights, Andheri West, Mumbai. The agreement is for 11 months starting April 1, 2024, with a monthly rent of ₹28,000. It includes a 6-month lock-in period, a ₹84,000 security deposit, and provisions for renewal, termination, and late payment penalties.",
    "parties": [
        {"role": "Landlord", "name": "Demo Properties Pvt. Ltd.", "description": "Property management company, registered in Mumbai"},
        {"role": "Tenant", "name": "Aarav Sharma", "description": "Individual tenant residing in Pune"}
    ],
    "important_dates": [
        {"label": "Agreement Start Date", "date": "1st April, 2024", "description": "Tenancy begins", "type": "start"},
        {"label": "Agreement Expiry", "date": "28th February, 2025", "description": "Agreement ends after 11 months", "type": "end"},
        {"label": "Lock-in Period End", "date": "30th September, 2024", "description": "6-month lock-in period expires", "type": "other"},
        {"label": "Renewal Notice Deadline", "date": "31st December, 2024", "description": "60 days before expiry — deadline to give renewal notice", "type": "notice"},
        {"label": "Monthly Rent Due", "date": "5th of every month", "description": "Rent must be paid by 5th. Penalty from 10th.", "type": "payment"},
        {"label": "Security Deposit Refund", "date": "Within 30 days of vacating", "description": "Landlord must refund deposit within 30 days", "type": "other"}
    ],
    "financial_terms": [
        {"label": "Monthly Rent", "amount": "₹28,000", "frequency": "Monthly", "description": "Must be paid by 5th of each month", "type": "rent"},
        {"label": "Security Deposit", "amount": "₹84,000", "frequency": "One-time", "description": "Refundable within 30 days of vacating, subject to deductions", "type": "deposit"},
        {"label": "Maintenance Charges", "amount": "₹2,500", "frequency": "Monthly", "description": "Paid directly to housing society, in addition to rent", "type": "fee"},
        {"label": "Late Payment Penalty", "amount": "₹500/day", "frequency": "Per incident", "description": "Charged from 11th of month if rent unpaid", "type": "penalty"},
        {"label": "Rent Escalation", "amount": "10%", "frequency": "Annual (on renewal)", "description": "Rent increases by 10% upon renewal", "type": "other"}
    ],
    "obligations": [
        {"obligation": "Pay monthly rent of ₹28,000 by 5th of each month", "party": "Tenant", "deadline": "5th of every month", "frequency": "Monthly", "status": "pending"},
        {"obligation": "Pay maintenance charges of ₹2,500 to housing society", "party": "Tenant", "deadline": "Monthly", "frequency": "Monthly", "status": "pending"},
        {"obligation": "Provide 3 months written notice before vacating", "party": "Tenant", "deadline": "After lock-in period", "frequency": "One-time", "status": "pending"},
        {"obligation": "Pay all utility bills (electricity, gas, water)", "party": "Tenant", "deadline": "As billed", "frequency": "Monthly", "status": "pending"},
        {"obligation": "Provide renewal notice 60 days before agreement expiry", "party": "Tenant", "deadline": "31st December, 2024", "frequency": "One-time", "status": "pending"},
        {"obligation": "Ensure premises are habitable at handover", "party": "Landlord", "deadline": "1st April, 2024", "frequency": "One-time", "status": "pending"},
        {"obligation": "Refund security deposit within 30 days of vacating", "party": "Landlord", "deadline": "Within 30 days of vacation", "frequency": "One-time", "status": "pending"},
        {"obligation": "Handle major structural repairs", "party": "Landlord", "deadline": "As needed", "frequency": "As needed", "status": "pending"}
    ],
    "rights": [
        {"right": "Right to peaceful enjoyment of premises", "party": "Tenant", "description": "Landlord cannot disturb tenant's peaceful occupancy"},
        {"right": "Right to inspect with 48 hours notice", "party": "Landlord", "description": "Landlord can inspect premises after giving 48 hours advance notice"},
        {"right": "Right to terminate with 1 month notice for breach", "party": "Landlord", "description": "Landlord can terminate if tenant breaches terms"},
        {"right": "Right to terminate with 3 months notice after lock-in", "party": "Tenant", "description": "Tenant can exit after lock-in period with 3 months notice"},
        {"right": "Right to deduct damages from security deposit", "party": "Landlord", "description": "Landlord can deduct repair costs from refundable deposit"}
    ],
    "risk_flags": [
        {
            "title": "6-Month Lock-in Period",
            "description": "You cannot vacate without financial consequences for the first 6 months. Leaving during this period means forfeiting your entire ₹84,000 security deposit plus paying rent for the remaining lock-in period.",
            "severity": "risk",
            "clause_text": "The Tenant agrees to a lock-in period of SIX (6) MONTHS from the commencement date. During the lock-in period, the Tenant shall not vacate the Premises without forfeiting the security deposit.",
            "why_it_matters": "This is a significant financial commitment. If your circumstances change (job change, relocation), exiting early could cost ₹84,000 or more.",
            "affected_party": "Tenant",
            "things_to_check": ["What are your likely future plans for the next 6 months?", "Is the lock-in period negotiable before signing?", "What exactly are the deductible items from the security deposit?"]
        },
        {
            "title": "10% Annual Rent Escalation",
            "description": "If you renew the agreement, your rent will increase by 10%. On ₹28,000, this means ₹2,800 more per month (₹30,800) from the second year.",
            "severity": "attention",
            "clause_text": "The monthly rent shall be subject to an annual escalation of TEN PERCENT (10%) upon renewal of this Agreement.",
            "why_it_matters": "Rent escalation clauses are common, but 10% per year is worth noting for long-term budgeting.",
            "affected_party": "Tenant",
            "things_to_check": ["Is the escalation percentage negotiable?", "Does the escalation apply even if market rates stay flat?"]
        },
        {
            "title": "Late Payment Penalty — ₹500/Day",
            "description": "If rent is not paid by the 10th of the month (5 days after due date), a penalty of ₹500 per day is charged. One week late could mean ₹3,500 in extra charges.",
            "severity": "review",
            "clause_text": "A late payment penalty of Rs. 500/- per day shall be charged for each day of delay.",
            "why_it_matters": "This penalty accumulates daily and can add up significantly. Set up a payment reminder.",
            "affected_party": "Tenant",
            "things_to_check": ["Is there a grace period before penalties start?", "Can this penalty rate be negotiated?", "Is there a cap on total penalty amount?"]
        },
        {
            "title": "Security Deposit Deductions Undefined",
            "description": "The agreement states the deposit is refundable 'subject to deductions for damages' but does not define what constitutes damages or normal wear and tear.",
            "severity": "review",
            "clause_text": "This deposit shall be refunded within THIRTY (30) days of vacating, subject to deductions for damages.",
            "why_it_matters": "Without clear definitions, disputes about what counts as 'damage' are common. Consider documenting the property's condition at move-in.",
            "affected_party": "Tenant",
            "things_to_check": ["Request a move-in condition checklist signed by both parties", "Clarify what constitutes 'damages' vs normal wear and tear", "Take dated photographs at move-in"]
        },
        {
            "title": "Arbitration Clause — No Court Access",
            "description": "Disputes must first go through negotiation (30 days) and then to arbitration. This may limit your ability to approach courts directly.",
            "severity": "attention",
            "clause_text": "disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996",
            "why_it_matters": "Arbitration can be faster than courts but has different rules. Understand the process before signing.",
            "affected_party": "Both Parties",
            "things_to_check": ["Who selects the arbitrator?", "Who bears the cost of arbitration?", "Can either party go to court if arbitration fails?"]
        }
    ],
    "unusual_clauses": [
        {
            "title": "3-Month Tenant Notice vs 1-Month Landlord Notice",
            "clause_text": "Tenant: 3 months notice; Landlord: 1 month notice",
            "why_unusual": "The notice periods are asymmetric — the tenant must give 3 months notice, but the landlord only needs to give 1 month. This may be worth discussing before signing."
        }
    ],
    "missing_information": [
        {"item": "Furnishing Status", "why_important": "The agreement doesn't clearly specify whether the flat is furnished, semi-furnished, or unfurnished, which affects deposit deductions."},
        {"item": "Inventory List", "why_important": "No inventory of fittings, appliances, or furniture is attached, making move-out disputes more likely."},
        {"item": "Parking Details", "why_important": "No mention of parking space allocation or charges."},
        {"item": "Pet Policy", "why_important": "No clause about whether pets are permitted."}
    ],
    "questions_to_ask": [
        {"question": "What specific items will be deducted from the security deposit, and how is 'damage' defined vs normal wear and tear?", "context": "Security deposit clause is vague about deductions", "priority": "high"},
        {"question": "Can the lock-in period be reduced or the penalty for early exit be negotiated?", "context": "Lock-in clause has significant financial consequences", "priority": "high"},
        {"question": "Who selects the arbitrator in case of disputes, and who pays the arbitration costs?", "context": "Arbitration clause doesn't specify these details", "priority": "medium"},
        {"question": "Is a move-in condition checklist and inventory list available?", "context": "No inventory or condition report mentioned", "priority": "high"},
        {"question": "Can the rent escalation percentage be capped or made conditional on mutual consent?", "context": "10% annual escalation applies on renewal", "priority": "medium"},
        {"question": "Is there a cap on the late payment penalty?", "context": "₹500/day penalty with no mentioned cap", "priority": "medium"}
    ],
    "action_checklist": [
        {"action": "Document property condition at move-in", "description": "Take photographs and videos of every room, note all existing damages in writing and get landlord's signature", "priority": "high"},
        {"action": "Set up automatic rent payment", "description": "Ensure rent is paid by 5th to avoid the ₹500/day late penalty", "priority": "high"},
        {"action": "Note your renewal notice deadline", "description": "Set a calendar reminder for 31st December 2024 if you wish to renew", "priority": "high"},
        {"action": "Verify the security deposit receipt", "description": "Ensure you have written acknowledgment of the ₹84,000 deposit payment", "priority": "high"},
        {"action": "Review housing society rules", "description": "Obtain a copy of the society's rules and regulations", "priority": "medium"},
        {"action": "Clarify maintenance charge details", "description": "Get details on the ₹2,500 maintenance — what's covered, how to pay", "priority": "medium"}
    ],
    "clauses": [
        {
            "title": "Lock-in Period",
            "original_text": "The Tenant agrees to a lock-in period of SIX (6) MONTHS from the commencement date. During the lock-in period, the Tenant shall not vacate the Premises without forfeiting the security deposit.",
            "simple_explanation": "You must stay for at least 6 months. If you leave before that, you lose your entire security deposit of ₹84,000.",
            "very_simple_explanation": "You must live here for at least 6 months. If you leave early, you lose your ₹84,000 deposit.",
            "why_it_matters": "This is a significant financial commitment. Leaving early has major financial consequences.",
            "affected_party": "Tenant",
            "things_to_check": ["Can the lock-in period be negotiated?", "What exactly happens if I need to leave urgently?"],
            "confidence": "high",
            "category": "termination"
        },
        {
            "title": "Security Deposit",
            "original_text": "The Tenant has paid a refundable security deposit of Rs. 84,000/- equivalent to three months' rent. This deposit shall be refunded within THIRTY (30) days of vacating, subject to deductions for damages.",
            "simple_explanation": "You paid ₹84,000 as a refundable deposit. The landlord must return it within 30 days after you leave, but can deduct amounts for any damages beyond normal wear.",
            "very_simple_explanation": "You paid ₹84,000 which will be returned when you leave (within 30 days), minus any damage costs.",
            "why_it_matters": "This is a substantial amount. Understanding what 'damages' means is crucial to getting your full deposit back.",
            "affected_party": "Both Parties",
            "things_to_check": ["Get the property condition documented", "Clarify what constitutes damage vs wear and tear"],
            "confidence": "high",
            "category": "payment"
        },
        {
            "title": "Late Payment Penalty",
            "original_text": "In the event the Tenant fails to pay rent by the 10th of the month, a late payment penalty of Rs. 500/- per day shall be charged for each day of delay.",
            "simple_explanation": "If you pay rent after the 10th, you'll be charged ₹500 for every day you're late. Being 7 days late could cost ₹3,500 extra.",
            "very_simple_explanation": "Pay rent by the 5th. After the 10th, you pay ₹500 extra for every late day.",
            "why_it_matters": "This penalty can add up quickly. Always pay rent on time.",
            "affected_party": "Tenant",
            "things_to_check": ["Is there a maximum cap on this penalty?", "Can this be reduced through negotiation?"],
            "confidence": "high",
            "category": "penalty"
        },
        {
            "title": "Renewal Clause",
            "original_text": "Upon expiry of the Term, this Agreement may be renewed by mutual written consent of both Parties. The Tenant must provide written notice of renewal intent at least SIXTY (60) days before the expiry of the Term.",
            "simple_explanation": "The agreement can be renewed if both sides agree in writing. You must inform the landlord at least 60 days before the agreement ends (by December 31, 2024) if you want to renew.",
            "very_simple_explanation": "Tell your landlord by December 31, 2024 if you want to stay after February 2025.",
            "why_it_matters": "Missing this deadline could mean having to vacate. The renewal isn't automatic — both parties must agree.",
            "affected_party": "Tenant",
            "things_to_check": ["What happens if you miss the 60-day deadline?", "Can you negotiate the renewal terms before giving notice?"],
            "confidence": "high",
            "category": "renewal"
        },
        {
            "title": "Early Termination by Tenant",
            "original_text": "The Tenant may terminate this Agreement by providing THREE (3) MONTHS written notice after the lock-in period. During the notice period, full rent must be paid.",
            "simple_explanation": "After the 6-month lock-in period, you can leave by giving 3 months written notice. You must pay full rent during those 3 months.",
            "very_simple_explanation": "After 6 months, to leave you need to give 3 months advance notice and pay rent for those 3 months.",
            "why_it_matters": "This is a long notice period. You could be paying rent for 3 months even if you've found a new place.",
            "affected_party": "Tenant",
            "things_to_check": ["Can the notice period be negotiated to 2 months?", "Is there any exception to the notice requirement?"],
            "confidence": "high",
            "category": "termination"
        },
        {
            "title": "Subletting Restriction",
            "original_text": "Not sublet or assign the Premises to any third party without prior written consent of Landlord",
            "simple_explanation": "You cannot rent out the flat (or any part of it) to another person without the landlord's written permission.",
            "very_simple_explanation": "You cannot share or sublet this flat without the landlord's written permission.",
            "why_it_matters": "Violating this could be grounds for eviction.",
            "affected_party": "Tenant",
            "things_to_check": ["If you need a flatmate, get written landlord consent first"],
            "confidence": "high",
            "category": "obligations"
        }
    ],
    "timeline_events": [
        {"event": "Agreement Starts", "date": "1st April, 2024", "description": "Tenancy commences, keys handed over", "type": "start", "is_deadline": False},
        {"event": "Monthly Rent Due", "date": "5th of each month", "description": "Pay ₹28,000 rent by 5th. Penalty from 10th.", "type": "payment", "is_deadline": True},
        {"event": "Lock-in Period Ends", "date": "30th September, 2024", "description": "You may now terminate with 3 months notice without forfeiting deposit", "type": "other", "is_deadline": False},
        {"event": "Renewal Notice Deadline", "date": "31st December, 2024", "description": "Final date to give 60-day notice if you want to renew the agreement", "type": "notice", "is_deadline": True},
        {"event": "Agreement Expires", "date": "28th February, 2025", "description": "11-month term ends. Must vacate or have renewed.", "type": "expiry", "is_deadline": True},
        {"event": "Security Deposit Refund", "date": "Within 30 days of vacating", "description": "Landlord must return ₹84,000 (minus deductions)", "type": "other", "is_deadline": True}
    ],
    "before_you_sign": {
        "five_things_to_understand": [
            "You are committing to 6 months minimum stay — leaving early means losing your ₹84,000 deposit",
            "Your total monthly cost is ₹30,500 (₹28,000 rent + ₹2,500 maintenance), not just ₹28,000",
            "Rent must be paid by the 5th — after the 10th, you pay ₹500 extra per day",
            "If you want to renew, you must give written notice by December 31, 2024",
            "To leave after the lock-in period, you still need to give 3 months advance notice"
        ],
        "important_commitments": [
            "Pay ₹28,000 monthly rent by the 5th of each month",
            "Pay ₹2,500 monthly maintenance to the housing society",
            "Maintain the flat in good condition",
            "Pay all utility bills separately",
            "Get landlord's written permission before letting anyone else stay"
        ],
        "dates_to_remember": [
            "5th of every month — rent payment due",
            "30th September, 2024 — lock-in period ends",
            "31st December, 2024 — latest date to give renewal notice",
            "28th February, 2025 — agreement expires"
        ],
        "clauses_to_review": [
            "Lock-in period and early exit penalty (Clause 2 & 14)",
            "Late payment penalty of ₹500/day (Clause 7)",
            "Security deposit deduction terms (Clause 5)",
            "Asymmetric notice periods: Tenant (3 months) vs Landlord (1 month) (Clauses 11 & 12)",
            "10% rent escalation on renewal (Clause 6)"
        ],
        "questions_to_ask": [
            "Can I get a written inventory of the flat's condition before moving in?",
            "What exactly can be deducted from the security deposit?",
            "Is the 3-month notice period negotiable?",
            "Who picks the arbitrator if there's a dispute and who pays the costs?"
        ],
        "information_to_clarify": [
            "Parking: Is a parking space included? Are there additional charges?",
            "Furnished status: Is the flat furnished, semi-furnished, or unfurnished?",
            "Pet policy: Are pets allowed?",
            "Guest policy: Any restrictions on overnight guests?"
        ]
    },
    "legal_lens": {
        "money": [
            {"title": "Monthly Rent", "detail": "₹28,000 due by 5th of every month", "clause_ref": "Clause 4"},
            {"title": "Security Deposit", "detail": "₹84,000 refundable within 30 days of vacating (minus deductions)", "clause_ref": "Clause 5"},
            {"title": "Maintenance Charges", "detail": "₹2,500/month paid directly to housing society (not included in rent)", "clause_ref": "Clause 8"},
            {"title": "Late Payment Penalty", "detail": "₹500/day from 10th of month if rent unpaid", "clause_ref": "Clause 7"},
            {"title": "Annual Rent Increase", "detail": "10% increase on renewal (₹28,000 → ₹30,800)", "clause_ref": "Clause 6"},
            {"title": "Early Exit Penalty", "detail": "Forfeit ₹84,000 deposit + remaining lock-in rent if leaving before Sept 2024", "clause_ref": "Clause 14"}
        ],
        "deadlines": [
            {"title": "Rent Due", "detail": "Pay by 5th monthly. Penalty kicks in from 10th.", "date": "5th of every month"},
            {"title": "Lock-in Ends", "detail": "You can give exit notice after this date", "date": "30th September, 2024"},
            {"title": "Renewal Notice Deadline", "detail": "Inform landlord in writing if you want to renew", "date": "31st December, 2024"},
            {"title": "Agreement Expiry", "detail": "Must vacate or have renewed by this date", "date": "28th February, 2025"},
            {"title": "Deposit Refund", "detail": "Landlord must return deposit by this deadline", "date": "Within 30 days of vacating"}
        ],
        "risk": [
            {"title": "Lock-in Trap", "detail": "Leaving before September 2024 costs you ₹84,000 deposit + remaining months' rent", "severity": "risk"},
            {"title": "Daily Late Penalty", "detail": "₹500/day penalty with no apparent cap — can become very large", "severity": "risk"},
            {"title": "Vague Deposit Deductions", "detail": "No clear definition of what constitutes 'damage' for deposit deductions", "severity": "review"},
            {"title": "Asymmetric Notice Periods", "detail": "Landlord can ask you to leave with 1 month notice; you need 3 months", "severity": "attention"},
            {"title": "Arbitration Without Terms", "detail": "Dispute goes to arbitration but arbitrator selection and costs are unspecified", "severity": "attention"}
        ],
        "privacy": [
            {"title": "Landlord Inspection Rights", "detail": "Landlord can inspect premises with 48 hours advance notice"},
            {"title": "No Data Collection Clause", "detail": "Agreement does not mention any personal data handling policies"}
        ],
        "rights": [
            {"title": "Peaceful Enjoyment", "detail": "Landlord cannot disturb your peaceful occupancy", "party": "Tenant"},
            {"title": "Habitable Premises", "detail": "Landlord must provide premises in habitable condition", "party": "Tenant"},
            {"title": "Major Repairs", "detail": "Landlord is responsible for structural repairs", "party": "Tenant"},
            {"title": "Inspect with Notice", "detail": "Can inspect premises with 48 hours notice", "party": "Landlord"},
            {"title": "Immediate Eviction", "detail": "Can seek eviction for non-payment or illegal activities", "party": "Landlord"}
        ],
        "obligations": [
            {"title": "Pay Rent", "detail": "₹28,000 monthly by 5th, ₹2,500 maintenance separately", "party": "Tenant"},
            {"title": "Residential Use Only", "detail": "Cannot use flat for business or commercial activities", "party": "Tenant"},
            {"title": "No Subletting", "detail": "Cannot rent to others without written landlord permission", "party": "Tenant"},
            {"title": "Pay Utilities", "detail": "Electricity, gas, water — all paid by tenant", "party": "Tenant"},
            {"title": "No Structural Changes", "detail": "Cannot drill walls, renovate or alter structure without consent", "party": "Tenant"},
            {"title": "Refund Deposit", "detail": "Must return ₹84,000 within 30 days of tenant vacating", "party": "Landlord"}
        ]
    }
}

DEMO_EMPLOYMENT_CONTRACT_TEXT = """
EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is made on 15th March, 2024, between:

EMPLOYER: TechNova Solutions Pvt. Ltd., having its office at Plot 12, Tech Park, Bengaluru – 560100 ("Company")

AND

EMPLOYEE: Priya Nair, residing at 8, Rose Garden Apartments, Koramangala, Bengaluru – 560034 ("Employee")

POSITION AND DUTIES
1. The Company hereby employs the Employee as Senior Software Engineer.
2. The Employee shall report to the Engineering Manager and perform all duties assigned.

COMMENCEMENT DATE
3. Employment shall commence on 1st April, 2024.

PROBATION PERIOD
4. The Employee shall serve a probation period of THREE (3) MONTHS, during which either party may terminate employment with ONE (1) WEEK notice without cause.

COMPENSATION
5. BASE SALARY: The Employee shall receive a gross annual CTC of Rs. 14,40,000/- (Rupees Fourteen Lakhs Forty Thousand), paid monthly.

6. PERFORMANCE BONUS: The Employee may be eligible for an annual performance bonus at the Company's sole discretion, based on individual and Company performance.

7. SALARY REVISION: Salary revision shall be at the Company's discretion, typically annually.

WORKING HOURS
8. Standard working hours are 9:30 AM to 6:30 PM, Monday to Friday. The Employee may be required to work additional hours without additional compensation.

LEAVE
9. The Employee shall be entitled to: 15 days Earned Leave, 10 days Casual/Sick Leave, and applicable public holidays as per Company policy.

INTELLECTUAL PROPERTY
10. All intellectual property, inventions, software, code, or work product created by the Employee during employment, whether during working hours or otherwise, using Company resources or personal resources, shall be the exclusive property of the Company.

CONFIDENTIALITY
11. The Employee shall maintain strict confidentiality of all Company information, client data, business processes, and trade secrets during employment and for a period of TWO (2) YEARS after separation.

NON-COMPETE
12. For a period of ONE (1) YEAR after leaving the Company, the Employee shall not join any direct competitor of the Company or work on competing products in India.

TERMINATION
13. After probation, either party may terminate employment with THREE (3) MONTHS written notice or payment of salary in lieu of notice.

14. The Company may terminate immediately for cause including misconduct, breach of this Agreement, or fraud.

GOVERNING LAW
15. This Agreement is governed by the laws of India.

IN WITNESS WHEREOF:

TechNova Solutions Pvt. Ltd.        Priya Nair
HR Director                          Employee
Date: 15th March, 2024              Date: 15th March, 2024
"""

DEMO_NDA_TEXT = """
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on 1st June, 2024, between:

DISCLOSING PARTY: InnovateTech Pvt. Ltd. ("Company")
RECEIVING PARTY: Rahul Gupta, Freelance Consultant

PURPOSE
The Parties wish to explore a potential business collaboration regarding the Company's upcoming AI product.

CONFIDENTIAL INFORMATION
1. "Confidential Information" means all non-public information disclosed by the Company relating to its products, technology, business plans, client data, and financial information.

OBLIGATIONS
2. The Receiving Party agrees to:
   a) Keep all Confidential Information strictly confidential
   b) Not disclose to any third party without prior written consent
   c) Use Confidential Information only for evaluating the proposed collaboration
   d) Apply the same level of protection as for its own confidential information (minimum reasonable care)

TERM
3. This Agreement shall remain in effect for THREE (3) YEARS from the date of signing.

EXCLUSIONS
4. Confidential Information does not include information that:
   a) Is or becomes publicly known through no breach of this Agreement
   b) Was independently developed by Receiving Party
   c) Is required to be disclosed by law or court order

REMEDIES
5. Breach of this Agreement may cause irreparable harm. The Company may seek injunctive relief in addition to other legal remedies.

GOVERNING LAW
6. This Agreement is governed by Indian law, with exclusive jurisdiction in Mumbai courts.

IN WITNESS WHEREOF, both parties sign below.
"""

DEMO_RENTAL_AGREEMENT_2_TEXT = """
RESIDENTIAL LEAVE AND LICENSE AGREEMENT

This Leave and License Agreement is executed on 1st April, 2024, between:

LICENSOR: Demo Properties Pvt. Ltd. ("Owner")
LICENSEE: Aarav Sharma ("Licensee")

PROPERTY: Flat No. 304, Block B, Harmony Heights, Andheri West, Mumbai – 400058

TERM: TWELVE (12) MONTHS from 1st April 2024 to 31st March 2025

LICENSE FEE: Rs. 25,000/- per month, payable by 1st of each month

DEPOSIT: Rs. 50,000/- (Two months), refundable within 15 days of vacating

NOTICE PERIOD: Two (2) months by either party after lock-in of 3 months

LOCK-IN: THREE (3) MONTHS lock-in period

MAINTENANCE: Rs. 2,000/- per month (included in this agreement)

RENT ESCALATION: 7% annually on renewal

LATE PAYMENT: Rs. 200/- per day after 7 days grace period

TERMINATION: 2 months notice by either party after lock-in period expires.

DISPUTE RESOLUTION: Disputes resolved through the Consumer Forum or competent courts in Mumbai.
"""

DEMO_COMPARISON_ANALYSIS = {
    "executive_summary": "Document A (Rental Agreement) and Document B (Leave and License Agreement) cover the same property but differ significantly in key financial and procedural terms. Document B offers lower rent (₹25,000 vs ₹28,000), a smaller deposit (₹50,000 vs ₹84,000), a shorter lock-in period (3 vs 6 months), and lower penalties. However, Document B also has a shorter notice period requirement. These differences may be important depending on your situation and negotiating position.",
    "comparison_table": [
        {"category": "Agreement Type", "document_a": "Rental Agreement (stronger tenant protections)", "document_b": "Leave & License (landlord can easier reclaim)", "difference": "Leave & License gives the landlord easier legal recourse to reclaim property; Rental Agreement provides more tenant security", "significance": "high"},
        {"category": "Monthly Rent", "document_a": "₹28,000/month", "document_b": "₹25,000/month", "difference": "Document B is ₹3,000/month cheaper — ₹36,000/year savings", "significance": "high"},
        {"category": "Security Deposit", "document_a": "₹84,000 (3 months)", "document_b": "₹50,000 (2 months)", "difference": "Document A requires ₹34,000 more upfront", "significance": "high"},
        {"category": "Lock-in Period", "document_a": "6 months", "document_b": "3 months", "difference": "Document B offers more flexibility with half the lock-in period", "significance": "high"},
        {"category": "Notice Period", "document_a": "3 months (Tenant)", "document_b": "2 months (Either Party)", "difference": "Document B has equal notice requirements and is shorter for tenant", "significance": "medium"},
        {"category": "Late Payment Penalty", "document_a": "₹500/day from 10th", "document_b": "₹200/day after 7-day grace period", "difference": "Document B is significantly more lenient on late payments", "significance": "medium"},
        {"category": "Maintenance", "document_a": "₹2,500 to society (extra)", "document_b": "₹2,000 included in agreement", "difference": "Document A has higher maintenance paid separately; Document B is slightly lower and consolidated", "significance": "medium"},
        {"category": "Rent Escalation", "document_a": "10% annually", "document_b": "7% annually", "difference": "Document B has lower escalation — better for long-term tenancy", "significance": "medium"},
        {"category": "Deposit Refund", "document_a": "30 days", "document_b": "15 days", "difference": "Document B refunds deposit faster", "significance": "low"},
        {"category": "Dispute Resolution", "document_a": "Arbitration (cost implications)", "document_b": "Consumer Forum or courts", "difference": "Document B allows direct court access; Document A requires arbitration first", "significance": "medium"},
        {"category": "Duration", "document_a": "11 months", "document_b": "12 months", "difference": "Document B gives one extra month of tenure", "significance": "low"}
    ],
    "change_impacts": [
        {
            "title": "Lower Financial Commitment",
            "original": "₹28,000 rent + ₹84,000 deposit + ₹2,500 maintenance",
            "new": "₹25,000 rent + ₹50,000 deposit + ₹2,000 maintenance (included)",
            "what_changed": "Total initial outlay reduced by ₹34,000; monthly commitment reduced by ₹5,500",
            "who_may_be_affected": "Tenant — significantly lower financial burden",
            "what_to_ask": "Are both documents for the same property at the same time? Is one the revised offer after negotiation?"
        },
        {
            "title": "Shorter Lock-in Period",
            "original": "6-month lock-in (cannot leave until October 2024 without penalty)",
            "new": "3-month lock-in (flexibility from July 2024)",
            "what_changed": "You have 3 additional months of flexibility to exit without penalty",
            "who_may_be_affected": "Tenant — greater exit flexibility",
            "what_to_ask": "If these are negotiated versions, was the shorter lock-in offered in exchange for something?"
        },
        {
            "title": "Different Legal Agreement Type",
            "original": "Rental Agreement",
            "new": "Leave and License Agreement",
            "what_changed": "The legal nature of the agreement changed — Leave & License gives landlord easier legal recourse",
            "who_may_be_affected": "Tenant — different level of legal protection",
            "what_to_ask": "Do you understand the difference between a rental agreement and leave & license? A legal professional can explain the implications."
        }
    ],
    "added_clauses": [],
    "removed_clauses": ["Explicit landlord obligations list", "Immediate termination for illegal activities clause"],
    "modified_clauses": [
        {"title": "Late Payment Penalty", "original": "₹500/day from 10th of month", "modified": "₹200/day after 7-day grace period", "impact": "Document B is significantly more lenient — ₹200 vs ₹500/day, plus a 7-day grace period"}
    ]
}

DEMO_EMPLOYMENT_ANALYSIS = {
    "document_type": "Employment Agreement",
    "document_type_confidence": 0.99,
    "summary": "Full-time employment agreement between TechNova Solutions Pvt. Ltd. (Company) and Priya Nair (Employee) for the role of Senior Software Engineer in Bengaluru. Fixed annual CTC of ₹14,40,000, 3-month probation period, 3-month notice period after probation, broad IP assignment, 2-year confidentiality, and a 1-year post-employment non-compete clause.",
    "parties": [
        {"role": "Employer", "name": "TechNova Solutions Pvt. Ltd.", "description": "IT services and software engineering company located in Bengaluru"},
        {"role": "Employee", "name": "Priya Nair", "description": "Senior Software Engineer residing in Bengaluru"}
    ],
    "important_dates": [
        {"label": "Employment Commencement", "date": "1st April, 2024", "description": "Official start date of employment", "type": "start"},
        {"label": "Probation Period Expiry", "date": "30th June, 2024", "description": "3-month probation ends; transition to regular 3-month notice requirement", "type": "other"},
        {"label": "Confidentiality Term", "date": "2 Years Post-Separation", "description": "Confidentiality obligations continue for 24 months after resignation", "type": "other"},
        {"label": "Non-Compete Term", "date": "1 Year Post-Separation", "description": "12-month restriction on joining competitors in India", "type": "other"}
    ],
    "financial_terms": [
        {"label": "Base Gross CTC", "amount": "₹14,40,000/yr", "frequency": "Annual (₹1,20,000/mo)", "description": "Monthly gross salary before taxes and standard deductions", "type": "rent"},
        {"label": "Performance Bonus", "amount": "Discretionary", "frequency": "Annual", "description": "Subject to individual and company performance at company discretion", "type": "fee"},
        {"label": "Notice Period Buyout", "amount": "3 Months' Salary", "frequency": "On Separation", "description": "Payable in lieu of serving 3 months written notice", "type": "penalty"}
    ],
    "obligations": [
        {"obligation": "Work standard hours (9:30 AM - 6:30 PM, Mon-Fri) plus additional required hours", "party": "Employee", "deadline": "Ongoing", "frequency": "Daily", "status": "pending"},
        {"obligation": "Maintain strict confidentiality of trade secrets and client data for 2 years post-exit", "party": "Employee", "deadline": "2 Years Post-Exit", "frequency": "Continuous", "status": "pending"},
        {"obligation": "Assign all IP, code, and inventions created using company or personal resources to company", "party": "Employee", "deadline": "During Employment", "frequency": "Continuous", "status": "pending"},
        {"obligation": "Provide 3 months written notice or payment in lieu before departing", "party": "Employee", "deadline": "On Resignation", "frequency": "One-time", "status": "pending"},
        {"obligation": "Pay ₹14,40,000 annual CTC in monthly installments", "party": "Employer", "deadline": "Monthly", "frequency": "Monthly", "status": "pending"}
    ],
    "rights": [
        {"right": "Annual Leave Entitlement (15 days Earned, 10 days Casual/Sick)", "party": "Employee", "description": "Paid leave benefits as per company policy"},
        {"right": "Termination for Cause without Notice", "party": "Employer", "description": "Company can terminate immediately for breach or misconduct"},
        {"right": "Termination with 1 Week Notice during Probation", "party": "Both Parties", "description": "Either party can separate with 7 days notice during first 3 months"},
        {"right": "Exclusive Ownership of all Inventions and Code", "party": "Employer", "description": "Full intellectual property ownership transferred to company"}
    ],
    "risk_flags": [
        {
            "title": "Post-Employment Non-Compete Clause (1 Year)",
            "description": "Clause 12 prohibits joining any competitor in India for 1 year after leaving. Under Section 27 of the Indian Contract Act, 1872, post-employment non-compete agreements are generally unenforceable in Indian courts as restraint of trade, though confidentiality obligations remain strictly enforceable.",
            "severity": "risk",
            "clause_text": "For a period of ONE (1) YEAR after leaving the Company, the Employee shall not join any direct competitor of the Company or work on competing products in India.",
            "why_it_matters": "While standard in corporate agreements, Indian jurisprudence generally protects employee mobility. A lawyer can advise you on legal enforceability.",
            "affected_party": "Employee",
            "things_to_check": ["Is the scope of 'direct competitor' clearly defined?", "Consult an employment lawyer regarding Section 27 applicability in your domain."]
        },
        {
            "title": "Overly Broad Intellectual Property Assignment",
            "description": "Clause 10 claims ownership of all code and inventions created by the employee even outside working hours and using personal resources.",
            "severity": "review",
            "clause_text": "All intellectual property, inventions, software, code, or work product created by the Employee during employment, whether during working hours or otherwise, using Company resources or personal resources, shall be the exclusive property of the Company.",
            "why_it_matters": "This could affect personal side projects or open-source software you develop on your own personal laptop during weekends.",
            "affected_party": "Employee",
            "things_to_check": ["Request a carve-out or schedule of pre-existing personal projects", "Clarify whether weekend/side work on unrelated domains is excluded"]
        },
        {
            "title": "3-Month Long Notice Period",
            "description": "A 3-month notice period can delay transitions to future employers, though buyout in lieu of salary is permitted.",
            "severity": "attention",
            "clause_text": "After probation, either party may terminate employment with THREE (3) MONTHS written notice or payment of salary in lieu of notice.",
            "why_it_matters": "Some future employers may be hesitant to wait 90 days for onboarding.",
            "affected_party": "Employee",
            "things_to_check": ["Can notice period be negotiated to 2 months?", "Is notice buyout at employee option or company discretion?"]
        },
        {
            "title": "Uncompensated Overtime Provision",
            "description": "Clause 8 specifies that additional hours beyond standard 9:30 AM - 6:30 PM will not receive extra compensation.",
            "severity": "informational",
            "clause_text": "The Employee may be required to work additional hours without additional compensation.",
            "why_it_matters": "Common for exempt professional roles, but important to understand work-life expectations.",
            "affected_party": "Employee",
            "things_to_check": ["Clarify on-call support expectations and compensatory off policies"]
        }
    ],
    "unusual_clauses": [
        {
            "title": "Universal IP Assignment on Personal Devices",
            "clause_text": "All IP created whether during working hours or otherwise, using personal resources",
            "why_unusual": "Standard contracts typically limit IP assignment to inventions developed using company resources, during work hours, or directly related to the company's business."
        }
    ],
    "missing_information": [
        {"item": "Provident Fund (PF) & Gratuity Structure", "why_important": "The contract mentions gross CTC but does not break down basic pay, HRA, PF, or gratuity components."},
        {"item": "Medical & Health Insurance Policy", "why_important": "No details regarding health insurance coverage for employee and dependents."},
        {"item": "Remote / Hybrid Work Policy", "why_important": "Office location is specified but work-from-home or hybrid terms are not documented."}
    ],
    "questions_to_ask": [
        {"question": "Can personal side projects built on weekends without company resources be explicitly excluded from the IP assignment clause?", "context": "Clause 10 is unusually broad regarding personal creations", "priority": "high"},
        {"question": "How is the 1-year non-compete clause applied in practice, and can the list of competitors be defined in writing?", "context": "Post-employment non-compete under Section 27", "priority": "high"},
        {"question": "Can the notice period after probation be reduced to 60 days to match industry averages?", "context": "90-day notice period may impact future mobility", "priority": "medium"},
        {"question": "What is the detailed CTC breakup including basic pay, allowances, and statutory PF/gratuity deductions?", "context": "CTC breakup impacts take-home monthly pay", "priority": "high"}
    ],
    "action_checklist": [
        {"action": "Request detailed salary & tax Annexure", "description": "Review take-home monthly calculation against gross ₹1.2L/month", "priority": "high"},
        {"action": "Disclose pre-existing side projects in writing", "description": "Provide a list of existing GitHub repositories/projects to protect ownership", "priority": "high"},
        {"action": "Confirm probation confirmation process", "description": "Understand criteria and written review process for the 3-month probation", "priority": "medium"}
    ],
    "clauses": [
        {
            "title": "Probation Period",
            "original_text": "The Employee shall serve a probation period of THREE (3) MONTHS, during which either party may terminate employment with ONE (1) WEEK notice without cause.",
            "simple_explanation": "For the first 3 months, you or the company can end employment with just 1 week notice.",
            "very_simple_explanation": "For 3 months, either side can leave with 1 week notice.",
            "why_it_matters": "Provides flexibility during initial onboarding but less job security until confirmation.",
            "affected_party": "Both Parties",
            "things_to_check": ["Is confirmation automatic or requires written notice?"],
            "confidence": "high",
            "category": "termination"
        },
        {
            "title": "Intellectual Property & Inventions",
            "original_text": "All intellectual property, inventions, software, code, or work product created by the Employee during employment, whether during working hours or otherwise, using Company resources or personal resources, shall be the exclusive property of the Company.",
            "simple_explanation": "Any software or invention you create during your employment belongs entirely to the company, even if made in your free time on personal equipment.",
            "very_simple_explanation": "Everything you build while working here belongs to the company, even weekend projects.",
            "why_it_matters": "Very restrictive clause for software engineers with side projects or open-source hobbies.",
            "affected_party": "Employee",
            "things_to_check": ["Request an exemption for pre-existing or unrelated personal projects"],
            "confidence": "high",
            "category": "obligations"
        },
        {
            "title": "Post-Employment Non-Compete",
            "original_text": "For a period of ONE (1) YEAR after leaving the Company, the Employee shall not join any direct competitor of the Company or work on competing products in India.",
            "simple_explanation": "You cannot work for a competitor in India for 12 months after leaving. Note: Indian courts generally do not enforce post-job non-competes under Contract Act Sec 27.",
            "very_simple_explanation": "The contract says you cannot work for a competitor for 1 year after quitting.",
            "why_it_matters": "May cause friction when changing jobs; consult legal counsel on enforceability.",
            "affected_party": "Employee",
            "things_to_check": ["Ask for specific competitor company names"],
            "confidence": "high",
            "category": "obligations"
        }
    ],
    "timeline_events": [
        {"event": "Employment Start Date", "date": "1st April, 2024", "description": "Official joining date at Bengaluru office", "type": "start", "is_deadline": False},
        {"event": "End of Probation (3 Months)", "date": "30th June, 2024", "description": "Notice period switches from 1 week to 3 months", "type": "other", "is_deadline": True},
        {"event": "Annual Appraisal & Revision", "date": "March 2025", "description": "Annual salary revision and discretionary bonus review", "type": "payment", "is_deadline": False},
        {"event": "Post-Exit Non-Compete Expiry", "date": "12 Months Post-Separation", "description": "Non-compete period concludes", "type": "expiry", "is_deadline": True}
    ],
    "before_you_sign": {
        "five_things_to_understand": [
            "Your annual gross CTC is ₹14,40,000 (monthly ₹1,20,000 before taxes & statutory deductions)",
            "During the first 3 months (probation), either party can separate with 1 week notice",
            "After probation, the notice period increases to 3 months (90 days)",
            "The IP clause claims ownership of all code you create, even on weekends with personal laptops",
            "The contract contains a 1-year non-compete restriction for competitor companies in India"
        ],
        "important_commitments": [
            "Work 9:30 AM to 6:30 PM Monday to Friday plus additional required hours",
            "Keep company data and trade secrets confidential for 2 years after leaving",
            "Serve 3 months notice or pay salary buyout when resigning after probation"
        ],
        "dates_to_remember": [
            "1st April, 2024 — Joining date",
            "30th June, 2024 — End of 3-month probation period"
        ],
        "clauses_to_review": [
            "Clause 10: Intellectual Property (broad personal laptop scope)",
            "Clause 12: Non-Compete (1 year post-employment)",
            "Clause 13: Notice Period (3 months post-probation)"
        ],
        "questions_to_ask": [
            "Can I get a written exclusion for my pre-existing personal GitHub projects?",
            "What is the exact monthly take-home salary breakup after PF and tax?",
            "How does the annual discretionary bonus structure work?"
        ],
        "information_to_clarify": [
            "Health insurance coverage specifics for self and family",
            "Work-from-home / remote policy flexibility",
            "Relocation or joining bonus terms (if applicable)"
        ]
    },
    "legal_lens": {
        "money": [
            {"title": "Gross CTC", "detail": "₹14,40,000 per annum (₹1,20,000/month gross)", "clause_ref": "Clause 5"},
            {"title": "Performance Bonus", "detail": "Discretionary based on individual & company performance", "clause_ref": "Clause 6"},
            {"title": "Notice Buyout", "detail": "3 months gross salary payable in lieu of notice", "clause_ref": "Clause 13"}
        ],
        "deadlines": [
            {"title": "Probation End", "detail": "3-month probation period concludes", "date": "30th June, 2024"},
            {"title": "Probation Notice", "detail": "1 week written notice during probation", "date": "First 90 days"},
            {"title": "Post-Probation Notice", "detail": "3 months written notice required", "date": "After 1st July, 2024"},
            {"title": "Non-Compete Window", "detail": "12 months restriction following resignation", "date": "1 Year Post-Exit"}
        ],
        "risk": [
            {"title": "Restraint of Trade / Non-Compete", "detail": "1-year restriction on joining competitors (often non-enforceable under Sec 27)", "severity": "risk"},
            {"title": "Broad Side-Project IP Claim", "detail": "Company claims ownership of code created during non-work hours on personal devices", "severity": "review"},
            {"title": "90-Day Exit Notice", "detail": "Long notice period may complicate fast job switches", "severity": "attention"}
        ],
        "privacy": [
            {"title": "Confidentiality Term", "detail": "2-year strict confidentiality of company trade secrets and client data"}
        ],
        "rights": [
            {"title": "Paid Annual Leave", "detail": "15 days Earned Leave + 10 days Casual/Sick Leave + Public Holidays", "party": "Employee"},
            {"title": "Immediate Termination for Cause", "detail": "Company can terminate immediately for fraud or breach", "party": "Employer"}
        ],
        "obligations": [
            {"title": "Working Hours", "detail": "9:30 AM to 6:30 PM Mon-Fri plus additional uncompensated hours", "party": "Employee"},
            {"title": "Reporting", "detail": "Report to Engineering Manager and fulfill assigned software duties", "party": "Employee"}
        ]
    }
}

DEMO_NDA_ANALYSIS = {
    "document_type": "Non-Disclosure Agreement (Unilateral)",
    "document_type_confidence": 0.98,
    "summary": "Unilateral Non-Disclosure Agreement between InnovateTech Pvt. Ltd. (Disclosing Party) and Rahul Gupta (Receiving Party/Freelance Consultant) for evaluating potential collaboration on an AI product. Imposes a 3-year confidentiality term, standard exclusion categories, injunctive relief remedies, and exclusive jurisdiction in Mumbai courts.",
    "parties": [
        {"role": "Disclosing Party", "name": "InnovateTech Pvt. Ltd.", "description": "AI technology product company based in Mumbai"},
        {"role": "Receiving Party", "name": "Rahul Gupta", "description": "Independent freelance technical consultant"}
    ],
    "important_dates": [
        {"label": "Effective Date", "date": "1st June, 2024", "description": "NDA signing and confidentiality obligations begin", "type": "start"},
        {"label": "NDA Term Expiry", "date": "31st May, 2027", "description": "3-year confidentiality protection window concludes", "type": "end"}
    ],
    "financial_terms": [
        {"label": "Direct Financial Consideration", "amount": "₹0 (Evaluation Stage)", "frequency": "N/A", "description": "Agreement covers information disclosure prior to commercial contract", "type": "fee"},
        {"label": "Damages & Legal Remedies", "amount": "Uncapped (Injunctive + Actual)", "frequency": "On Breach", "description": "Company reserves right to seek injunctions and financial damages for unauthorized disclosures", "type": "penalty"}
    ],
    "obligations": [
        {"obligation": "Maintain strict confidentiality of all disclosed product, technology, and business plans", "party": "Rahul Gupta", "deadline": "3 Years", "frequency": "Continuous", "status": "pending"},
        {"obligation": "Use confidential information solely for evaluating the proposed collaboration", "party": "Rahul Gupta", "deadline": "Ongoing", "frequency": "Continuous", "status": "pending"},
        {"obligation": "Apply at minimum reasonable care in safeguarding company information", "party": "Rahul Gupta", "deadline": "3 Years", "frequency": "Continuous", "status": "pending"}
    ],
    "rights": [
        {"right": "Right to Disclose Publicly Known or Independently Developed Data", "party": "Rahul Gupta", "description": "Exclusions apply for public information or independently created tools"},
        {"right": "Right to Seek Injunctive Relief without Proving Special Damages", "party": "InnovateTech Pvt. Ltd.", "description": "Company can approach courts for restraining orders"}
    ],
    "risk_flags": [
        {
            "title": "Unilateral (One-Way) Protection",
            "description": "This NDA only protects InnovateTech's proprietary information. Any technical knowledge, algorithms, or proposals shared by Rahul Gupta are not protected under this document.",
            "severity": "review",
            "clause_text": "'Confidential Information' means all non-public information disclosed by the Company relating to its products, technology, business plans...",
            "why_it_matters": "If you share your own freelance consulting frameworks or code, consider asking for a Mutual (Two-Way) NDA.",
            "affected_party": "Rahul Gupta",
            "things_to_check": ["Request conversion to a Mutual Non-Disclosure Agreement (MNDA) if sharing your own IP"]
        },
        {
            "title": "3-Year Long Confidentiality Duration",
            "description": "A 3-year term is relatively long for fast-moving AI product evaluations (standard industry practice is often 1-2 years).",
            "severity": "attention",
            "clause_text": "This Agreement shall remain in effect for THREE (3) YEARS from the date of signing.",
            "why_it_matters": "You will need to maintain records of what was received to avoid contamination of future freelance work for 3 years.",
            "affected_party": "Rahul Gupta",
            "things_to_check": ["Consider negotiating duration to 18-24 months"]
        }
    ],
    "unusual_clauses": [],
    "missing_information": [
        {"item": "Return or Destruction Clause", "why_important": "Does not outline whether digital copies must be destroyed upon request at end of discussions."},
        {"item": "Residuals Clause", "why_important": "Does not specify whether ideas retained in unaided memory can be used in future general work."}
    ],
    "questions_to_ask": [
        {"question": "Can this agreement be made mutual so my proprietary consulting tools and proposals are equally protected?", "context": "Current agreement is strictly unilateral", "priority": "high"},
        {"question": "Can the confidentiality term be reduced from 3 years to 18 months for fast-evolving software tech?", "context": "Clause 3 duration", "priority": "medium"},
        {"question": "Can we add a clear Return or Destruction clause for confidential materials once evaluation concludes?", "context": "Protection against lingering liability", "priority": "medium"}
    ],
    "action_checklist": [
        {"action": "Request Mutual NDA modification", "description": "Ensure both parties have reciprocal confidentiality protections", "priority": "high"},
        {"action": "Keep written log of received files", "description": "Maintain a timestamped folder of all shared documentation", "priority": "medium"}
    ],
    "clauses": [
        {
            "title": "Scope of Confidential Information",
            "original_text": "'Confidential Information' means all non-public information disclosed by the Company relating to its products, technology, business plans, client data, and financial information.",
            "simple_explanation": "Covers all secret company information regarding their AI product, financials, and technical plans.",
            "very_simple_explanation": "Everything private the company shares with you is secret.",
            "why_it_matters": "Defines the boundary of what you cannot share with other clients.",
            "affected_party": "Rahul Gupta",
            "things_to_check": ["Ensure exclusions apply for prior knowledge"],
            "confidence": "high",
            "category": "confidentiality"
        }
    ],
    "timeline_events": [
        {"event": "NDA Execution", "date": "1st June, 2024", "description": "Confidentiality obligations take effect", "type": "start", "is_deadline": False},
        {"event": "Confidentiality Expiry", "date": "31st May, 2027", "description": "3-year confidentiality period ends", "type": "expiry", "is_deadline": True}
    ],
    "before_you_sign": {
        "five_things_to_understand": [
            "This is a one-way NDA: only the company's secrets are protected, not yours",
            "The confidentiality obligation lasts for 3 full years",
            "Standard exclusions apply for public information and independent development",
            "Breach allows the company to seek immediate court injunctions",
            "Governed by Indian law under exclusive jurisdiction of Mumbai courts"
        ],
        "important_commitments": [
            "Keep company materials private and do not share with third parties",
            "Use shared information solely for exploring the proposed partnership"
        ],
        "dates_to_remember": [
            "1st June, 2024 — Signing date",
            "31st May, 2027 — Expiry of 3-year term"
        ],
        "clauses_to_review": [
            "Clause 1: Scope of Confidentiality",
            "Clause 3: 3-Year Duration",
            "Clause 5: Injunctive Relief"
        ],
        "questions_to_ask": [
            "Can we make this a Mutual NDA?",
            "Can we add a document return/destruction protocol?"
        ],
        "information_to_clarify": [
            "Clarify how marked confidential documents will be identified"
        ]
    },
    "legal_lens": {
        "money": [
            {"title": "Consideration", "detail": "Evaluation phase — no direct payment terms in this NDA", "clause_ref": "Purpose"}
        ],
        "deadlines": [
            {"title": "Confidentiality Expiry", "detail": "Obligations expire 3 years from signing", "date": "31st May, 2027"}
        ],
        "risk": [
            {"title": "One-Way Risk", "detail": "Your proposals and consulting IP are unprotected", "severity": "review"},
            {"title": "Court Injunctions", "detail": "Company can seek immediate court orders for suspected leaks", "severity": "attention"}
        ],
        "privacy": [
            {"title": "Strict Secrecy", "detail": "Minimum reasonable care required to protect product blueprints"}
        ],
        "rights": [
            {"title": "Exclusions", "detail": "Right to use independently developed or public knowledge", "party": "Receiving Party"}
        ],
        "obligations": [
            {"title": "Evaluation Only", "detail": "Cannot use knowledge for competing products or personal commercial gain", "party": "Receiving Party"}
        ]
    }
}

DEMO_RENTAL_2_ANALYSIS = {
    "document_type": "Residential Leave and License Agreement",
    "document_type_confidence": 0.98,
    "summary": "12-month Leave & License agreement for Flat 304, Harmony Heights between Demo Properties Pvt. Ltd. (Licensor) and Aarav Sharma (Licensee). Monthly license fee of ₹25,000 with ₹2,000 maintenance included, 2-month refundable deposit of ₹50,000, 3-month lock-in, 7% annual escalation, 2-month notice period, and dispute resolution via Consumer Forum or courts.",
    "parties": [
        {"role": "Licensor (Owner)", "name": "Demo Properties Pvt. Ltd.", "description": "Property management owner in Mumbai"},
        {"role": "Licensee", "name": "Aarav Sharma", "description": "Individual licensee resident"}
    ],
    "important_dates": [
        {"label": "Commencement Date", "date": "1st April, 2024", "description": "License tenancy begins", "type": "start"},
        {"label": "Agreement Expiry", "date": "31st March, 2025", "description": "12-month term ends", "type": "end"},
        {"label": "Lock-in Expiry", "date": "30th June, 2024", "description": "3-month lock-in period ends", "type": "other"},
        {"label": "Deposit Refund Window", "date": "Within 15 days of vacating", "description": "Fast 15-day refund timeline", "type": "other"}
    ],
    "financial_terms": [
        {"label": "Monthly License Fee", "amount": "₹25,000", "frequency": "Monthly (Due 1st)", "description": "Payable on or before 1st of each calendar month", "type": "rent"},
        {"label": "Security Deposit", "amount": "₹50,000", "frequency": "One-time (Refundable in 15 days)", "description": "Refundable within 15 days of vacating", "type": "deposit"},
        {"label": "Maintenance", "amount": "₹2,000", "frequency": "Monthly (Included in fee)", "description": "Consolidated within agreement terms", "type": "fee"},
        {"label": "Late Payment Fee", "amount": "₹200/day", "frequency": "After 7-day grace", "description": "Charged only after 7 days grace period", "type": "penalty"},
        {"label": "Rent Escalation", "amount": "7%", "frequency": "Annual on renewal", "description": "Modest 7% increase upon renewal", "type": "other"}
    ],
    "obligations": [
        {"obligation": "Pay ₹25,000 license fee on or before 1st of each month", "party": "Licensee", "deadline": "1st of every month", "frequency": "Monthly", "status": "pending"},
        {"obligation": "Provide 2 months written notice to terminate after lock-in", "party": "Either Party", "deadline": "After Lock-in", "frequency": "One-time", "status": "pending"},
        {"obligation": "Refund ₹50,000 security deposit within 15 days of vacation", "party": "Licensor", "deadline": "15 Days Post-Vacation", "frequency": "One-time", "status": "pending"}
    ],
    "rights": [
        {"right": "Right to terminate with 2 months notice after 3 months lock-in", "party": "Both Parties", "description": "Equal exit flexibility"},
        {"right": "Right to approach Consumer Forum or Mumbai courts for disputes", "party": "Both Parties", "description": "Direct court access without mandatory arbitration"}
    ],
    "risk_flags": [
        {
            "title": "Leave and License Legal Status",
            "description": "A Leave & License agreement creates a permissive right rather than a leasehold tenancy right, allowing easier eviction remedies for the owner under Maharashtra Rent Control Act.",
            "severity": "attention",
            "clause_text": "This Leave and License Agreement is executed...",
            "why_it_matters": "Standard in Maharashtra for residential rentals, but offers different legal rights than a traditional lease.",
            "affected_party": "Licensee",
            "things_to_check": ["Confirm standard Maharashtra leave and license registration requirements"]
        }
    ],
    "unusual_clauses": [],
    "missing_information": [],
    "questions_to_ask": [
        {"question": "Will this Leave and License agreement be registered with the Maharashtra Sub-Registrar online?", "context": "Statutory registration requirement", "priority": "high"}
    ],
    "action_checklist": [
        {"action": "Verify biometric registration appointment", "description": "Ensure government e-registration is completed", "priority": "high"}
    ],
    "clauses": [
        {
            "title": "License Fee & Maintenance",
            "original_text": "LICENSE FEE: Rs. 25,000/- per month, payable by 1st of each month. MAINTENANCE: Rs. 2,000/- per month (included in this agreement)",
            "simple_explanation": "Monthly cost is ₹25,000 due by the 1st, and the ₹2,000 maintenance is already consolidated.",
            "very_simple_explanation": "Pay ₹25,000 by the 1st of every month. Maintenance is included.",
            "why_it_matters": "Clear, consolidated monthly financial commitment.",
            "affected_party": "Licensee",
            "things_to_check": ["Pay on time to keep good standing"],
            "confidence": "high",
            "category": "payment"
        }
    ],
    "timeline_events": [
        {"event": "License Starts", "date": "1st April, 2024", "description": "Keys handover and tenancy begins", "type": "start", "is_deadline": False},
        {"event": "Lock-in Period Ends", "date": "30th June, 2024", "description": "3-month lock-in concludes; exit notice permitted", "type": "other", "is_deadline": False},
        {"event": "Agreement Expiry", "date": "31st March, 2025", "description": "12-month tenure finishes", "type": "expiry", "is_deadline": True}
    ],
    "before_you_sign": {
        "five_things_to_understand": [
            "Monthly license fee is ₹25,000 (includes ₹2,000 maintenance)",
            "Security deposit is ₹50,000 refundable within 15 days",
            "Lock-in is 3 months; notice period is 2 months",
            "Late payment penalty is ₹200/day after a 7-day grace period",
            "Annual escalation on renewal is 7%"
        ],
        "important_commitments": [
            "Pay ₹25,000 by the 1st of every month",
            "Give 2 months notice when planning to vacate"
        ],
        "dates_to_remember": [
            "1st of each month — Rent due date",
            "30th June, 2024 — 3-month lock-in ends"
        ],
        "clauses_to_review": [
            "License Fee & Grace Period Terms",
            "15-Day Deposit Refund Clause"
        ],
        "questions_to_ask": [
            "Will the agreement be registered with the Maharashtra e-registration portal?"
        ],
        "information_to_clarify": [
            "Electricity and meter reading handover date"
        ]
    },
    "legal_lens": {
        "money": [
            {"title": "License Fee", "detail": "₹25,000/mo due on 1st (includes maintenance)", "clause_ref": "License Fee Clause"},
            {"title": "Deposit", "detail": "₹50,000 refundable within 15 days", "clause_ref": "Deposit Clause"}
        ],
        "deadlines": [
            {"title": "Lock-in Expiry", "detail": "3 months lock-in ends 30th June 2024", "date": "30th June, 2024"},
            {"title": "Deposit Return", "detail": "15 days from handover", "date": "Within 15 days"}
        ],
        "risk": [
            {"title": "Grace Period", "detail": "7 days grace period before ₹200/day late penalty", "severity": "informational"}
        ],
        "privacy": [
            {"title": "Permissive Occupancy", "detail": "Standard residential leave & license"}
        ],
        "rights": [
            {"title": "Equal Exit", "detail": "2 months notice for either party after 3-month lock-in", "party": "Both Parties"}
        ],
        "obligations": [
            {"title": "Monthly Fee", "detail": "Pay fee on or before 1st of month", "party": "Licensee"}
        ]
    }
}

DEMO_DOCUMENTS = [
    {
        "id": 1,
        "filename": "rental_agreement_harmony_heights.pdf",
        "original_filename": "Rental Agreement - Harmony Heights.pdf",
        "file_type": "pdf",
        "file_size": 45823,
        "page_count": 4,
        "word_count": 1247,
        "status": "analyzed",
        "is_demo": True,
        "text": DEMO_RENTAL_AGREEMENT_TEXT,
        "analysis": DEMO_ANALYSIS,
    },
    {
        "id": 2,
        "filename": "employment_contract_technova.pdf",
        "original_filename": "Employment Contract - TechNova Solutions.pdf",
        "file_type": "pdf",
        "file_size": 38920,
        "page_count": 3,
        "word_count": 890,
        "status": "analyzed",
        "is_demo": True,
        "text": DEMO_EMPLOYMENT_CONTRACT_TEXT,
        "analysis": DEMO_EMPLOYMENT_ANALYSIS,
    },
    {
        "id": 3,
        "filename": "nda_innovatetech.pdf",
        "original_filename": "NDA - InnovateTech Pvt Ltd.pdf",
        "file_type": "pdf",
        "file_size": 22450,
        "page_count": 2,
        "word_count": 456,
        "status": "analyzed",
        "is_demo": True,
        "text": DEMO_NDA_TEXT,
        "analysis": DEMO_NDA_ANALYSIS,
    },
    {
        "id": 4,
        "filename": "rental_agreement_v2_harmony_heights.pdf",
        "original_filename": "Leave & License Agreement - Harmony Heights (V2).pdf",
        "file_type": "pdf",
        "file_size": 31200,
        "page_count": 2,
        "word_count": 398,
        "status": "analyzed",
        "is_demo": True,
        "text": DEMO_RENTAL_AGREEMENT_2_TEXT,
        "analysis": DEMO_RENTAL_2_ANALYSIS,
    }
]
