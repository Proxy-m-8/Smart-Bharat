import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

// Port value must be exactly 3000
const PORT = 3000;

// Lazy initialization of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined. Using simulated AI responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Global In-Memory Database
const db = {
  complaints: [
    {
      id: "comp-1",
      ticketId: "SB-2026-9041",
      category: "Roads & Potholes",
      description: "Severe potholes on the main outer ring road near Sector 4 crossover. Damaging vehicles and causing traffic congestion during peak hours.",
      region: "North Delhi",
      city: "New Delhi",
      state: "Delhi",
      latitude: 28.7041,
      longitude: 77.1025,
      imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
      status: "Assigned",
      dateSubmitted: "2026-06-25T10:30:00Z",
      priority: "High",
      priorityScore: 82,
      department: "Public Works Department (PWD)",
      slaDays: 7,
      assignedOfficer: "Shri Rajesh Kumar, Executive Engineer",
      history: [
        { status: "Submitted", date: "2026-06-25T10:30:00Z", remarks: "Complaint registered via Smart Bharat web portal." },
        { status: "Assigned", date: "2026-06-26T09:15:00Z", remarks: "Auto-assigned to Delhi PWD North Division. Scheduled for repair under SLA." }
      ]
    },
    {
      id: "comp-2",
      ticketId: "SB-2026-1182",
      category: "Water Supply",
      description: "Contaminated water supply with a yellowish tint and foul smell in Pocket-A Resident Welfare Area.",
      region: "South Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      latitude: 18.9220,
      longitude: 72.8347,
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
      status: "Under Investigation",
      dateSubmitted: "2026-07-02T14:20:00Z",
      priority: "Critical",
      priorityScore: 94,
      department: "Municipal Corporation of Greater Mumbai (MCGM)",
      slaDays: 3,
      assignedOfficer: "Smt. Priya Patil, Ward Health Inspector",
      history: [
        { status: "Submitted", date: "2026-07-02T14:20:00Z", remarks: "Complaint submitted with water quality report attachment." },
        { status: "Under Investigation", date: "2026-07-03T11:00:00Z", remarks: "Water samples collected from main supply header for testing." }
      ]
    },
    {
      id: "comp-3",
      ticketId: "SB-2026-7734",
      category: "Electricity",
      description: "Frequent power cuts and voltage fluctuations occurring every evening between 7 PM and 10 PM. Damaging home appliances.",
      region: "East Bangalore",
      city: "Bengaluru",
      state: "Karnataka",
      latitude: 12.9716,
      longitude: 77.5946,
      status: "Submitted",
      dateSubmitted: "2026-07-05T18:45:00Z",
      priority: "Medium",
      priorityScore: 58,
      department: "Bangalore Electricity Supply Company (BESCOM)",
      slaDays: 5,
      history: [
        { status: "Submitted", date: "2026-07-05T18:45:00Z", remarks: "Grievance registered. System checked for duplicate grids." }
      ]
    },
    {
      id: "comp-4",
      ticketId: "SB-2026-3391",
      category: "Sanitation & Garbage",
      description: "Illegal commercial waste dumping near municipal park. Rotten organic matter causing stray animal hazard and severe stench.",
      region: "Salt Lake",
      city: "Kolkata",
      state: "West Bengal",
      latitude: 22.5726,
      longitude: 88.3639,
      status: "Resolved",
      dateSubmitted: "2026-06-20T08:00:00Z",
      priority: "Medium",
      priorityScore: 61,
      department: "Bidhannagar Municipal Corporation",
      slaDays: 5,
      assignedOfficer: "Shri Amitava Banerjee, Solid Waste Supervisor",
      history: [
        { status: "Submitted", date: "2026-06-20T08:00:00Z", remarks: "Complaint logged by local park committee." },
        { status: "Assigned", date: "2026-06-21T10:00:00Z", remarks: "Assigned to Ward 12 cleaning crew." },
        { status: "Resolved", date: "2026-06-23T16:30:00Z", remarks: "Waste completely cleared. Bio-enzyme deodorizer sprayed. Incident resolved." }
      ]
    }
  ],
  schemes: [
    {
      id: "sch-1",
      name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
      ministry: "Ministry of Health and Family Welfare",
      description: "The largest health assurance scheme in the world, providing cashless health coverage up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.",
      eligibilitySummary: "Identified poor, vulnerable families based on SECC 2011 database (deprivation criteria), rural households, specific urban occupational categories, and all active building/construction workers.",
      benefits: [
        "Cashless and paperless access to healthcare services at empaneled hospitals.",
        "Covers up to ₹5 Lakh per family per year.",
        "Includes 3 days of pre-hospitalization and 15 days of post-hospitalization expenses.",
        "No restriction on family size, age, or gender."
      ],
      checklist: [
        "Aadhaar Card or PAN Card",
        "Ration Card / PM-JAY Letter",
        "Income Certificate (for low income verification if required)",
        "Caste Certificate (if applicable for priority groups)",
        "Mobile Number linked to Aadhaar"
      ],
      steps: [
        "Search your name on the PM-JAY portal using your Mobile Number / Ration Card / Aadhaar.",
        "If eligible, visit any empaneled government or private hospital.",
        "Approach the Ayushman Mitra desk at the hospital for verification.",
        "Submit Aadhaar/Ration card for bio-metric authentication.",
        "Receive your Ayushman Card and avail cashless treatment."
      ],
      bilingualName: {
        hindi: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY)"
      }
    },
    {
      id: "sch-2",
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      description: "A central sector scheme providing income support of ₹6,000 per year in three equal installments of ₹2,000 directly into the bank accounts of all landholding farmer families across India.",
      eligibilitySummary: "All landholding farmer families with cultivable land in their names (subject to exclusion criteria like high-income taxpayers, institutional landholders, or government employees).",
      benefits: [
        "Direct income support of ₹6,000 per year.",
        "Transferred directly into bank accounts in three installments (April-July, August-November, December-March).",
        "Helps meet farm inputs and domestic needs during cropping cycles."
      ],
      checklist: [
        "Aadhaar Card",
        "Landholding Documentation (Khasra/Khatauni/Patta)",
        "Bank Account Passbook (Aadhaar-seeded)",
        "Active Mobile Number",
        "Self-declaration Certificate"
      ],
      steps: [
        "Visit the PM-Kisan portal (pmkisan.gov.in) and click on 'New Farmer Registration'.",
        "Enter Aadhaar and state details, and complete OTP verification.",
        "Fill out the land details (Survey number, Khata number, Area in hectares).",
        "Upload the land registration papers and bank details.",
        "Submit the application for verification by the State Nodal Officer."
      ],
      bilingualName: {
        hindi: "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)"
      }
    },
    {
      id: "sch-3",
      name: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
      ministry: "Ministry of Labour & Employment",
      description: "A voluntary and contributory pension scheme for unorganized workers (like street vendors, rickshaw pullers, domestic workers) to ensure old-age social security.",
      eligibilitySummary: "Unorganized workers aged 18-40 years, whose monthly income is ₹15,000 or less, and who are not covered under EPFO, ESIC, or NPS.",
      benefits: [
        "Assured minimum monthly pension of ₹3,000 after attaining the age of 60.",
        "50:50 contributory scheme matching equal pension premium from Central Govt.",
        "Family pension benefit (50% of pension to spouse upon beneficiary death)."
      ],
      checklist: [
        "Aadhaar Card",
        "Savings Bank Account Passbook (with IFSC code)",
        "Mobile Number",
        "Consent form for Auto-Debit of monthly contribution"
      ],
      steps: [
        "Visit nearest Common Services Centre (CSC) with Aadhaar and Bank Passbook.",
        "CSC operator will calculate initial contribution based on your age (ranges ₹55 to ₹200).",
        "Complete biometric/OTP authentication on the Shram Yogi portal.",
        "Authorize auto-debit facility for monthly premiums from your bank account.",
        "Instantly receive your Shram Yogi Pension Card (SPAN card)."
      ],
      bilingualName: {
        hindi: "प्रधानमंत्री श्रम योगी मान-धन योजना (PM-SYM)"
      }
    }
  ]
};

// HELPER: AI Search Grounding and Scheme Recommendation context
const schemesContextStr = JSON.stringify(db.schemes, null, 2);

// --- API ROUTES ---

// 1. Conversational AI Civic Assistant (Chat)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language, profile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing messages array" });
    }

    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const activeLang = language || "English";
    
    // Construct active profile context if available
    const profileStr = profile ? `
      Active User Profile Context:
      - Age: ${profile.age}
      - Income: ₹${profile.income} per annum
      - Gender: ${profile.gender}
      - State: ${profile.state}
      - Social Category: ${profile.category}
      - Occupation: ${profile.occupation}
      - Specially Abled (Disability): ${profile.disability ? "Yes" : "No"}
    ` : "No active user profile provided yet.";

    const systemInstruction = `
      You are "Smart Bharat Companion", an advanced, official AI-powered Civic Assistant for Indian citizens.
      Your primary role is to guide citizens in accessing central and state government schemes, understanding official documents, procedures, and helping them resolve civic grievances.

      CONSTRAINTS & RULES:
      1. Speak in a helpful, respectful, and authoritative yet empathetic civic tone.
      2. Ground your factual claims strictly in official Indian government facts. Cite relevant ministry departments or official schemes.
      3. Prevent hallucinations. If you don't know the answer about a specific scheme, state that it's recommended to consult the official department website (e.g., pmkisan.gov.in, pmjay.gov.in) or submit an inquiry to the ministry.
      4. Support multi-turn chat. Retain session context.
      5. The user is communicating in ${activeLang}. You should reply primarily in ${activeLang} (or transliterated Hinglish/regional text if requested).
      6. You must classify the user's intent in every response. Also, suggest an action if relevant (e.g. suggesting the user click a button to "Report Complaint" or "Apply for Scheme" if they describe an issue or ask how to register).
      
      Grounded Government Schemes Data Available in Smart Bharat's Vector/RAG Database:
      ${schemesContextStr}

      User Profile Context:
      ${profileStr}

      Respond strictly in JSON format matching the following schema:
      {
        "reply": "Your markdown-formatted, helpful response to the citizen. Cite specific schemes, checklists, or steps. Be clear, using bullet points for checklists.",
        "intent": "informational" | "complaint" | "service_request" | "general",
        "language": "Detected language",
        "suggestedAction": {
          "type": "apply_scheme" | "report_complaint" | "verify_doc" | null,
          "label": "Button Label (e.g. 'File a Water Supply Complaint')",
          "payload": { ... } // properties like schemeId, complaintCategory, etc.
        }
      }
    `;

    // Format previous conversation messages for Gemini
    const formattedContents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Check if we can call the actual Gemini API
    const isMock = process.env.GEMINI_API_KEY === undefined;

    if (isMock) {
      // Localization dictionary for mock simulation
      const MOCK_RESPONSES: Record<string, { welcome: string; pmjay: string; pmkisan: string; complaint: string; default: string }> = {
        English: {
          welcome: "Namaste! Welcome to **Smart Bharat Civic Companion**. I can help you understand government schemes, check eligibility, suggest document checklists, and register civic complaints. How can I assist you today?",
          pmjay: `Based on your query, **Ayushman Bharat (PM-JAY)** is highly relevant. It offers:
* Cashless health assurance up to **₹5,00,000 per family per year**.
* Cover for secondary and tertiary hospitalization.
* Covers all pre-existing conditions from Day 1.

**Required Checklist:**
1. Aadhaar Card
2. Ration Card
3. Mobile Number linked to Aadhaar

Would you like to auto-verify your documents to check your exact eligibility?`,
          pmkisan: `For farmers, the **Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)** provides:
* **₹6,000 per year** in three installments of ₹2,000.
* Direct Bank Transfer (DBT) to prevent leakages.

**Eligibility**: All small & marginal landholding farmer families with cultivable land.

**Documents Required:**
* Aadhaar Card
* Land cultivation papers (Khasra/Khatauni)
* Seeded Bank Account Passbook

Click below to begin the guided scheme registration or checklist builder!`,
          complaint: `I detect that you are facing a public infrastructure issue. Under the **Digital India Civic Redressal guidelines**, you can report public grievances directly to the Municipal authorities with automatic severity scoring and geo-tagging.

Would you like to file a formal grievance on the Smart Bharat portal? It will auto-route to the matching department (e.g. PWD, BESCOM, MCGM) with SLA tracking.`,
          default: "I am here to guide you with Indian Government schemes and services. Please provide your profile details or ask about schemes like Ayushman Bharat or PM-Kisan."
        },
        Hindi: {
          welcome: "नमस्ते! **स्मार्ट भारत नागरिक साथी** में आपका स्वागत है। मैं आपको सरकारी योजनाओं को समझने, पात्रता जांचने, आवश्यक दस्तावेजों की सूची बनाने और नागरिक शिकायतें दर्ज करने में मदद कर सकता हूं। आज मैं आपकी क्या सहायता कर सकता हूं?",
          pmjay: `आपके प्रश्न के अनुसार, **आयुष्मान भारत (PM-JAY)** आपके लिए अत्यधिक प्रासंगिक है। इसके मुख्य लाभ:
* प्रति परिवार प्रति वर्ष **₹5,00,000 तक का कैशलेस स्वास्थ्य बीमा**।
* माध्यमिक और तृतीयक श्रेणी के इलाज के लिए अस्पताल में भर्ती होने का खर्च।
* पहले दिन से ही सभी पुरानी बीमारियों का खर्च कवर।

**आवश्यक चेकलिस्ट:**
1. आधार कार्ड
2. राशन कार्ड / पीएम-जेएवाई पत्र
3. आधार से लिंक मोबाइल नंबर

क्या आप अपनी सटीक पात्रता जांचने के लिए अपने दस्तावेजों को ऑटो-सत्यापित (OCR) करना चाहते हैं?`,
          pmkisan: `किसानों के लिए, **प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)** निम्नलिखित प्रदान करता है:
* **₹6,000 प्रति वर्ष** की वित्तीय सहायता, जो ₹2,000 की तीन किस्तों में दी जाती है।
* बिचौलियों से सुरक्षा के लिए सीधे बैंक खाते में ट्रांसफर (DBT)।

**पात्रता**: कृषि योग्य भूमि वाले सभी छोटे और सीमांत किसान परिवार।

**आवश्यक दस्तावेज़:**
* आधार कार्ड
* भूमि दस्तावेज़ (खसरा/खतौनी)
* आधार से जुड़ा बैंक खाता पासबुक

नीचे दिए गए बटन पर क्लिक करके योजना पंजीकरण या चेकलिस्ट मार्गदर्शिका शुरू करें!`,
          complaint: `मुझे पता चला है कि आप सार्वजनिक बुनियादी ढांचे की समस्या का सामना कर रहे हैं। **डिजिटल इंडिया नागरिक निवारण दिशानिर्देशों** के तहत, आप स्वचालित गंभीरता स्कोरिंग और जीपीएस जियो-टैग के साथ सीधे नगर निगम अधिकारियों को शिकायत दर्ज कर सकते हैं।

क्या आप स्मार्ट भारत पोर्टल पर एक औपचारिक शिकायत दर्ज करना चाहते हैं? यह सीधे संबंधित विभाग (जैसे PWD, BESCOM, MCGM) को समाधान समय-सीमा (SLA) ट्रैकिंग के साथ भेज दिया जाएगा।`,
          default: "मैं यहां भारत सरकार की विभिन्न योजनाओं और नागरिक सेवाओं में आपका मार्गदर्शन करने के लिए उपस्थित हूं। कृपया अपनी प्रोफ़ाइल विवरण दर्ज करें या आयुष्मान भारत, पीएम-किसान, या किसी नागरिक शिकायत के बारे में पूछें।"
        },
        Odia: {
          welcome: "ନମସ୍କାର! **ସ୍ମାର୍ଟ ଭାରତ ନାଗରିକ ସାଥୀ** କୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ମୁଁ ଆପଣଙ୍କୁ ସରକାରୀ ଯୋଜନା ବୁଝିବାରେ, ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରିବାରେ, କାଗଜପତ୍ରର ତାଲିକା ପ୍ରସ୍ତୁତ କରିବାରେ ଏବଂ ଅଭିଯୋଗ ଦର୍ଜ କରିବାରେ ସାହାଯ୍ୟ କରିପାରିବି। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିବି?",
          pmjay: `ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଅନୁଯାୟୀ, **ଆୟୁଷ୍ମାନ ଭାରତ (PM-JAY)** ଆପଣଙ୍କ ପାଇଁ ଅତ୍ୟନ୍ତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ଏହାର ମୁଖ୍ୟ ସୁବିଧାଗୁଡ଼ିକ:
* ପ୍ରତି ପରିବାରକୁ ବାର୍ଷିକ **₹୫,୦୦,୦୦୦ ପର୍ଯ୍ୟନ୍ତ ମାଗଣା ଚିକିତ୍ସा ସୁବିଧା (Cashless Health Cover)**।
* ଦ୍ୱିତୀୟକ ଏବଂ ତୃତୀୟକ ପର୍ଯ୍ୟାୟରେ ମେଡିକାଲରେ ଭର୍ତ୍ତି ହେବା ଖର୍ଚ୍ଚ।
* ପ୍ରଥମ ଦିନରୁ ହିଁ ସମସ୍ତ ପୁରୁଣା ରୋଗର ଖର୍ଚ୍ଚ କଭର।

**ଆବଶ୍ୟକ କାଗଜପତ୍ର:**
୧. ଆଧାର କାର୍ଡ
୨. ରାସନ କାର୍ଡ
୩. ଆଧାର ସହ ସଂଯୁକ୍ତ ମୋବାଇଲ ନମ୍ବର

ଆପଣଙ୍କ ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରିବା ପାଇଁ ଆପଣ ନିଜ କାଗଜପତ୍ରର ସତ୍ୟାପନ (OCR) କରିବାକୁ ଚାହାଁନ୍ତି କି?`,
          pmkisan: `ଚାଷୀମାନଙ୍କ ପାଇଁ, **ପ୍ରଧାନମନ୍ତ୍ରୀ କିଷାନ ସମ୍ମାନ ନିଧି (PM-KISAN)** ନିମ୍ନଲିଖିତ ସୁବିଧା ପ୍ରଦାନ କରେ:
* **ବାର୍ଷିକ ₹୬,୦୦୦** ଆର୍ଥିକ ସହାୟତା, ଯାହା ₹୨,୦0୦ ର ତିନୋଟି କିସ୍ତିରେ ସିଧା ବ୍ୟାଙ୍କ ଖାତାକୁ ପ୍ରଦାନ କରାଯାଏ।
* ସିଧାସଳଖ ବ୍ୟାଙ୍କ ଖାତାକୁ ଟ୍ରାନ୍ସଫର (DBT), ଯାହା ଦ୍ୱାରା ଦଲାଲମାନଙ୍କଠାରୁ ସୁରକ୍ଷା ମିଳେ।

**ଯୋଗ୍ୟତା**: କୃଷିଯୋଗ୍ୟ ଜମି ଥିବା ସମସ୍ତ କ୍ଷୁଦ୍ର ଏବଂ ନାମମାତ୍ର ଚାଷୀ ପରିବାର।

**ଆବଶ୍ୟକ କାଗଜପତ୍ର:**
* ଆଧାର କାର୍ଡ
* ଜମି ପଟ୍ଟା / ରେକର୍ଡ (Khasra/Khatauni)
* ଆଧାର ସଂଯୁକ୍ତ ବ୍ୟାଙ୍କ ଖାତା ପାସବୁକ୍

ତଳେ ଦିଆଯାଇଥିବା ବଟନ୍ କ୍ଲିକ୍ କରି ଯୋଜନା ପଞ୍ଜୀକରଣ କିମ୍ବା ଚେକଲିଷ୍ଟ ଗାଇଡ୍ ଆରମ୍ଭ କରନ୍ତୁ!`,
          complaint: `ମୁଁ ଜାଣିବାକୁ ପାଇଲି ଯେ ଆପଣ ଏକ ସାର୍ବଜନୀନ ସମସ୍ୟାର ସମ୍ମୁଖୀନ ହେଉଛନ୍ତି। **ଡିଜିଟାଲ୍ ଇଣ୍ଡିଆ ନାଗରିକ ଅଭିଯୋଗ ନିବାରଣ ନିୟମାବଳୀ** ଅଧୀନରେ, ଆପଣ ଜିଓ-ଟ୍ୟାଗିଂ (GPS) ସହ ସିଧାସଳଖ ପୌରପାଳିକା ଅଧିକାରୀଙ୍କ ନିକଟରେ ଅଭିଯୋଗ ଦର୍ଜ କରିପାରିବେ।

ଆପଣ ସ୍ମାର୍ଟ ଭାରତ ପୋର୍ଟାଲରେ ଏକ ଅଭିଯୋଗ ଦର୍ଜ କରିବାକୁ ଚାହାଁନ୍ତି କି? ଏହା ସିଧାସଳଖ ସମ୍ପୃକ୍ତ ବିଭାଗ (ଯେପରି PWD, BESCOM, MCGM) କୁ ସମାଧାନ ସମୟ-ସୀମା (SLA) ଟ୍ରାକିଂ ସହ ପଠାଇ ଦିଆଯିବ।`,
          default: "ମୁଁ ଆପଣଙ୍କୁ ବିଭିନ୍ନ ସରକାରୀ ଯୋଜନା ଏବଂ ସେବା ବିଷୟରେ ମାର୍ଗଦର୍ଶନ କରିବାକୁ ଏଠାରे ଉପସ୍ଥିତ ଅଛି। ଦୟାକରି ଆପଣଙ୍କ ବିବରଣୀ ପ୍ରଦାନ କରନ୍ତୁ କିମ୍ବା ଆୟୁଷ୍ମାନ ଭାରତ, PM-KISAN କିମ୍ବା କୌଣସି ସମସ୍ୟା ବିଷୟରେ ପଚାରନ୍ତୁ।"
        }
      };

      // Get appropriate dictionary based on selected language
      const langKey = MOCK_RESPONSES[activeLang] ? activeLang : "English";
      const dict = MOCK_RESPONSES[langKey];

      const lowerMsg = lastUserMsg.toLowerCase();
      let responseJson = {
        reply: dict.default,
        intent: "general",
        language: activeLang,
        suggestedAction: null as any
      };

      if (lowerMsg.includes("ayushman") || lowerMsg.includes("health") || lowerMsg.includes("medical")) {
        responseJson = {
          reply: dict.pmjay,
          intent: "informational",
          language: activeLang,
          suggestedAction: {
            type: "verify_doc",
            label: activeLang === "Hindi" ? "पीएम-जय के लिए दस्तावेज जांचें" : activeLang === "Odia" ? "PM-JAY ପାଇଁ କାଗଜପତ୍ର ଯାଞ୍ଚ" : "Verify Documents for PM-JAY",
            payload: { schemeId: "sch-1" }
          }
        };
      } else if (lowerMsg.includes("kisan") || lowerMsg.includes("farmer") || lowerMsg.includes("farming") || lowerMsg.includes("kheti")) {
        responseJson = {
          reply: dict.pmkisan,
          intent: "service_request",
          language: activeLang,
          suggestedAction: {
            type: "apply_scheme",
            label: activeLang === "Hindi" ? "पीएम-किसान के लिए पंजीकरण करें" : activeLang === "Odia" ? "PM-KISAN ପାଇଁ ପଞ୍ଜୀକରଣ କରନ୍ତୁ" : "Register for PM-KISAN",
            payload: { schemeId: "sch-2" }
          }
        };
      } else if (lowerMsg.includes("pothole") || lowerMsg.includes("garbage") || lowerMsg.includes("water") || lowerMsg.includes("electricity") || lowerMsg.includes("complaint") || lowerMsg.includes("road")) {
        responseJson = {
          reply: dict.complaint,
          intent: "complaint",
          language: activeLang,
          suggestedAction: {
            type: "report_complaint",
            label: activeLang === "Hindi" ? "नागरिक शिकायत दर्ज करें" : activeLang === "Odia" ? "ଅଭିଯୋଗ ଦର୍ଜ କରନ୍ତୁ" : "Report a Civic Grievance",
            payload: { category: lowerMsg.includes("water") ? "Water Supply" : lowerMsg.includes("electricity") ? "Electricity" : "Roads & Potholes" }
          }
        };
      }

      return res.json(responseJson);
    } else {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    }
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Failed to process civic assistant response", details: error.message });
  }
});

// 2. Government Scheme Personalized Recommendation Engine
app.post("/api/schemes/recommend", async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Missing profile context" });
    }

    const isMock = process.env.GEMINI_API_KEY === undefined;

    const systemInstruction = `
      You are "Smart Bharat Scheme Engine". Your objective is to match a citizen's profile with the best central and state government schemes available.
      You have access to our grounded schemes database:
      ${schemesContextStr}

      Evaluate eligibility thoroughly. Cite specific matching factors (e.g. "Since your income is below 1.5 Lakhs", "As a farmer in ${profile.state}", "Due to your age of ${profile.age}").
      Recommend matching schemes from the database, and feel free to suggest other real major Indian schemes (like PM Awas Yojana, PM Shram Yogi Maan-dhan, National Social Assistance Pension, etc.) if they match the profile!

      Respond strictly in JSON matching the schema:
      {
        "recommendations": [
          {
            "id": "Matching ID or generated unique ID",
            "name": "Scheme Name",
            "ministry": "Ministry Name",
            "matchReason": "Detailed personal match reason based on user profile factors",
            "benefits": ["Benefit 1", "Benefit 2"],
            "checklist": ["Document 1", "Document 2"],
            "matchScore": 85 // out of 100
          }
        ],
        "summary": "A concise, motivating summary of matching schemes and overall support available to the user based on their profile."
      }
    `;

    if (isMock) {
      // Build clever personalized mock matches
      const matches = [];
      const userState = profile.state || "Delhi";

      // PM-JAY Match
      if (profile.income <= 250000 || profile.occupation === 'Farmer' || profile.occupation === 'Unemployed') {
        matches.push({
          id: "sch-1",
          name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
          ministry: "Ministry of Health and Family Welfare",
          matchReason: `As a resident of ${userState} with an annual household income of ₹${profile.income}, and occupation classified as '${profile.occupation}', you meet the primary low-income deprivation criteria for cashless health assurance.`,
          benefits: [
            "Cashless treatment cover of up to ₹5,000,000 per year per family.",
            "Free secondary and tertiary care hospitalization in all empaneled hospitals."
          ],
          checklist: ["Aadhaar Card", "Ration Card / SECC Letter", "Mobile number linked to Aadhaar"],
          matchScore: 95
        });
      }

      // PM-KISAN Match
      if (profile.occupation === 'Farmer') {
        matches.push({
          id: "sch-2",
          name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          matchReason: `Matched because your occupation is explicitly declared as a 'Farmer'. You qualify for direct income transfers to support cultivation requirements in ${userState}.`,
          benefits: [
            "₹6,000 annual cash assistance in 3 direct bank installments.",
            "Aadhaar-seeded safe direct benefits transfer (DBT)."
          ],
          checklist: ["Aadhaar Card", "Land registration paper (Khasra/Khatauni)", "Bank Account Passbook"],
          matchScore: 98
        });
      }

      // PM-SYM Match
      if ((profile.occupation === 'Self-Employed' || profile.occupation === 'Unemployed') && profile.age >= 18 && profile.age <= 40 && profile.income <= 180000) {
        matches.push({
          id: "sch-3",
          name: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
          ministry: "Ministry of Labour & Employment",
          matchReason: `At ${profile.age} years old with income under the ₹1.8L cap, you are highly eligible for this voluntary pension to safeguard old age security.`,
          benefits: [
            "Guaranteed minimum monthly pension of ₹3,000 post age 60.",
            "Matching equal contribution by the Central Government of India."
          ],
          checklist: ["Aadhaar Card", "IFSC Bank Account Details", "Auto-Debit Authorization Consent"],
          matchScore: 90
        });
      }

      // PM Awas Yojana
      if (profile.income <= 300000) {
        matches.push({
          id: "sch-4",
          name: "Pradhan Mantri Awas Yojana (PMAY) - Housing for All",
          ministry: "Ministry of Housing and Urban Affairs",
          matchReason: `Matched under the Economically Weaker Section (EWS) bracket. You qualify for direct financial credit-linked interest subsidies for constructing or purchasing a pucca house.`,
          benefits: [
            "Interest subsidy up to 6.5% on housing loans.",
            "Direct subsidy of ₹1.5 Lakhs for house construction."
          ],
          checklist: ["Aadhaar Card", "Income Certificate / Affidavit", "Certificate of Non-owning of pucca house"],
          matchScore: 88
        });
      }

      const summary = `Based on your profile (Age: ${profile.age}, Income: ₹${profile.income}/yr, Occupation: ${profile.occupation} in ${userState}), we have identified ${matches.length} highly matched government schemes. You qualify for major social security, health, and income support frameworks under central Digital India structures.`;

      return res.json({ recommendations: matches, summary });
    } else {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Citizen Profile: ${JSON.stringify(profile)}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });
      return res.json(JSON.parse(response.text || "{}"));
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to recommend schemes", details: error.message });
  }
});

// 3. Document Assistance OCR Verification
app.post("/api/ocr/verify", async (req, res) => {
  try {
    const { documentText, documentName, schemeId, citizenName } = req.body;
    if (!documentText) {
      return res.status(400).json({ error: "No document text content provided" });
    }

    const isMock = process.env.GEMINI_API_KEY === undefined;

    const systemInstruction = `
      You are "Smart Bharat Document OCR Auditor".
      Analyze the text extracted from an uploaded document (e.g. Aadhaar Card, Income Certificate, Land papers).
      Verify if it meets standard administrative guidelines for government applications (completeness, name matching, format validation).

      Input context:
      - Uploaded Document Name: ${documentName || "Unknown"}
      - Target Scheme: ${schemeId || "General"}
      - Expected Citizen Name: ${citizenName || "Unknown"}

      Evaluate:
      1. If the citizen's expected name is mentioned or resembles the name in the document (handle minor spelling variations).
      2. If any unique identifiers (Aadhaar UID, PAN, Certificate Numbers) are present.
      3. Overall authenticity rating (0-100%).
      4. Extracted structured fields.
      5. Explicit feedback check-items.

      Respond strictly in JSON matching the schema:
      {
        "verified": boolean,
        "score": number, // 0-100 authenticity / eligibility index
        "extractedData": {
          "name": "Name extracted from document",
          "idNumber": "Unique ID found (e.g. XXXX-XXXX-1234)",
          "dob": "Date of birth found",
          "income": "Income amount found if any",
          "state": "State/address found if any"
        },
        "checks": {
          "nameMatches": boolean,
          "formatValid": boolean,
          "hasStampSignature": boolean,
          "dataCompleteness": boolean
        },
        "feedback": ["Feedback string 1", "Feedback string 2"]
      }
    `;

    if (isMock) {
      const text = documentText.toLowerCase();
      const name = citizenName || "Akansha";
      const nameMatches = text.includes(name.toLowerCase()) || text.includes("akansha") || text.includes("kumar");
      const hasId = text.includes("aadhaar") || text.includes("uid") || text.includes("pan") || text.includes("certificate") || text.match(/\d{4}/) !== null;
      
      const verified = nameMatches && hasId;
      const score = verified ? 92 : (nameMatches || hasId ? 60 : 35);

      const feedback = [];
      if (nameMatches) {
        feedback.push("Name matches expected profile registration perfectly.");
      } else {
        feedback.push(`Name discrepancy: Document does not explicitly mention '${name}'. Ensure the document matches your registered name.`);
      }
      if (hasId) {
        feedback.push("Valid document identifier/serial number successfully extracted.");
      } else {
        feedback.push("Failed to locate a clear Aadhaar/Certificate registration code.");
      }
      if (text.includes("income") && text.includes("certificate")) {
        feedback.push("Official Income stamp and Tehsildar signature block identified.");
      }

      return res.json({
        verified,
        score,
        extractedData: {
          name: nameMatches ? name : "Unknown Citizen",
          idNumber: text.includes("aadhaar") ? "XXXX-XXXX-8821" : "CERT-2026-098",
          dob: "18/10/2005",
          income: text.includes("income") ? "₹1,20,000" : undefined,
          state: "Odisha"
        },
        checks: {
          nameMatches,
          formatValid: hasId,
          hasStampSignature: text.includes("signature") || text.includes("seal") || text.includes("tehsildar") || verified,
          dataCompleteness: verified
        },
        feedback
      });
    } else {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Document Raw Content:\n${documentText}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });
      return res.json(JSON.parse(response.text || "{}"));
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to verify document OCR", details: error.message });
  }
});

// 4. Submit Complaint / Public Grievance
app.post("/api/complaints", async (req, res) => {
  try {
    const { category, description, region, city, state, latitude, longitude, imageUrl } = req.body;
    if (!description || !city || !state) {
      return res.status(400).json({ error: "Description, city, and state are required." });
    }

    const ticketId = `SB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateSubmitted = new Date().toISOString();

    // Check for duplicates using basic semantic / keyword matches against active complaints
    let duplicateOf: string | undefined = undefined;
    const descWords = description.toLowerCase().split(/\s+/);
    for (const c of db.complaints) {
      const matchWords = c.description.toLowerCase().split(/\s+/);
      const common = descWords.filter(w => w.length > 4 && matchWords.includes(w));
      if (common.length >= 4 && c.city.toLowerCase() === city.toLowerCase()) {
        duplicateOf = c.ticketId;
        break;
      }
    }

    const isMock = process.env.GEMINI_API_KEY === undefined;

    // Default calculated values
    let autoCategory = category || "General Civic Issue";
    let assignedDept = "Municipal Grievance Directorate";
    let priority: 'Low' | 'Medium' | 'High' | 'Critical' = "Medium";
    let priorityScore = 55;
    let slaDays = 7;

    const systemInstruction = `
      You are "Smart Bharat Grievance Dispatcher".
      Analyse the citizen complaint details and output structured metadata.
      - Auto-classify category if needed (from: Roads & Potholes, Water Supply, Electricity, Sanitation & Garbage, Corruption, Other).
      - Match with exact government department (e.g. PWD, BESCOM, MCGM, Central Vigilance Commission).
      - Calculate an priorityScore (1-100) based on hazard severity and public impact.
      - Map score to a rating: Low (<40), Medium (40-70), High (70-85), Critical (>85).
      - Set SLA repair days (e.g. electricity issue: 2 days, pothole: 7 days, garbage: 3 days).

      Complaint details:
      Description: ${description}
      Reported City/State: ${city}, ${state}

      Respond strictly in JSON matching schema:
      {
        "category": "Roads & Potholes" | "Water Supply" | "Electricity" | "Sanitation & Garbage" | "Corruption" | "Other",
        "department": "Name of Municipal/State Department",
        "priority": "Low" | "Medium" | "High" | "Critical",
        "priorityScore": number, // 1 to 100
        "slaDays": number,
        "assignedOfficer": "Name of administrative executive engineer/inspector"
      }
    `;

    if (isMock) {
      const descLower = description.toLowerCase();
      if (descLower.includes("pothole") || descLower.includes("road") || descLower.includes("bridge")) {
        autoCategory = "Roads & Potholes";
        assignedDept = "Public Works Department (PWD)";
        priority = "High";
        priorityScore = 78;
        slaDays = 7;
      } else if (descLower.includes("water") || descLower.includes("pipe") || descLower.includes("leakage") || descLower.includes("sewage")) {
        autoCategory = "Water Supply";
        assignedDept = "Municipal Water Supply Board";
        priority = "Critical";
        priorityScore = 88;
        slaDays = 3;
      } else if (descLower.includes("garbage") || descLower.includes("trash") || descLower.includes("waste") || descLower.includes("sanitation")) {
        autoCategory = "Sanitation & Garbage";
        assignedDept = "Municipal Solid Waste Department";
        priority = "Medium";
        priorityScore = 65;
        slaDays = 5;
      } else if (descLower.includes("power") || descLower.includes("electricity") || descLower.includes("voltage") || descLower.includes("transformer")) {
        autoCategory = "Electricity";
        assignedDept = "State Electricity Distribution Corporation (DISCOM)";
        priority = "High";
        priorityScore = 81;
        slaDays = 2;
      }

      const newComplaint = {
        id: `comp-${db.complaints.length + 1}`,
        ticketId,
        category: autoCategory,
        description,
        region: region || "Central Zone",
        city,
        state,
        latitude: parseFloat(latitude) || 20.2961,
        longitude: parseFloat(longitude) || 85.8245,
        imageUrl: imageUrl || undefined,
        status: duplicateOf ? "Assigned" : "Submitted",
        dateSubmitted,
        priority,
        priorityScore,
        department: assignedDept,
        slaDays,
        assignedOfficer: duplicateOf ? "Auto-merged with master ticket" : "Shri A.K. Panda, Ward Supervisor",
        history: [
          { status: "Submitted", date: dateSubmitted, remarks: duplicateOf ? `Duplicate match detected with ${duplicateOf}. Merged automatically.` : "Grievance submitted." }
        ],
        duplicateOf
      };

      db.complaints.unshift(newComplaint as any);
      return res.json(newComplaint);
    } else {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Grievance: ${description}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });
      const aiResult = JSON.parse(response.text || "{}");

      const newComplaint = {
        id: `comp-${db.complaints.length + 1}`,
        ticketId,
        category: aiResult.category || autoCategory,
        description,
        region: region || "Central Zone",
        city,
        state,
        latitude: parseFloat(latitude) || 20.2961,
        longitude: parseFloat(longitude) || 85.8245,
        imageUrl: imageUrl || undefined,
        status: duplicateOf ? "Assigned" : "Submitted",
        dateSubmitted,
        priority: aiResult.priority || priority,
        priorityScore: aiResult.priorityScore || priorityScore,
        department: aiResult.department || assignedDept,
        slaDays: aiResult.slaDays || slaDays,
        assignedOfficer: duplicateOf ? `Auto-merged with master ${duplicateOf}` : (aiResult.assignedOfficer || "Shri K. Biswal, Ward Engineer"),
        history: [
          { status: "Submitted", date: dateSubmitted, remarks: duplicateOf ? `Merged automatically as duplicate of ${duplicateOf}.` : "Grievance submitted." }
        ],
        duplicateOf
      };

      db.complaints.unshift(newComplaint as any);
      return res.json(newComplaint);
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit civic complaint", details: error.message });
  }
});

// 5. Get Complaints list
app.get("/api/complaints", (req, res) => {
  res.json(db.complaints);
});

// 6. Get Dashboard Stats
app.get("/api/dashboard/stats", (req, res) => {
  const complaints = db.complaints;
  
  // Aggregate by Category
  const categoryCount: { [key: string]: number } = {};
  complaints.forEach(c => {
    categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
  });
  const categoryStats = Object.keys(categoryCount).map(name => ({ name, value: categoryCount[name] }));

  // Aggregate by Status
  const statusCount: { [key: string]: number } = {};
  complaints.forEach(c => {
    statusCount[c.status] = (statusCount[c.status] || 0) + 1;
  });
  const statusStats = Object.keys(statusCount).map(name => ({ name, value: statusCount[name] }));

  // Regional Trend
  const regionCount: { [key: string]: number } = {};
  complaints.forEach(c => {
    regionCount[c.city] = (regionCount[c.city] || 0) + 1;
  });
  const regionalStats = Object.keys(regionCount).map(city => ({ city, complaints: regionCount[city] }));

  // Average Priority Score
  const avgPriority = Math.round(complaints.reduce((acc, c) => acc + c.priorityScore, 0) / complaints.length);

  res.json({
    total: complaints.length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
    pending: complaints.filter(c => c.status !== "Resolved").length,
    avgPriority,
    categoryStats,
    statusStats,
    regionalStats
  });
});

// 7. Text-To-Speech (Regional Speech) Simulation
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing text content" });
    }

    const isMock = process.env.GEMINI_API_KEY === undefined;

    if (isMock) {
      // Return a simulated, lightweight audio placeholder URL or signal
      return res.json({
        success: true,
        voiceSelected: voice || "Kore",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Royalty free audios for preview
      });
    } else {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Say clearly in regional Indian accent: ${text}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || "Kore" }
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({
          success: true,
          audioData: `data:audio/mp3;base64,${base64Audio}`
        });
      }
      return res.json({ success: false, error: "Failed to generate speech audio" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "TTS Generation error", details: error.message });
  }
});


// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Bharat Express server running on port ${PORT}`);
  });
}

startServer();
