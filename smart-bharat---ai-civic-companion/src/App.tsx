import React, { useState, useEffect, useRef } from "react";
import { TRANSLATIONS } from "./translations";
import {
  MessageSquare,
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Volume2,
  Award,
  Activity,
  FileCheck2,
  User,
  Globe,
  Building2,
  ChevronRight,
  Plus,
  MapPin,
  Sparkles,
  Code,
  Database,
  Cpu,
  Clock,
  Settings,
  X,
  Languages,
  Send,
  Upload,
  BarChart2,
  Lock,
  ArrowRight,
  RefreshCw,
  Bell
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import { CitizenProfile, Scheme, Complaint, ChatMessage, VerificationResult, ServiceDefinition } from "./types";

const INDIAN_LANGUAGES = [
  { code: "English", label: "English" },
  { code: "Hindi", label: "हिन्दी (Hindi)" },
  { code: "Bengali", label: "বাংলা (Bengali)" },
  { code: "Marathi", label: "मराठी (Marathi)" },
  { code: "Telugu", label: "తెలుగు (Telugu)" },
  { code: "Tamil", label: "தமிழ் (Tamil)" },
  { code: "Gujarati", label: "ગુજરાતી (Gujarati)" },
  { code: "Urdu", label: "اردو (Urdu)" },
  { code: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
  { code: "Odia", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "Malayalam", label: "മലയാളം (Malayalam)" },
  { code: "Punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" }
];

const SAMPLE_DOCUMENTS = [
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    placeholderText: "GOVERNMENT OF INDIA\nUnique Identification Authority of India\nTo: Akansha Sharma\nD/O: S.K. Sharma\nDOB: 18/10/2005\nGender: Female\nAddress: Sector 4, Bhubaneswar, Odisha - 751022\nUID: 5542-9671-8821\nSTAMP: Verified Official"
  },
  {
    id: "income",
    name: "Income Certificate (Tehsildar Signed)",
    placeholderText: "OFFICE OF THE TEHSILDAR, BHUBANESWAR\nMISC CASE NO: CERT-2026-098\nThis is to certify that Smt/Kumari Akansha Sharma, daughter of S.K. Sharma, residing at Bhubaneswar, Odisha, has an annual household income of Rs 1,20,000 (Rupees One Lakh Twenty Thousand Only) from all sources.\nIssued Date: 12/03/2026\nSigned: Tehsildar, Bhubaneswar Circle\nSeal: Govt of Odisha Revenue Dept"
  },
  {
    id: "invalid",
    name: "Unrelated Photo Receipt (Simulated Invalid)",
    placeholderText: "CAFE COFFEE DAY\nOrder Receipt #9941\nDate: 04/07/2026\n1x Cappuccino - 180 INR\nTotal Paid: 180 INR\nThank you for visiting!"
  }
];

const DEPRECATED_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    // Top banner
    digital_india: "Digital India",
    gov_tech: "Gov Tech",
    title: "Smart Bharat",
    subtitle: "AI Civic Companion",
    aadhaar_verified: "Aadhaar Verified",
    citizen: "Citizen",
    official: "Gov Official",
    live_updates: "Live Updates:",
    sla_res: "Grievance SLA Resolution: 98.4%",

    // Profile Rail
    profile_title: "Your Personal Profile",
    state_residence: "State of Residence",
    age: "Age",
    gender: "Gender",
    annual_income: "Annual Family Income (₹)",
    occupation: "Your Occupation / Work",
    category: "Social Category",
    specially_abled: "Specially Abled (Divyangjan)",
    sync_schemes: "Find Matching Schemes",
    voice_title: "Voice-First & Access",
    voice_desc: "Low literacy? Click the speaker icon beside AI replies for real-time speech readout in your selected language.",
    hotline: "Offline IVR Hotline (Free):",

    // Tabs
    tab_assistant: "AI Assistant",
    tab_schemes: "Govt Schemes",
    tab_complaints: "File Complaint",
    tab_ocr: "Check Documents (OCR)",
    tab_stats: "Civic Dashboard",
    tab_admin: "Officer Portal",
    tab_architecture: "How It Works",

    // Tab 1: Chat Assistant
    chat_header: "Grounded Chatbot Companion",
    chat_sub: "Verified against Official Government Gazette and scheme databases",
    chat_lang: "Language",
    chat_placeholder: "Ask about schemes, application procedures, or report a civic issue...",
    suggest_pmjay: " Check Ayushman Bharat Eligibility",
    suggest_pmkisan: " PM-KISAN Land Documents Checklist",
    suggest_pothole: " File Pothole Complaint",

    // Tab 2: Schemes
    schemes_header: "AI Scheme Recommendation Engine",
    schemes_sub: "Matches benefits from Central & State ministries of India dynamically. Update your details on the left to re-calculate!",
    match_score: "Match",
    analyze_checklist: "Analyze Checklist & Steps",
    scheme_overview: "Scheme Overview:",
    benefits_title: "Direct Scheme Benefits",
    checklist_title: "Required Document Checklist",
    verify_ocr: "Verify via OCR",
    walkthrough_title: "Guided Procedural Walkthrough (Step-by-Step)",
    begin_app: "Begin Guided Application",

    // Tab 3: Complaints
    complaints_title: "State Grievance Redressal Portal",
    complaints_sub: "File a municipal complaint with geo-tagging, automatic category classification, severity scoring, and duplicates filtration.",
    complaint_desc: "Grievance Description (Detailed)",
    complaint_desc_placeholder: "Specify street address, visual markers of the pothole, water leakages, garbage overflow, or electricity hazards...",
    category_override: "Select Category Override (Optional)",
    auto_classify: "Let AI Auto-Classify",
    image_attach: "Image Attachment (Geotagged Photo)",
    simulate_camera: "Simulate Camera Capture",
    city: "City",
    submit_complaint: "Submit Official Grievance",
    submitting: "Auto-Categorizing & Duplicate Filtering...",
    history_title: "Registered Grievance History",
    history_sub: "Track milestones and Escalation SLAs in real time",
    filter_all: "all",
    filter_submitted: "submitted",
    filter_assigned: "assigned",
    filter_resolved: "resolved",
    assigned_dept: "Assigned Department",
    assigned_off: "Assigned Officer",
    sla_deadline: "Resolution SLA Deadline",
    audit_title: "Action Audit Timeline Log",

    // Tab 4: OCR
    ocr_header: "AI-Powered Document Verification (OCR)",
    ocr_sub: "Select a document to test OCR. The AI will extract credentials, perform name-matching audits, and rate formatting completeness.",
    simulated_load: "Click to load simulated file text",
    ocr_readout: "Document Text Content (OCR Readout Editor)",
    run_audit: "Run OCR Audit Verification",
    auditing: "Performing Semantic OCR Audit...",
    audit_verdict: "OCR Audit Verdict Report",
    extracted_name: "Extracted Name",
    serial_id: "Serial Identifier",
    dob_extracted: "DOB Extracted",
    income_statement: "Income Statement",
    compliance_checks: "Compliance Checks",
    dossier_match: "Dossier Name Matching",
    serial_valid: "Serial Structure Valid",
    stamp_sig: "Official Stamp/Signature"
  },
  Hindi: {
    digital_india: "डिजिटल भारत",
    gov_tech: "सरकारी तकनीक",
    title: "स्मार्ट भारत",
    subtitle: "एआई नागरिक साथी",
    aadhaar_verified: "आधार सत्यापित",
    citizen: "नागरिक",
    official: "अधिकारी",
    live_updates: "ताज़ा जानकारी:",
    sla_res: "शिकायत समाधान दर: 98.4%",

    profile_title: "आपका व्यक्तिगत विवरण",
    state_residence: "निवास राज्य",
    age: "उम्र",
    gender: "लिंग",
    annual_income: "वार्षिक पारिवारिक आय (₹)",
    occupation: "आपका व्यवसाय / कार्य",
    category: "सामाजिक वर्ग",
    specially_abled: "विशेष रूप से सक्षम (दिव्यांगजन)",
    sync_schemes: "योजनाएं मिलान करें",
    voice_title: "आवाज और सुगमता सहायक",
    voice_desc: "कम साक्षरता? अपनी चुनी हुई भाषा में आवाज सुनने के लिए एआई जवाबों के बगल में मौजूद स्पीकर आइकन पर क्लिक करें।",
    hotline: "ऑफ़लाइन हेल्पलाइन (निःशुल्क):",

    tab_assistant: "एआई सहायक",
    tab_schemes: "सरकारी योजनाएं",
    tab_complaints: "शिकायत दर्ज करें",
    tab_ocr: "दस्तावेज़ जाँच (OCR)",
    tab_stats: "नागरिक डैशबोर्ड",
    tab_admin: "अधिकारी पोर्टल",
    tab_architecture: "यह कैसे काम करता है",

    chat_header: "सत्यापित एआई चैट सहायक",
    chat_sub: "आधिकारिक सरकारी राजपत्र और योजना डेटाबेस से सत्यापित",
    chat_lang: "भाषा",
    chat_placeholder: "योजनाओं, आवेदन प्रक्रियाओं के बारे में पूछें, या नागरिक समस्या की रिपोर्ट करें...",
    suggest_pmjay: " आयुष्मान भारत पात्रता जांचें",
    suggest_pmkisan: " पीएम-किसान भूमि दस्तावेज़ सूची",
    suggest_pothole: " सड़क के गड्ढे की शिकायत दर्ज करें",

    schemes_header: "एआई योजना सिफारिश प्रणाली",
    schemes_sub: "भारत के केंद्रीय और राज्य मंत्रालयों से मिलने वाले लाभों का स्वचालित मिलान। विवरण अपडेट कर पुनः मिलान करें!",
    match_score: "सटीकता",
    analyze_checklist: "चेकलिस्ट और प्रक्रिया देखें",
    scheme_overview: "योजना का विवरण:",
    benefits_title: "सीधे मिलने वाले योजना लाभ",
    checklist_title: "आवश्यक दस्तावेज़ चेकलिस्ट",
    verify_ocr: "दस्तावेज़ सत्यापित करें (OCR)",
    walkthrough_title: "चरण-दर-चरण मार्गदर्शिका",
    begin_app: "आवेदन प्रक्रिया शुरू करें",

    complaints_title: "राज्य शिकायत निवारण पोर्टल",
    complaints_sub: "भौगोलिक स्थिति (जीपीएस), स्वचालित श्रेणी वर्गीकरण, गंभीरता स्कोर और डुप्लीकेट शिकायत निस्पंदन के साथ शिकायत दर्ज करें।",
    complaint_desc: "शिकायत का विस्तृत विवरण",
    complaint_desc_placeholder: "सड़क का पता, गड्ढे के निशान, पानी का रिसाव, कचरा संचय, या बिजली के खतरों का विवरण दें...",
    category_override: "श्रेणी बदलें (वैकल्पिक)",
    auto_classify: "एआई को स्वचालित वर्गीकृत करने दें",
    image_attach: "फोटो संलग्न करें (जीपीएस जियोटैग फोटो)",
    simulate_camera: "कैमरा फोटो सिमुलेट करें",
    city: "शहर",
    submit_complaint: "आधिकारिक शिकायत दर्ज करें",
    submitting: "वर्गीकरण और डुप्लीकेट जांच जारी है...",
    history_title: "पंजीकृत शिकायतों का इतिहास",
    history_sub: "वास्तविक समय में समाधान की प्रगति और समय सीमा ट्रैक करें",
    filter_all: "सभी",
    filter_submitted: "दर्ज",
    filter_assigned: "अधिकारी नियुक्त",
    filter_resolved: "समाधानित",
    assigned_dept: "संबंधित विभाग",
    assigned_off: "नियुक्त अधिकारी",
    sla_deadline: "समाधान की समय सीमा",
    audit_title: "कार्यवाई का इतिहास (ऑडिट लॉग)",

    ocr_header: "एआई-संचालित दस्तावेज़ सत्यापन (OCR)",
    ocr_sub: "सत्यापन का परीक्षण करने के लिए एक दस्तावेज़ चुनें। एआई क्रेडेंशियल निकालेगा, नाम का मिलान करेगा और पूर्णता का आकलन करेगा।",
    simulated_load: "सिमुलेटेड दस्तावेज़ लोड करने के लिए क्लिक करें",
    ocr_readout: "दस्तावेज़ पाठ सामग्री (OCR संपादक)",
    run_audit: "दस्तावेज़ सत्यापन रन करें",
    auditing: "दस्तावेज़ की एआई जांच जारी है...",
    audit_verdict: "सत्यापन रिपोर्ट परिणाम",
    extracted_name: "निकाला गया नाम",
    serial_id: "क्रम संख्या / पहचानकर्ता",
    dob_extracted: "जन्म तिथि",
    income_statement: "आय विवरण",
    compliance_checks: "अनुपालन जांच",
    dossier_match: "प्रोफ़ाइल नाम मिलान",
    serial_valid: "पहचान संख्या प्रारूप वैध",
    stamp_sig: "आधिकारिक मुहर/हस्ताक्षर"
  },
  Odia: {
    digital_india: "ଡିଜିଟାଲ୍ ଇଣ୍ଡିଆ",
    gov_tech: "ସରକାରୀ ପ୍ରଯୁକ୍ତି",
    title: "ସ୍ମାର୍ଟ ଭାରତ",
    subtitle: "AI ନାଗରିକ ସାଥୀ",
    aadhaar_verified: "ଆଧାର ସତ୍ୟାପିତ",
    citizen: "ନାଗରିକ",
    official: "ଅଧିକାରୀ",
    live_updates: "ସଦ୍ୟ ସୂଚନା:",
    sla_res: "ଅଭିଯୋଗ ସମାଧାନ ହାର: 98.4%",

    profile_title: "ଆପଣଙ୍କ ବିବରଣୀ (Profile)",
    state_residence: "ବାସସ୍ଥାନ ରାଜ୍ୟ",
    age: "ବୟସ",
    gender: "ଲିଙ୍ଗ",
    annual_income: "ବାର୍ଷିକ ପରିବାର ଆୟ (₹)",
    occupation: "ଆପଣଙ୍କ ପେଶା / କାର୍ଯ୍ୟ",
    category: "ସାମାଜିକ ଶ୍ରେଣୀ",
    specially_abled: "ଭିନ୍ନକ୍ଷମ (ଦିବ୍ୟାଙ୍ଗଜନ)",
    sync_schemes: "ଯୋଜନା ସିଙ୍କ୍ କରନ୍ତୁ",
    voice_title: "ସ୍ୱର ଏବଂ ସୁଗମତା ସହାୟକ",
    voice_desc: "କମ୍ ସାକ୍ଷରତା? ନିଜ ମନପସନ୍ଦ ଭାଷାରେ ସ୍ୱର ଶୁଣିବା ପାଇଁ AI ଉତ୍ତର ପାଖରେ ଥିବା ସ୍ପିକର୍ ଆଇକନ୍ କ୍ଲିକ୍ କରନ୍ତୁ।",
    hotline: "ଅଫଲାଇନ ହେଲ୍ପଲାଇନ (ମାଗଣା):",

    tab_assistant: "AI ସହାୟକ",
    tab_schemes: "ସରକାରୀ ଯୋଜନା",
    tab_complaints: "ଅଭିଯୋଗ କରନ୍ତୁ",
    tab_ocr: "କାଗଜପତ୍ର ଯାଞ୍ଚ (OCR)",
    tab_stats: "ନାଗରିକ ଡ୍ୟାସବୋର୍ଡ",
    tab_admin: "ଅଧିକାରୀ ପୋର୍ଟାଲ",
    tab_architecture: "କିପରି କାମ କରେ",

    chat_header: "ସତ୍ୟାପିତ AI ଚାଟ୍ ସହାୟକ",
    chat_sub: "ସରକାରୀ ଗେଜେଟ୍ ଏବଂ ଯୋଜନା ଡାଟାବେସରୁ ସତ୍ୟାପିତ",
    chat_lang: "ଭାଷା",
    chat_placeholder: "ଯୋଜନା, ଆବେଦନ ପ୍ରକ୍ରିୟା ବିଷୟରେ ପଚାରନ୍ତୁ କିମ୍ବା ସମସ୍ୟା ଜଣାନ୍ତୁ...",
    suggest_pmjay: " ଆୟୁଷ୍ମାନ ଭାରତ ଯୋଗ୍ୟତା ଯାଞ୍ଚ",
    suggest_pmkisan: " PM-KISAN ଜମି କାଗଜପତ୍ର ତାଲିକା",
    suggest_pothole: " ଖାଲଖମା ରାସ୍ତା ବିଷୟରେ ଅଭିଯୋଗ କରନ୍ତୁ",

    schemes_header: "AI ଯୋଜନା ସୁପାରିଶ ପ୍ରଣାଳୀ",
    schemes_sub: "ଭାରତ ସରକାର ଏବଂ ରାଜ୍ୟ ସରକାରଙ୍କ ଯୋଜନା ସହ ସ୍ୱୟଂଚାଳିତ ମେଳ। ପ୍ରୋଫାଇଲ୍ ଅପଡେଟ୍ କରି ପୁନଃ ସିଙ୍କ୍ କରନ୍ତୁ!",
    match_score: "ସୁସଙ୍ଗତି",
    analyze_checklist: "ଚେକଲିଷ୍ଟ ଏବଂ ପଦକ୍ଷେପ ଦେଖନ୍ତୁ",
    scheme_overview: "ଯୋଜନା ସୂଚନା:",
    benefits_title: "ଯୋଜନାରୁ ସିଧାସଳଖ ମିଳୁଥିବା ସୁବିଧା",
    checklist_title: "ଆବଶ୍ୟକ କାଗଜପତ୍ର ତାଲିକା",
    verify_ocr: "କାଗଜପତ୍ର ଯାଞ୍ଚ (OCR)",
    walkthrough_title: "ପର୍ଯ୍ୟାୟକ୍ରମିକ ଗାଇଡ୍ (Step-by-Step)",
    begin_app: "ଆବେଦନ ପ୍ରକ୍ରିୟା ଆରମ୍ଭ କରନ୍ତୁ",

    complaints_title: "ରାଜ୍ୟ ଅଭିଯୋଗ ନିବାରଣ ପୋର୍ଟାଲ",
    complaints_sub: "ଜିଓ-ଟ୍ୟାଗିଂ (GPS), ସ୍ୱୟଂଚାଳିତ ଶ୍ରେଣୀକରଣ ଏବଂ ଅଭିଯୋଗର ଗୁରୁତ୍ୱ ଆଧାରରେ ଅଭିଯୋଗ ଦର୍ଜ କରନ୍ତୁ।",
    complaint_desc: "ଅଭିଯୋଗର ବିସ୍ତୃତ ବିବରଣୀ",
    complaint_desc_placeholder: "ରାସ୍ତା ଠିକଣା, ରାସ୍ତା ଖାଲ, ପାଣି ଲିକ୍, ଅଳିଆ ଆବର୍ଜନା କିମ୍ବା ବିଦ୍ୟୁତ୍ ସମସ୍ୟା ବିବରଣୀ ଦିଅନ୍ତୁ...",
    category_override: "ଶ୍ରେଣୀ ବଦଳାନ୍ତୁ (ଐଚ୍ଛିକ)",
    auto_classify: "AI କୁ ସ୍ୱୟଂଚାଳିତ ଶ୍ରେଣୀକରଣ କରିବାକୁ ଦିଅନ୍ତୁ",
    image_attach: "ଫଟୋ ସଂଲଗ୍ନ (GPS ଜିଓଟ୍ୟାଗ୍ ଫଟୋ)",
    simulate_camera: "କ୍ୟାମେରା ଫଟୋ ସିମୁଲେଟ୍ କରନ୍ତୁ",
    city: "ସହର",
    submit_complaint: "ଆଧିକାରିକ ଅଭିଯୋଗ ଦର୍ଜ କରନ୍ତୁ",
    submitting: "ଶ୍ରେଣୀକରଣ ଏବଂ ପୁନଃପ୍ରଦର୍ଶନ ଯାଞ୍ଚ ଚାଲିଛି...",
    history_title: "ପଞ୍ଜୀକୃତ ଅଭିଯୋଗ ଇତିହାସ",
    history_sub: "ଅଭିଯୋଗ ସମାଧାନର ପ୍ରଗତି ଏବଂ ସମୟ ସୀମା ଟ୍ରାକ୍ କରନ୍ତୁ",
    filter_all: "ସମସ୍ତ",
    filter_submitted: "ଦର୍ଜ",
    filter_assigned: "ଅଧିକାରୀ ନିଯୁକ୍ତ",
    filter_resolved: "ସମାଧାନିତ",
    assigned_dept: "ସମ୍ପୃକ୍ତ ବିଭାଗ",
    assigned_off: "ନିଯୁକ୍ତ ଅଧିକାରୀ",
    sla_deadline: "ସମାଧାନର ଶେଷ ସମୟ",
    audit_title: "କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ଇତିହାସ (Audit Log)",

    ocr_header: "AI-ଦ୍ୱାରା କାଗଜପତ୍ର ଯାଞ୍ଚ (OCR)",
    ocr_sub: "କାଗଜପତ୍ରର ସତ୍ୟତା ପରୀକ୍ଷା କରିବାକୁ ଏକ ଡକ୍ୟୁମେଣ୍ଟ ବାଛନ୍ତୁ। AI ନାମ ମେଳାଇବା ସହ ସମ୍ପୂର୍ଣ୍ଣତା ଯାଞ୍ଚ କରିବ।",
    simulated_load: "ସିମୁଲେଟେଡ୍ କାଗଜପତ୍ର ଲୋଡ୍ କରନ୍ତୁ",
    ocr_readout: "କାଗଜପତ୍ରର ଲେଖା (OCR ସମ୍ପାଦକ)",
    run_audit: "କାଗଜପତ୍ର ଯାଞ୍ଚ ଆରମ୍ଭ କରନ୍ତୁ",
    auditing: "କାଗଜପତ୍ରର AI ଯାଞ୍ଚ ଚାଲିଛି...",
    audit_verdict: "ଯାଞ୍ଚ ରିପୋର୍ଟ ଫଳାଫଳ",
    extracted_name: "ବାହାର କରାଯାଇଥିବା ନାମ",
    serial_id: "କ୍ରମିକ ସଂଖ୍ୟା / ପରିଚୟପତ୍ର ନମ୍ବର",
    dob_extracted: "ଜନ୍ମ ତାରିଖ",
    income_statement: "ଆୟ ସୂଚନା",
    compliance_checks: "ସମୀକ୍ଷା ଯାଞ୍ଚ",
    dossier_match: "ପ୍ରୋଫାଇଲ୍ ନାମ ମେଳ",
    serial_valid: "ଆଇଡି ଫର୍ମାଟ୍ ବୈଧ",
    stamp_sig: "ସରକାରୀ ମୋହର/ଦସ୍ତଖତ"
  }
};

function getWelcomeMessage(lang: string): string {
  const messages: Record<string, string> = {
    English: "Namaste! Welcome to **Smart Bharat Civic Companion**. I can help you understand government schemes, check eligibility, suggest document checklists, and register civic complaints. How can I assist you today?",
    Hindi: "नमस्ते! **स्मार्ट भारत नागरिक साथी** में आपका स्वागत है। मैं आपको सरकारी योजनाओं को समझने, पात्रता जांचने, आवश्यक दस्तावेजों की सूची बनाने और नागरिक शिकायतें दर्ज करने में मदद कर सकता हूं। आज मैं आपकी क्या सहायता कर सकता हूं?",
    Bengali: "নমস্কার! **স্মার্ট ভারত नागरिक সাথী**-তে আপনাকে স্বাগত। আমি আপনাকে সরকারি স্কিমগুলি বুঝতে, যোগ্যতার মানদণ্ড পরীক্ষা করতে, প্রয়োজনীয় কাগজপত্রের তালিকা তৈরি করতে এবং নাগরিক অভিযোগ নথিভুক্ত করতে সহায়তা করতে পারি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    Marathi: "नमस्ते! **स्मार्ट भारत नागरिक साथी** मध्ये आपले स्वागत आहे. मी तुम्हाला सरकारी योजना समजून घेण्यास, पात्रता तपासण्यास, आवश्यक कागदपत्रांची यादी बनवण्यास आणि नागरी तक्रारी नोंदवण्यास मदत करू शकतो. आज मी तुम्हाला कशी मदत करू?",
    Telugu: "నమస్తే! **స్మార్ట్ భారత్ సివిక్ కంపానియన్** కి స్వాగతం. ప్రభుత్వ పథకాలను అర్థం చేసుకోవడానికి, అర్హతను తనిఖీ చేయడానికి, అవసరమైన పత్రాల జాబಿತాను రూపొందించడానికి మరియు పౌర ఫిర్యాదులను నమోదు చేయడానికి నేను మీకు సహాయం చేయగలను. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?",
    Tamil: "வணக்கம்! **ஸ்மார்ட் பாரத் குடிமகன் துணைக்கு** உங்களை வரவேற்கிறோம். அரசு திட்டங்களை புரிந்து கொள்ளவும், தகுதியை சரிபார்க்கவும், தேவையான ஆவணங்களின் பட்டியலை உருவாக்கவும் மற்றும் குடிமை புகார்களை பதிவு செய்யவும் நான் உங்களுக்கு உதவ முடியும். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    Gujarati: "નમસ્તે! **સ્માર્ટ ભારત નાગરિક સાથી** માં આપનું સ્વાગત છે. હું તમને સરકારી યોજનાઓ સમજવામાં, યોગ્યતા તપાસવામાં, જરૂરી દસ્તાવેજોની યાદী બનાવવામાં અને નાગરિક ફરિયાદો નોંધાવવામાં મદદ કરી શકું છું. આજે હું તમારી શું મદદ કરી શકું?",
    Urdu: "نمستے! **سمارٹ بھارت سوک ساتھی** میں خوش آمدید۔ میں آپ کو سرکاری اسکیموں کو سمجھنے، اہلیت چیک کرنے، مطلوبہ دستاویزات کی فہرست بنانے اور شکایات درج کرنے میں مدد کر سکتا ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟",
    Kannada: "ನಮಸ್ತೆ! **ಸ್ಮಾರ್ಟ್ ಭಾರತ್ ನಾಗರಿಕ ಸಾಥಿ** ಗೆ ನಿಮಗೆ ಸ್ವಾಗತ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು, ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು, ಅಗತ್ಯ ದಾಖಲೆಗಳ ಪಟ್ಟಿಯನ್ನು ತಯಾರಿಸಲು ಮತ್ತು ನಾಗರಿಕ ದೂರುಗಳನ್ನು ದಾಖಲಿಸಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    Odia: "ନମସ୍କାର! **ସ୍ମାର୍ଟ ଭାରତ ନାଗରିକ ସାଥୀ** କୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ମୁଁ ଆପଣଙ୍କୁ ସରକାରୀ ଯୋଜନା ବୁଝିବାରେ, ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରିବାରେ, କାଗଜପତ୍ରର ତାଲିକା ପ୍ରସ୍ତୁତ କରିବାରେ ଏବଂ ଅଭିଯୋଗ ଦର୍ଜ କରିବାରେ ସାହାଯ୍ୟ କରିପାରିବି। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିବି?",
    Malayalam: "നമസ്തേ! **സ്മാർട്ട് ഭാരത് സിവിക് കമ്പാനിയൻ**-ലേക്ക് സ്വാഗതം. സർക്കാർ പദ്ധതികൾ മനസ്സിലാക്കാനും, യോഗ്യത പരിശോധിക്കാനും, ആവശ്യമായ രേഖകളുടെ ലിസ്റ്റ് തയ്യാറാക്കാനും, സിവിക് പരാതികൾ രജിസ്റ്റർ ചെയ്യാനും എനിക്ക് നിങ്ങളെ സഹായിക്കാനാകും. ഇന്ന് ഞാൻ നിങ്ങൾക്ക് എങ്ങനെയാണ് സഹായിേണ്ടത്?",
    Punjabi: "ਨਮਸਤੇ! **ਸਮਾਰਟ ਭਾਰਤ ਨਾਗਰਿਕ ਸਾਥੀ** ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਮੈਂ ਤੁਹਾਨੂੰ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਨੂੰ ਸਮਝਣ, ਯੋਗਤਾ ਦੀ ਜਾਂਚ ਕਰਨ, ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਸੂਚੀ ਬਣਾਉਣ ਅਤੇ ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤਾਂ ਦਰਜ ਕਰਨ ਵਿੱਚ ਮਦद ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ?"
  };
  return messages[lang] || messages.English;
}

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"schemes" | "complaints" | "dashboard" | "ocr" | "admin" | "architecture">("schemes");
  const [activeLang, setActiveLang] = useState<string>("English");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);

  // Translation helper for simple, citizen-focused language
  const t = (key: string): string => {
    const currentLangDict = TRANSLATIONS[activeLang] || TRANSLATIONS.English;
    return currentLangDict[key] || TRANSLATIONS.English[key] || key;
  };
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [aadhaarInput, setAadhaarInput] = useState<string>("5542-9671-8821");
  const [role, setRole] = useState<"citizen" | "official">("citizen");
  const [notifications, setNotifications] = useState<string[]>([
    "Your complaint on Water Supply (SB-2026-1182) was assigned to Smt. Priya Patil.",
    "Ayushman Bharat scheme checklist updated for FY 2026-27."
  ]);

  // Citizen Profile State
  const [profile, setProfile] = useState<CitizenProfile>({
    age: 20,
    income: 120000,
    gender: "Female",
    state: "Odisha",
    category: "General",
    occupation: "Student",
    disability: false
  });

  // Schemes State
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [recommendedSchemes, setRecommendedSchemes] = useState<any[]>([]);
  const [recommendationSummary, setRecommendationSummary] = useState<string>("");
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [loadingSchemes, setLoadingSchemes] = useState<boolean>(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "Namaste! Welcome to **Smart Bharat Civic Companion**. I can help you understand government schemes, check eligibility, suggest document checklists, and register civic complaints. How can I assist you today in your preferred language?",
      timestamp: new Date().toLocaleTimeString(),
      intent: "general"
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [ttsPlaying, setTtsPlaying] = useState<string | null>(null);

  // Complaints State
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [newComplaintDesc, setNewComplaintDesc] = useState<string>("");
  const [newComplaintCategory, setNewComplaintCategory] = useState<string>("");
  const [newComplaintCity, setNewComplaintCity] = useState<string>("Bhubaneswar");
  const [newComplaintState, setNewComplaintState] = useState<string>("Odisha");
  const [newComplaintRegion, setNewComplaintRegion] = useState<string>("East Zone");
  const [newComplaintLat, setNewComplaintLat] = useState<string>("20.2961");
  const [newComplaintLng, setNewComplaintLng] = useState<string>("85.8245");
  const [newComplaintImage, setNewComplaintImage] = useState<string>("");
  const [submittingComplaint, setSubmittingComplaint] = useState<boolean>(false);
  const [duplicateAlert, setDuplicateAlert] = useState<Complaint | null>(null);
  const [complaintSuccessTicket, setComplaintSuccessTicket] = useState<string | null>(null);
  const [complaintFilter, setComplaintFilter] = useState<string>("all");

  // Dashboard Stats State
  const [stats, setStats] = useState<any>({
    total: 0,
    resolved: 0,
    pending: 0,
    avgPriority: 0,
    categoryStats: [],
    statusStats: [],
    regionalStats: []
  });
  const [loadingStats, setLoadingStats] = useState<boolean>(false);

  // OCR Document State
  const [selectedDocType, setSelectedDocType] = useState<string>("aadhaar");
  const [ocrText, setOcrText] = useState<string>(SAMPLE_DOCUMENTS[0].placeholderText);
  const [ocrResult, setOcrResult] = useState<VerificationResult | null>(null);
  const [verifyingDoc, setVerifyingDoc] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- SERVICE ARCHITECTURE SPECIFICATIONS DATA ---
  const services: ServiceDefinition[] = [
    {
      name: "AI & NLP Cognitive Service",
      description: "Manages natural language queries, RAG scheme matching, real-time machine translation, intent detection, and Text-to-Speech regional audio streaming via Google Gemini API & TTS models.",
      techStack: "Google Gemini 3.5 Flash, Bhashini APIs, Express.js Proxy, Node.js",
      responsibilities: [
        "Linguistic query translation and transliteration.",
        "Zero-shot classification of civic intents.",
        "Retrieval and grounding against verified Ministry circulars."
      ],
      contracts: [
        {
          name: "Linguistic Civic Query Proxy",
          endpoint: "/api/chat",
          method: "POST",
          requestBody: JSON.stringify({ messages: "ChatMessage[]", language: "string", profile: "CitizenProfile" }, null, 2),
          responseBody: JSON.stringify({ reply: "string (markdown)", intent: "string", language: "string", suggestedAction: "object" }, null, 2),
          description: "Streams conversational support using multi-turn context retention and structural scheme mappings."
        },
        {
          name: "Indic Text-to-Speech Engine",
          endpoint: "/api/tts",
          method: "POST",
          requestBody: JSON.stringify({ text: "string", voice: "string" }, null, 2),
          responseBody: JSON.stringify({ success: "boolean", audioData: "string (Base64 URI)" }, null, 2),
          description: "Synthesizes regional vocal tracks to serve low-literacy or vision-impaired individuals."
        }
      ]
    },
    {
      name: "Grievance & Incident Service",
      description: "Directs citizen grievance recording, duplicate matching using semantic similarity algorithms, automated department routing, and SLA tracking metrics.",
      techStack: "Node.js, Express, PostgreSQL / Firestore, Google Vision OCR",
      responsibilities: [
        "Creating, resolving, and routing public service issues with unique Ticket IDs.",
        "Executing automated department dispatch logic.",
        "Detecting duplicate close-proximity incident reports to optimize field crews."
      ],
      contracts: [
        {
          name: "File Grievance Ticket",
          endpoint: "/api/complaints",
          method: "POST",
          requestBody: JSON.stringify({ description: "string", city: "string", state: "string", latitude: "number", longitude: "number", imageUrl: "string" }, null, 2),
          responseBody: JSON.stringify({ id: "string", ticketId: "string", priority: "string", priorityScore: "number", department: "string", slaDays: "number", duplicateOf: "string | null" }, null, 2),
          description: "Categorizes and scores complaints for routing to municipal officers."
        }
      ]
    },
    {
      name: "Scheme Recommendation Engine",
      description: "Evaluates citizen demographics against rigorous government matrices to suggest optimal public services and auto-build required documentation checklists.",
      techStack: "Node.js, Express, D3.js Matching",
      responsibilities: [
        "Analyzing age, occupation, income, caste, and local state rules.",
        "Generating procedural steps for onboarding and application.",
        "Publishing document checklists to ensure high success rates."
      ],
      contracts: [
        {
          name: "Generate Personalized Scheme Recommendations",
          endpoint: "/api/schemes/recommend",
          method: "POST",
          requestBody: JSON.stringify({ profile: "CitizenProfile" }, null, 2),
          responseBody: JSON.stringify({ recommendations: "Recommendation[]", summary: "string" }, null, 2),
          description: "Identifies tailored subsidies, medical support, and agricultural schemes."
        }
      ]
    }
  ];

  // --- INITIAL LOAD & SYNC ---
  useEffect(() => {
    fetchComplaints();
    fetchStats();
    fetchRecommendations();
  }, []);

  useEffect(() => {
    // Keep recommendations synchronized when profile changes
    fetchRecommendations();
  }, [profile]);

  useEffect(() => {
    // Dynamically translate the welcome chat message when the active language changes
    setChatMessages((prev) => {
      const welcomeIndex = prev.findIndex((m) => m.id === "welcome");
      if (welcomeIndex !== -1) {
        const updated = [...prev];
        updated[welcomeIndex] = {
          ...updated[welcomeIndex],
          content: getWelcomeMessage(activeLang)
        };
        return updated;
      }
      return prev;
    });
  }, [activeLang]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, loadingChat]);

  // --- API SERVICE CALLS ---

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (e) {
      console.error("Error fetching complaints", e);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error("Error fetching stats", e);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecommendations = async () => {
    setLoadingSchemes(true);
    try {
      const res = await fetch("/api/schemes/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile })
      });
      const data = await res.json();
      setRecommendedSchemes(data.recommendations || []);
      setRecommendationSummary(data.summary || "");
    } catch (e) {
      console.error("Error matching schemes", e);
    } finally {
      setLoadingSchemes(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const msgText = textToSend || chatInput;
    if (!msgText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: msgText,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setLoadingChat(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          language: activeLang,
          profile
        })
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "model",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString(),
        intent: data.intent,
        language: data.language,
        suggestedAction: data.suggestedAction
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error("Error calling chat API", e);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: "model",
          content: "I apologize, citizen. There was an error establishing a secure link to the Digital India Civic Gateway. Please check your credentials and try again.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const triggerTTS = async (text: string) => {
    if (ttsPlaying === text) {
      setTtsPlaying(null);
      return;
    }
    setTtsPlaying(text);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "Kore" })
      });
      const data = await res.json();
      if (data.success) {
        const audio = new Audio(data.audioData || data.audioUrl);
        audio.onended = () => setTtsPlaying(null);
        audio.play().catch(() => {
          // Playback blocked or failed, fall back
          setTtsPlaying(null);
          alert("Audio playback simulation complete. Standard voice-readout initiated.");
        });
      } else {
        setTtsPlaying(null);
      }
    } catch (e) {
      console.error("TTS play failed", e);
      setTtsPlaying(null);
    }
  };

  const handleDocumentOCRVerify = async () => {
    setVerifyingDoc(true);
    setOcrResult(null);
    try {
      const res = await fetch("/api/ocr/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: ocrText,
          documentName: selectedDocType === "aadhaar" ? "Aadhaar Card" : "Income Certificate",
          schemeId: selectedScheme ? selectedScheme.id : "sch-1",
          citizenName: "Akansha Sharma"
        })
      });
      const data = await res.json();
      setOcrResult(data);
      if (data.verified) {
        addNotification(`Document '${selectedDocType.toUpperCase()}' successfully verified and verified against active citizen dossier.`);
      }
    } catch (e) {
      console.error("Error verifying document", e);
    } finally {
      setVerifyingDoc(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintDesc.trim()) return;

    setSubmittingComplaint(true);
    setDuplicateAlert(null);
    setComplaintSuccessTicket(null);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newComplaintCategory || undefined,
          description: newComplaintDesc,
          city: newComplaintCity,
          state: newComplaintState,
          region: newComplaintRegion,
          latitude: parseFloat(newComplaintLat),
          longitude: parseFloat(newComplaintLng),
          imageUrl: newComplaintImage || undefined
        })
      });
      const data = await res.json();

      if (data.duplicateOf) {
        const matched = complaints.find((c) => c.ticketId === data.duplicateOf);
        if (matched) {
          setDuplicateAlert(matched);
        }
      }

      setComplaintSuccessTicket(data.ticketId);
      setNewComplaintDesc("");
      setNewComplaintImage("");
      addNotification(`New grievance logged successfully! Ticket ID: ${data.ticketId}. Priority: ${data.priority}.`);
      fetchComplaints();
      fetchStats();
    } catch (e) {
      console.error("Grievance post error", e);
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const addNotification = (text: string) => {
    setNotifications((prev) => [text, ...prev].slice(0, 5));
  };

  const handleSimulatedImageUpload = (category: string) => {
    const urls: { [key: string]: string } = {
      "Roads & Potholes": "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
      "Sanitation & Garbage": "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
      "Water Supply": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
      "Electricity": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80"
    };
    setNewComplaintImage(urls[category] || urls["Roads & Potholes"]);
    addNotification("Simulated geolocation photo captured & geotagged!");
  };

  const triggerSuggestedAction = (action: any) => {
    if (action.type === "apply_scheme") {
      setActiveTab("schemes");
      const matched = recommendedSchemes.find(s => s.id === action.payload.schemeId);
      if (matched) setSelectedScheme(matched);
    } else if (action.type === "report_complaint") {
      setActiveTab("complaints");
      if (action.payload.category) {
        setNewComplaintCategory(action.payload.category);
      }
    } else if (action.type === "verify_doc") {
      setActiveTab("ocr");
      if (action.payload.schemeId) {
        const sch = recommendedSchemes.find(s => s.id === action.payload.schemeId);
        if (sch) setSelectedScheme(sch);
      }
    }
  };

  // Filter complaints list
  const filteredComplaints = complaints.filter((c) => {
    if (complaintFilter === "all") return true;
    return c.status.toLowerCase() === complaintFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="smart-bharat-root">
      {/* --- TOP ACCENT BAR (National Flag Colors) --- */}
      <div className="h-1.5 w-full flex" id="national-accent-bar">
        <div className="bg-orange-500 flex-1"></div>
        <div className="bg-white flex-1"></div>
        <div className="bg-emerald-600 flex-1"></div>
      </div>

      {/* --- MAIN HEADER --- */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40" id="smart-bharat-header">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-orange-500 via-slate-100 to-emerald-600 p-2.5 rounded-xl shadow-inner flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-indigo-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase">{t("digital_india")}</span>
                <span className="text-xs font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">{t("gov_tech")}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                {t("title")} <span className="text-slate-400 font-normal">| {t("subtitle")}</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5" id="lang-picker">
              <Globe className="h-4 w-4 text-slate-500" />
              <select
                id="language-select"
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                value={activeLang}
                onChange={(e) => {
                  setActiveLang(e.target.value);
                  addNotification(`Interaction language switched to ${e.target.value}`);
                }}
              >
                {INDIAN_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Aadhaar Auth Status */}
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg" id="auth-badge">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">{t("aadhaar_verified")}</p>
                <p className="text-xs font-mono font-bold text-slate-700 leading-tight">Akansha Sharma (..8821)</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- LIVE REMINDER NOTIFICATIONS RAIL --- */}
      <div className="bg-indigo-900 text-white py-2 px-4 shadow-inner" id="notification-bar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <Bell className="h-4 w-4 text-amber-400 shrink-0 animate-bounce" />
            <span className="font-bold tracking-wider uppercase text-[10px] bg-indigo-800 px-2 py-0.5 rounded shrink-0">{t("live_updates")}</span>
            <p className="truncate font-medium">{notifications[0] || "No new civic notifications at present."}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-indigo-200 font-mono">{t("sla_res")}</span>
          </div>
        </div>
      </div>

      {/* --- APPLICATION NAVIGATION TABS --- */}
      <nav className="bg-slate-100 border-b border-slate-200 py-1" id="main-navigation">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto gap-1 scrollbar-none">
          <button
            id="tab-schemes"
            onClick={() => setActiveTab("schemes")}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "schemes"
                ? "border-orange-500 text-orange-600 bg-white shadow-sm rounded-t-lg"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Award className="h-4 w-4" />
            {t("tab_schemes")}
          </button>

          <button
            id="tab-complaints"
            onClick={() => setActiveTab("complaints")}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "complaints"
                ? "border-orange-500 text-orange-600 bg-white shadow-sm rounded-t-lg"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            {t("tab_complaints")}
          </button>

          <button
            id="tab-ocr"
            onClick={() => setActiveTab("ocr")}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "ocr"
                ? "border-orange-500 text-orange-600 bg-white shadow-sm rounded-t-lg"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            {t("tab_ocr")}
          </button>

          <button
            id="tab-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "dashboard"
                ? "border-orange-500 text-orange-600 bg-white shadow-sm rounded-t-lg"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Activity className="h-4 w-4" />
            {t("tab_stats")}
          </button>

          {role === "official" && (
            <button
              id="tab-admin"
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "admin"
                  ? "border-orange-500 text-orange-600 bg-white shadow-sm rounded-t-lg"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Building2 className="h-4 w-4" />
              {t("tab_admin")}
            </button>
          )}

          <button
            id="tab-architecture"
            onClick={() => setActiveTab("architecture")}
            className={`ml-auto flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap bg-indigo-50 border-indigo-200 ${
              activeTab === "architecture"
                ? "border-indigo-600 text-indigo-700 bg-white shadow-sm rounded-t-lg"
                : "border-transparent text-indigo-600 hover:text-indigo-950 hover:bg-indigo-100"
            }`}
          >
            <Code className="h-4 w-4" />
            {t("tab_architecture")}
          </button>
        </div>
      </nav>

      {/* --- MAIN PAGE LAYOUT --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6" id="smart-bharat-main-container">
        
        {/* --- LEFT HAND: QUICK PROFILE & SUMMARY PANEL (1 COL) --- */}
        <section className="lg:col-span-1 flex flex-col gap-5" id="profile-demographics-rail">
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm" id="citizen-profile-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-orange-500" />
                {t("profile_title")}
              </h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-500 font-bold">Aadhaar Synced</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">State of Residence</label>
                <select
                  id="profile-state-select"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-semibold text-slate-700"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                >
                  {["Odisha", "Delhi", "Maharashtra", "Karnataka", "West Bengal", "Uttar Pradesh", "Tamil Nadu", "Gujarat", "Kerala"].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age</label>
                  <input
                    id="profile-age-input"
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-semibold text-slate-700"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender</label>
                  <select
                    id="profile-gender-select"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-semibold text-slate-700"
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Annual Household Income (₹)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">₹</span>
                  <input
                    id="profile-income-input"
                    type="number"
                    step="10000"
                    className="w-full bg-slate-50 border border-slate-200 rounded pl-6 pr-2.5 py-1.5 font-semibold text-slate-700"
                    value={profile.income}
                    onChange={(e) => setProfile({ ...profile, income: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <p className="text-[10px] text-indigo-600 mt-1 font-medium">Matches low-income criteria: {profile.income <= 250000 ? "Yes (BPL/Priority)" : "General Class"}</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Occupation Sector</label>
                <select
                  id="profile-occupation-select"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-semibold text-slate-700"
                  value={profile.occupation}
                  onChange={(e) => setProfile({ ...profile, occupation: e.target.value as any })}
                >
                  <option value="Farmer">Farmer (Cultivator)</option>
                  <option value="Student">Student / Scholar</option>
                  <option value="Salaried">Salaried Employee</option>
                  <option value="Self-Employed">Self-Employed / Vendor</option>
                  <option value="Unemployed">Unemployed / Labor</option>
                  <option value="Retired">Retired / Senior Citizen</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Social Category</label>
                  <select
                    id="profile-category-select"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-semibold text-slate-700"
                    value={profile.category}
                    onChange={(e) => setProfile({ ...profile, category: e.target.value as any })}
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Specially Abled</label>
                  <div className="flex items-center mt-2">
                    <input
                      id="profile-disability-checkbox"
                      type="checkbox"
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                      checked={profile.disability}
                      onChange={(e) => setProfile({ ...profile, disability: e.target.checked })}
                    />
                    <span className="ml-2 font-medium text-slate-700">Divyangjan</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button
                id="recalc-recommendations-btn"
                onClick={() => {
                  fetchRecommendations();
                  addNotification("Matched schemes recalculated for updated demographic parameters!");
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Sync Schemes
              </button>
            </div>
          </div>

          {/* Quick Help Box */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white rounded-xl p-4 shadow-md border border-slate-800" id="smart-assistance-tip-box">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h4 className="font-bold text-xs tracking-wider uppercase text-amber-300">{t("voice_title")}</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {t("voice_desc")}
            </p>
            <div className="bg-indigo-950/80 p-2.5 rounded border border-indigo-800/60 font-mono text-[10px] text-indigo-300">
              <p className="font-bold text-indigo-200 mb-0.5">{t("hotline")}</p>
              <p>1800-300-4491 (SMS / Voice Fallback)</p>
            </div>
          </div>
        </section>

        {/* --- MAIN WORKSPACE (3 COLS) --- */}
        <section className="lg:col-span-3 flex flex-col gap-6" id="workspace-core-container">
          
          {/* =========================================================
              TAB 2: SCHEMES & RECOMMENDATIONS
              ========================================================= */}
          {activeTab === "schemes" && (
            <div className="flex flex-col gap-6" id="schemes-recommendations-module">
              {/* Summary overview */}
              <div className="bg-gradient-to-r from-emerald-700 to-indigo-950 text-white rounded-xl p-5 shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-lg md:text-xl tracking-tight">{t("schemes_header")}</h3>
                    <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">
                      {t("schemes_sub")}
                    </p>
                  </div>
                  <Award className="h-10 w-10 text-amber-400 shrink-0 opacity-80" />
                </div>
                {recommendationSummary && (
                  <div className="mt-4 pt-3.5 border-t border-emerald-600/50 text-xs md:text-sm text-slate-100 font-medium leading-relaxed bg-white/5 p-3 rounded-lg">
                    {recommendationSummary}
                  </div>
                )}
              </div>

              {/* Matched Schemes grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="matched-schemes-grid">
                {loadingSchemes ? (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200">
                    <RefreshCw className="h-8 w-8 text-indigo-950 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-bold">{t("scanning_db")}</p>
                  </div>
                ) : recommendedSchemes.length === 0 ? (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200">
                    <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-bold">{t("no_matches")}</p>
                  </div>
                ) : (
                  recommendedSchemes.map((scheme: any) => (
                    <div
                      key={scheme.id}
                      className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                        selectedScheme?.id === scheme.id ? "border-orange-500 ring-1 ring-orange-400" : "border-slate-200"
                      }`}
                      onClick={() => setSelectedScheme(scheme)}
                      id={`scheme-card-${scheme.id}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase border border-emerald-100">
                          {scheme.matchScore}% {t("match_score")}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{scheme.ministry}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm md:text-base mb-2 line-clamp-2">{scheme.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">{scheme.matchReason}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                        <div className="flex -space-x-1">
                          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center">1</span>
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center justify-center">2</span>
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">3</span>
                        </div>
                        <span className="text-xs font-bold text-indigo-900 flex items-center gap-0.5">
                          {t("analyze_checklist")} <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Selection details */}
              {selectedScheme && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5" id="scheme-details-drawer">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{selectedScheme.ministry}</span>
                      <h3 className="font-black text-slate-900 text-base md:text-lg mt-2">{selectedScheme.name}</h3>
                    </div>
                    <button
                      id="close-scheme-details-btn"
                      onClick={() => setSelectedScheme(null)}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Scheme Summary */}
                  <div className="text-xs md:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-800 mb-1">{t("scheme_overview")}</p>
                    {selectedScheme.matchReason || "No custom reasons needed."}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Benefits list */}
                    <div className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-100" id="scheme-benefits-sublist">
                      <h4 className="font-extrabold text-emerald-950 text-sm mb-3 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        {t("benefits_title")}
                      </h4>
                      <ul className="space-y-2 text-xs md:text-sm text-slate-700">
                        {(selectedScheme.benefits || []).map((b: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Checklists */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200" id="scheme-checklist-sublist">
                      <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-orange-500" />
                        {t("checklist_title")}
                      </h4>
                      <ul className="space-y-2 text-xs md:text-sm text-slate-700">
                        {(selectedScheme.checklist || []).map((c: string, i: number) => (
                          <li key={i} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
                            <span className="font-medium">{c}</span>
                            <button
                              id={`verify-shortcut-${i}`}
                              onClick={() => {
                                setSelectedDocType(c.toLowerCase().includes("aadhaar") ? "aadhaar" : "income");
                                setOcrText(c.toLowerCase().includes("aadhaar") ? SAMPLE_DOCUMENTS[0].placeholderText : SAMPLE_DOCUMENTS[1].placeholderText);
                                setActiveTab("ocr");
                              }}
                              className="text-[10px] text-indigo-700 hover:underline font-bold"
                            >
                              {t("verify_ocr")}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Guided Procedural Steps */}
                  <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4" id="scheme-steps-sublist">
                    <h4 className="font-extrabold text-indigo-950 text-sm mb-3 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-600 animate-pulse" />
                      {t("walkthrough_title")}
                    </h4>
                    <div className="relative border-l border-slate-200 pl-4 ml-2.5 space-y-4">
                      {[(selectedScheme.steps || ["Search on PM-JAY website.", "Verify bio-metric.", "Avail benefits."])].flat().map((step: string, i: number) => (
                        <div key={i} className="relative">
                          <span className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-indigo-950 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                            {i + 1}
                          </span>
                          <p className="text-xs md:text-sm text-slate-800 font-medium pl-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock Apply Trigger */}
                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      id="apply-online-simulation-btn"
                      onClick={() => {
                        alert(`Application for ${selectedScheme.name} initiated! Seeded biometric credentials sent to the respective ministry server.`);
                        addNotification(`Application for ${selectedScheme.name} registered under tracking code SB-APP-${Math.floor(1000 + Math.random() * 9000)}`);
                      }}
                      className="bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-lg shadow transition-colors"
                    >
                      {t("begin_app")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "complaints" && (
            <div className="flex flex-col gap-6" id="grievance-reporting-module">
              {/* Submission Form Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-extrabold text-slate-900 text-base mb-1.5 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  {t("grievance_title")}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {t("grievance_sub")}
                </p>

                <form onSubmit={handleComplaintSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t("grievance_desc_label")}</label>
                    <textarea
                      id="complaint-desc-textarea"
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-800"
                      placeholder={t("grievance_desc_placeholder")}
                      value={newComplaintDesc}
                      onChange={(e) => setNewComplaintDesc(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{t("category_override")}</label>
                      <select
                        id="complaint-category-select"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700"
                        value={newComplaintCategory}
                        onChange={(e) => setNewComplaintCategory(e.target.value)}
                      >
                        <option value="">{t("complaint_category_default")}</option>
                        <option value="Roads & Potholes">Roads & Potholes</option>
                        <option value="Water Supply">Water Supply</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Sanitation & Garbage">Sanitation & Garbage</option>
                        <option value="Corruption">Corruption / Misbehavior</option>
                        <option value="Other">Other Miscellaneous</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{t("image_attach_label")}</label>
                      <div className="flex gap-2">
                        <button
                          id="capture-complaint-photo-btn"
                          type="button"
                          onClick={() => {
                            const cat = newComplaintCategory || "Roads & Potholes";
                            handleSimulatedImageUpload(cat);
                          }}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg p-2.5 text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <Upload className="h-4 w-4 text-slate-500" />
                          {t("simulate_camera")}
                        </button>
                        {newComplaintImage && (
                          <div className="h-10 w-10 border border-slate-200 rounded overflow-hidden shadow-inner shrink-0 bg-slate-100 flex items-center justify-center">
                            <img src={newComplaintImage} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Geotagging information bar */}
                  <div className="bg-slate-100 p-3 rounded-lg flex flex-wrap gap-4 text-[11px] text-slate-500 border border-slate-200 font-mono">
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-indigo-700" /> City: {newComplaintCity}
                    </span>
                    <span>State: {newComplaintState}</span>
                    <span>Zone: {newComplaintRegion}</span>
                    <span>Lat: {newComplaintLat}</span>
                    <span>Lng: {newComplaintLng}</span>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex justify-end pt-2">
                    <button
                      id="submit-grievance-btn"
                      type="submit"
                      disabled={submittingComplaint}
                      className="bg-indigo-950 hover:bg-indigo-900 disabled:bg-slate-400 text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      {submittingComplaint ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> {t("complaint_btn_submitting")}
                        </>
                      ) : (
                        <>
                          {t("submit_grievance")}
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Duplicate Merging Notification Alert */}
                {duplicateAlert && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg" id="duplicate-warning-banner">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wide">{t("duplicate_alert_title")}</h4>
                        <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                          {t("duplicate_alert_desc").replace("{ticketId}", duplicateAlert.ticketId)}
                        </p>
                        <div className="mt-3 bg-white p-2.5 rounded border border-amber-100 font-mono text-[11px] text-slate-600">
                          <p className="font-bold">Parent Ticket: {duplicateAlert.ticketId}</p>
                          <p className="line-clamp-2">Original: {duplicateAlert.description}</p>
                          <p className="mt-1">Current Status: <span className="font-bold text-indigo-700">{duplicateAlert.status}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submission Success Box */}
                {complaintSuccessTicket && !duplicateAlert && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs" id="grievance-success-banner">
                    <p className="font-bold">{t("complaint_success_title")}</p>
                    <p className="mt-1">Ticket Reference: <span className="font-mono font-bold text-emerald-800">{complaintSuccessTicket}</span></p>
                    <p className="mt-0.5">{t("complaint_success_desc")}</p>
                  </div>
                )}
              </div>

              {/* Citizen Personal Complaint List */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{t("history_title")}</h3>
                    <p className="text-[10px] text-slate-400">{t("history_sub")}</p>
                  </div>

                  {/* Filters */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs" id="history-filter-toggle">
                    {["all", "submitted", "assigned", "resolved"].map((f) => (
                      <button
                        key={f}
                        id={`filter-${f}-btn`}
                        onClick={() => setComplaintFilter(f)}
                        className={`px-2.5 py-1 rounded font-bold capitalize ${
                          complaintFilter === f ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4" id="complaints-history-list">
                  {filteredComplaints.length === 0 ? (
                    <p className="text-center text-slate-400 text-xs py-6 font-medium">{t("no_complaints_match")}</p>
                  ) : (
                    filteredComplaints.map((comp) => (
                      <div key={comp.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50" id={`history-card-${comp.id}`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-200/60 pb-2.5 mb-2.5">
                          <div>
                            <span className="text-[11px] font-mono font-bold text-indigo-700">{comp.ticketId}</span>
                            <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{comp.category}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              comp.status === "Resolved" ? "bg-emerald-100 text-emerald-800" :
                              comp.status === "Assigned" ? "bg-indigo-100 text-indigo-800" :
                              comp.status === "Under Investigation" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"
                            }`}>
                              {comp.status}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              comp.priority === "Critical" ? "bg-red-100 text-red-800 animate-pulse" :
                              comp.priority === "High" ? "bg-orange-100 text-orange-800" :
                              comp.priority === "Medium" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                            }`}>
                              Priority: {comp.priorityScore} ({comp.priority})
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mb-3">{comp.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[10px] text-slate-400 bg-white p-2.5 rounded border border-slate-200 font-semibold mb-3">
                          <div>
                            <span className="block text-slate-400 uppercase text-[8px] font-bold">Assigned Department</span>
                            <span className="text-slate-800">{comp.department}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 uppercase text-[8px] font-bold">Assigned Officer</span>
                            <span className="text-slate-800">{comp.assignedOfficer || "Triage Pending"}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 uppercase text-[8px] font-bold">Resolution SLA Deadline</span>
                            <span className="text-indigo-700 font-bold">{comp.slaDays} Days Remaining</span>
                          </div>
                        </div>

                        {/* Complaint Audit Timeline Trail */}
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold mb-1.5">Action Audit Timeline Log</p>
                          <div className="space-y-2 border-l border-slate-300 pl-3.5 ml-1">
                            {comp.history.map((hist, index) => (
                              <div key={index} className="relative text-[11px]">
                                <span className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-slate-400"></span>
                                <span className="font-bold text-slate-700 block">{hist.status} <span className="text-[10px] text-slate-400 font-normal ml-2">{new Date(hist.date).toLocaleString()}</span></span>
                                <span className="text-slate-500">{hist.remarks}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 4: AI DOCUMENT ASSISTANCE (OCR VERIFY)
              ========================================================= */}
          {activeTab === "ocr" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5" id="document-ocr-module">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1.5 flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-emerald-600" />
                  {activeLang === "hi" ? "एआई-संचालित दस्तावेज़ सत्यापन (ओसीआर और सत्यापन)" : activeLang === "or" ? "ଏଆଇ-ଚାଳିତ ଦଲିଲ ଯାଞ୍ଚ (ଓସିଆର ଏବଂ ବୈଧତା)" : "AI-Powered Document Verification (OCR & Validation)"}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeLang === "hi" ? "ओसीआर का परीक्षण करने के लिए एक दस्तावेज़ चुनें। एआई क्रेडेंशियल निकालेगा, आपके आधार कार्ड डोजियर के खिलाफ नाम-मिलान ऑडिट करेगा।" : activeLang === "or" ? "ଓସିଆର ପରୀକ୍ଷା କରିବାକୁ ଏକ ଦଲିଲ ବାଛନ୍ତୁ। ଏଆଇ ତଥ୍ୟ ବାହାର କରିବ ଏବଂ ଆପଣଙ୍କ ଆଧାର କାର୍ଡ ଡୋସିଅର୍ ସହିତ ମେଳ କରିବ।" : "Select a document to test OCR. The AI will extract credentials, perform name-matching audits against your Aadhaar card dossier, and rate formatting completeness before submission."}
                </p>
              </div>

              {/* Document selection shortcuts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3" id="sample-docs-shortcuts">
                {SAMPLE_DOCUMENTS.map((doc) => (
                  <button
                    key={doc.id}
                    id={`shortcut-doc-${doc.id}`}
                    onClick={() => {
                      setSelectedDocType(doc.id);
                      setOcrText(doc.placeholderText);
                      setOcrResult(null);
                    }}
                    className={`p-3 text-left border rounded-xl transition-all ${
                      selectedDocType === doc.id
                        ? "border-emerald-600 bg-emerald-50/40 text-emerald-950"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-xs font-black">{doc.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">
                      {activeLang === "hi" ? "सिम्युलेटेड फ़ाइल टेक्स्ट लोड करने के लिए क्लिक करें" : activeLang === "or" ? "ସିମୁଲେଟେଡ୍ ଫାଇଲ୍ ଟେକ୍ସଟ୍ ଲୋଡ୍ କରିବାକୁ କ୍ଲିକ୍ କରନ୍ତୁ" : "Click to load simulated file text"}
                    </p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Text editor representing extracted OCR raw data */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500">
                    {activeLang === "hi" ? "दस्तावेज़ पाठ सामग्री (ओसीआर रीडआउट संपादक)" : activeLang === "or" ? "ଦଲିଲ ପାଠ୍ୟ ବିଷୟବସ୍ତୁ (ଓସିଆର ସମ୍ପାଦକ)" : "Document Text Content (OCR Readout Editor)"}
                  </label>
                  <textarea
                    id="ocr-text-editor"
                    rows={8}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700"
                    value={ocrText}
                    onChange={(e) => setOcrText(e.target.value)}
                  ></textarea>

                  <div className="flex justify-end">
                    <button
                      id="audit-ocr-btn"
                      onClick={handleDocumentOCRVerify}
                      disabled={verifyingDoc}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      {verifyingDoc ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> {activeLang === "hi" ? "ऑडिट सत्यापन चल रहा है..." : activeLang === "or" ? "ଯାଞ୍ଚ ଅଡିଟ୍ ଚାଲିଛି..." : "Performing Semantic OCR Audit..."}
                        </>
                      ) : (
                        <>
                          {activeLang === "hi" ? "ओसीआर ऑडिट सत्यापन चलाएं" : activeLang === "or" ? "ଓସିଆର ଅଡିଟ୍ ଯାଞ୍ચ କରନ୍ତୁ" : "Run OCR Audit Verification"}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Audit results */}
                <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 flex flex-col justify-between" id="ocr-audit-results">
                  {ocrResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide">
                          {activeLang === "hi" ? "ओसीआर ऑडिट निर्णय रिपोर्ट" : activeLang === "or" ? "ଓସିଆର ଅଡିଟ୍ ନିଷ୍ପତ୍ତି ରିପୋର୍ଟ" : "OCR Audit Verdict Report"}
                        </h4>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          ocrResult.verified ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>
                          {ocrResult.verified ? "VERIFIED / MATCHED" : "AUDIT REJECTED"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded border border-slate-200">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase">Extracted Name</span>
                          <span className="font-bold text-slate-700 truncate block">{ocrResult.extractedData.name || "N/A"}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded border border-slate-200">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase">Serial Identifier</span>
                          <span className="font-bold text-slate-700 truncate block">{ocrResult.extractedData.idNumber || "N/A"}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded border border-slate-200">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase">DOB Extracted</span>
                          <span className="font-bold text-slate-700 truncate block">{ocrResult.extractedData.dob || "N/A"}</span>
                        </div>
                        {ocrResult.extractedData.income && (
                          <div className="bg-white p-2.5 rounded border border-slate-200">
                            <span className="text-[9px] text-slate-400 block font-bold uppercase">Income Statement</span>
                            <span className="font-bold text-slate-700 truncate block">{ocrResult.extractedData.income}</span>
                          </div>
                        )}
                      </div>

                      {/* Explicit checklists */}
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold mb-1.5">Compliance Checks</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${ocrResult.checks.nameMatches ? "bg-emerald-500" : "bg-red-500"}`}></span>
                            <span className="font-medium text-slate-700">Dossier Name Matching</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${ocrResult.checks.formatValid ? "bg-emerald-500" : "bg-red-500"}`}></span>
                            <span className="font-medium text-slate-700">Serial Structure Valid</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${ocrResult.checks.hasStampSignature ? "bg-emerald-500" : "bg-red-500"}`}></span>
                            <span className="font-medium text-slate-700">Official Stamp/Signature</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${ocrResult.checks.dataCompleteness ? "bg-emerald-500" : "bg-red-500"}`}></span>
                            <span className="font-medium text-slate-700">Completeness Index</span>
                          </div>
                        </div>
                      </div>

                      {/* Feedback List */}
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold mb-1">Auditor Technical Feedback</p>
                        <ul className="text-xs text-slate-500 space-y-1">
                          {ocrResult.feedback.map((f, i) => (
                            <li key={i} className="flex gap-1.5">
                              <span className="text-slate-400 font-bold">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 my-auto text-slate-400 space-y-2">
                      <FileCheck2 className="h-10 w-10 mx-auto text-slate-300" />
                      <p className="text-xs font-bold">
                        {activeLang === "hi" ? "सत्यापन ऑडिट की प्रतीक्षा है" : activeLang === "or" ? "ଯାଞ୍ଚ ଅଡିଟ୍‌କୁ ଅପେକ୍ଷା କରାଯାଇଛି" : "Await Verification Audit"}
                      </p>
                      <p className="text-[10px] max-w-xs mx-auto">
                        {activeLang === "hi" ? "दस्तावेज़ कार्ड चुनें या अनुकूल पाठ पेस्ट करें, फिर ऑडिट चलाने के लिए 'ओसीआर ऑडिट चलाएं' टैप करें।" : activeLang === "or" ? "ଦଲିଲ କାର୍ଡ ଚୟନ କରନ୍ତୁ କିମ୍ବା ପାଠ୍ୟ ପେଷ୍ଟ କରନ୍ତୁ, ଏବଂ ଅଡିଟ୍ ଚଲାଇବା ପାଇଁ 'ଓସିଆର ଅଡିଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ' କ୍ଲିକ୍ କରନ୍ତୁ।" : "Select a document card or paste custom extracted text, then tap 'Run OCR Audit' to execute the validation loop."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 5: TRANSPARENCY & STATS DASHBOARD
              ========================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6" id="dashboard-stats-module">
              {/* Aggregated general numbers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="dashboard-general-counters">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">Total Grievances Filed</span>
                  <span className="text-xl md:text-2xl font-black text-slate-900 mt-1 block">{stats.total || 4}</span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Live from MCGM/BESCOM</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">Incidents Resolved</span>
                  <span className="text-xl md:text-2xl font-black text-slate-900 mt-1 block">{stats.resolved || 1}</span>
                  <span className="text-[10px] text-slate-500 font-bold mt-1 block">SLA Target Achieved</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">Pending Redressals</span>
                  <span className="text-xl md:text-2xl font-black text-slate-900 mt-1 block">{stats.pending || 3}</span>
                  <span className="text-[10px] text-amber-600 font-bold mt-1 block">Assigned / Under Triage</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">Average Priority Score</span>
                  <span className="text-xl md:text-2xl font-black text-slate-900 mt-1 block">{stats.avgPriority || 74} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
                  <span className="text-[10px] text-indigo-700 font-bold mt-1 block">Critically Managed Severity</span>
                </div>
              </div>

              {/* Graphical distribution cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Distribution Chart by Category */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="border-b border-slate-100 pb-2.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">Category Allocation Breakdown</h4>
                    <p className="text-[10px] text-slate-400">Distribution of public issues across state divisions</p>
                  </div>
                  <div className="h-60" id="category-distribution-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.categoryStats && stats.categoryStats.length ? stats.categoryStats : [
                        { name: "Roads & Potholes", value: 1 },
                        { name: "Water Supply", value: 1 },
                        { name: "Electricity", value: 1 },
                        { name: "Sanitation & Garbage", value: 1 }
                      ]}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#312e81" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Regional Trends */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="border-b border-slate-100 pb-2.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">Regional Hotspot Analysis</h4>
                    <p className="text-[10px] text-slate-400">Incident count by city and operational sub-zones</p>
                  </div>
                  <div className="h-60" id="regional-trends-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.regionalStats && stats.regionalStats.length ? stats.regionalStats : [
                        { city: "New Delhi", complaints: 1 },
                        { city: "Mumbai", complaints: 1 },
                        { city: "Bengaluru", complaints: 1 },
                        { city: "Kolkata", complaints: 1 }
                      ]}>
                        <XAxis dataKey="city" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="complaints" fill="#ea580c" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 6: ADMIN / GOVERNMENT TRIAGE PANEL
              ========================================================= */}
          {activeTab === "admin" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5" id="admin-triage-panel">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded font-bold uppercase tracking-wider">Administrative Access</span>
                  <h3 className="font-black text-slate-900 text-base md:text-lg mt-2">Municipal Triage Control Dashboard</h3>
                </div>
                <span className="text-xs bg-slate-100 border px-3 py-1.5 rounded-lg font-bold text-slate-700">Official Role Assigned</span>
              </div>

              {/* Triage summary explanation */}
              <div className="bg-indigo-950 text-indigo-100 p-4 rounded-xl text-xs space-y-2">
                <p className="font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="h-4 w-4" /> AI-Assisted Severity Scoring Operational
                </p>
                <p className="leading-relaxed">
                  Every submitted civic complaint passes through Google Gemini 3.5 Flash to automatically score priorities (1-100 index) based on hazard severity, public density, recurring issues, and sentiment analysis of citizen feedback, ensuring seamless escalations.
                </p>
              </div>

              {/* List of complaints for officials to interact with */}
              <div className="space-y-4" id="triage-complaints-list">
                {complaints.map((comp) => (
                  <div key={comp.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col md:flex-row justify-between gap-4 items-start" id={`admin-triage-card-${comp.id}`}>
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-900">{comp.ticketId}</span>
                        <span className="text-[10px] text-slate-400 font-bold">•</span>
                        <span className="text-xs font-extrabold text-slate-800">{comp.category}</span>
                        <span className="text-[10px] text-slate-400 font-bold">•</span>
                        <span className="text-xs text-slate-500 font-medium">{comp.city}, {comp.state}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded border border-slate-200">{comp.description}</p>

                      <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-slate-600">
                        <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-slate-400" /> Dept: {comp.department}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> Remaining SLA: {comp.slaDays} Days</span>
                        <span className="flex items-center gap-1 text-indigo-700"><User className="h-3.5 w-3.5 text-indigo-600" /> Assigned: {comp.assignedOfficer || "Triage Pending"}</span>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-end gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Severity Score</span>
                        <span className={`text-xl font-black ${
                          comp.priorityScore >= 80 ? "text-red-600" : comp.priorityScore >= 60 ? "text-orange-600" : "text-slate-700"
                        }`}>
                          {comp.priorityScore} / 100
                        </span>
                      </div>

                      <div className="flex gap-1">
                        {comp.status !== "Resolved" ? (
                          <button
                            id={`resolve-btn-${comp.id}`}
                            onClick={() => {
                              const updated = complaints.map((c) => {
                                if (c.id === comp.id) {
                                  return {
                                    ...c,
                                    status: "Resolved" as const,
                                    history: [
                                      ...c.history,
                                      { status: "Resolved" as const, date: new Date().toISOString(), remarks: "Marked as completed by official admin supervisor." }
                                    ]
                                  };
                                }
                                return c;
                              });
                              setComplaints(updated);
                              addNotification(`Grievance ${comp.ticketId} marked as Resolved!`);
                              fetchStats();
                            }}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-sm"
                          >
                            Resolve Ticket
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-800 bg-emerald-100 font-bold px-2.5 py-1 rounded-md">Ticket Resolved</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 7: SYSTEM DESIGN & API SPECIFICATIONS
              ========================================================= */}
          {activeTab === "architecture" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6" id="architecture-module">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base md:text-lg mb-1 flex items-center gap-2">
                  <Code className="h-5.5 w-5.5 text-indigo-700" />
                  Smart Bharat: Production Architecture Specifications
                </h3>
                <p className="text-xs text-slate-400">
                  Detailed technical service blueprint, API contracts, and secure data flow structures compliant with India's DPDP Act 2023.
                </p>
              </div>

              {/* --- SVG DATA FLOW DIAGRAM --- */}
              <div className="border border-slate-200 rounded-xl bg-slate-900 p-4 overflow-x-auto" id="data-flow-diagram">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-orange-500" />
                  Modular Service Data Flow Diagram
                </h4>
                
                <div className="min-w-[650px] flex justify-center py-4">
                  <svg width="650" height="280" viewBox="0 0 650 280" className="mx-auto" id="svg-blueprint-diagram">
                    {/* Citizen Web UI */}
                    <rect x="20" y="90" width="120" height="80" rx="8" fill="#1e1b4b" stroke="#4338ca" strokeWidth="2" />
                    <text x="80" y="130" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Citizen React App</text>
                    <text x="80" y="145" fill="#a5b4fc" fontSize="9" textAnchor="middle">(Tailwind / Web Client)</text>

                    {/* Edge Router */}
                    <path d="M 180,90 L 220,110 L 220,150 L 180,170 L 140,150 L 140,110 Z" fill="#c2410c" stroke="#ea580c" strokeWidth="2" />
                    <text x="180" y="134" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Nginx Gateway</text>

                    {/* Services Box */}
                    <rect x="270" y="20" width="180" height="70" rx="8" fill="#111827" stroke="#374151" strokeWidth="2" />
                    <text x="360" y="45" fill="#e5e7eb" fontSize="11" fontWeight="bold" textAnchor="middle">1. AI Cognitive Service</text>
                    <text x="360" y="60" fill="#9ca3af" fontSize="9" textAnchor="middle">(Gemini 3.5 / Indic TTS)</text>

                    <rect x="270" y="105" width="180" height="70" rx="8" fill="#111827" stroke="#374151" strokeWidth="2" />
                    <text x="360" y="130" fill="#e5e7eb" fontSize="11" fontWeight="bold" textAnchor="middle">2. Incident Triage Service</text>
                    <text x="360" y="145" fill="#9ca3af" fontSize="9" textAnchor="middle">(Express / Grievances)</text>

                    <rect x="270" y="190" width="180" height="70" rx="8" fill="#111827" stroke="#374151" strokeWidth="2" />
                    <text x="360" y="215" fill="#e5e7eb" fontSize="11" fontWeight="bold" textAnchor="middle">3. Schemes Engine</text>
                    <text x="360" y="230" fill="#9ca3af" fontSize="9" textAnchor="middle">(Demographic Matcher)</text>

                    {/* Databases / Storage */}
                    <rect x="510" y="105" width="120" height="70" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="2" />
                    <text x="570" y="135" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Unified Database</text>
                    <text x="570" y="150" fill="#a7f3d0" fontSize="9" textAnchor="middle">(PostgreSQL & Vector)</text>

                    {/* Lines and Connections */}
                    {/* UI -> Gateway */}
                    <line x1="140" y1="130" x2="160" y2="130" stroke="#a5b4fc" strokeWidth="2" markerEnd="url(#arrow)" />
                    {/* Gateway -> Services */}
                    <path d="M 200,130 L 250,130" fill="none" stroke="#ea580c" strokeWidth="2" />
                    <path d="M 250,55 L 270,55" fill="none" stroke="#374151" strokeWidth="2" />
                    <path d="M 250,130 L 270,130" fill="none" stroke="#374151" strokeWidth="2" />
                    <path d="M 250,215 L 270,215" fill="none" stroke="#374151" strokeWidth="2" />
                    <line x1="250" y1="55" x2="250" y2="215" stroke="#374151" strokeWidth="2" />

                    {/* Services -> Database */}
                    <path d="M 450,55 L 480,55 L 480,140 L 510,140" fill="none" stroke="#059669" strokeWidth="2" />
                    <path d="M 450,140 L 510,140" fill="none" stroke="#059669" strokeWidth="2" />
                    <path d="M 450,215 L 480,215 L 480,140 L 510,140" fill="none" stroke="#059669" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Service Definition breakdown */}
              <div className="space-y-6" id="service-definition-breakdown">
                {services.map((srv, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4" id={`spec-service-${idx}`}>
                    <div className="border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-indigo-700" />
                        <h4 className="font-extrabold text-slate-900 text-sm md:text-base">{srv.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{srv.description}</p>
                      <p className="text-[10px] font-mono text-indigo-900 mt-1 font-bold">Tech Stack: {srv.techStack}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold mb-1.5">Core System Responsibilities</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                        {srv.responsibilities.map((resp, i) => (
                          <li key={i} className="flex gap-1.5 bg-white p-2 rounded border border-slate-100">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* API CONTRACTS DETAIL */}
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold mb-2">Service Endpoints & API Contracts</p>
                      <div className="space-y-3">
                        {srv.contracts.map((con, cidx) => (
                          <div key={cidx} className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-2.5 text-xs font-mono" id={`spec-contract-${idx}-${cidx}`}>
                            <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] border-b border-slate-800 pb-2">
                              <span className="text-slate-200 font-bold text-xs">{con.name}</span>
                              <span className="text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/60 font-bold">
                                {con.method} {con.endpoint}
                              </span>
                            </div>

                            <p className="text-slate-400 font-sans leading-relaxed text-[11px]">{con.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                              <div>
                                <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1 font-sans">Request Payloads</span>
                                <pre className="bg-slate-950/80 p-2 rounded text-[10px] text-slate-300 overflow-x-auto max-h-40 border border-slate-900 scrollbar-none">{con.requestBody}</pre>
                              </div>
                              <div>
                                <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1 font-sans">Response Metrics</span>
                                <pre className="bg-slate-950/80 p-2 rounded text-[10px] text-emerald-300 overflow-x-auto max-h-40 border border-slate-900 scrollbar-none">{con.responseBody}</pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

      </main>

      {/* --- PLATFORM FOOTER --- */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center text-slate-400 text-xs mt-auto" id="smart-bharat-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-semibold">
          <p>© 2026 National Informatics Centre (NIC), Ministry of Electronics & IT (MeitY). Powered by Google Gemini.</p>
          <div className="flex gap-4">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("National Data Policy compliant under DPDP Act 2023."); }} className="hover:text-white transition-colors">DPDP Compliance 2023</a>
            <span className="text-slate-700">|</span>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Open Government Data (OGD) License 1.0 active."); }} className="hover:text-white transition-colors">OGD License Terms</a>
          </div>
        </div>
      </footer>

      {/* --- FLOATING AI ASSISTANT WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="floating-chat-container">
        {isChatOpen && (
          <div className="w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300" id="companion-chat-module">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-indigo-950 text-white rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                <div>
                  <h3 className="font-bold text-xs md:text-sm">{t("chat_header")}</h3>
                  <p className="text-[10px] text-slate-300 font-medium">Grounded Official Gazette Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-indigo-200 bg-indigo-900/50 font-bold px-2 py-0.5 rounded-full border border-indigo-800">
                  {activeLang}
                </span>
                <button
                  id="minimize-chat-btn"
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 hover:bg-indigo-900 rounded-lg text-slate-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" id="chat-messages-container">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  id={`chat-msg-${msg.id}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-sm border ${
                      msg.role === "user"
                        ? "bg-indigo-950 text-white border-slate-800 rounded-tr-none"
                        : "bg-white text-slate-800 border-slate-200 rounded-tl-none"
                    }`}
                  >
                    {/* Meta info */}
                    <div className="flex items-center justify-between gap-6 mb-1 border-b pb-1 border-dashed border-slate-100/10 text-[10px] text-slate-400 font-semibold font-mono">
                      <span className="capitalize">{msg.role === "user" ? "Citizen" : "Smart Bharat AI"}</span>
                      <div className="flex items-center gap-1.5">
                        <span>{msg.timestamp}</span>
                        {msg.role === "model" && (
                          <button
                            id={`speak-btn-${msg.id}`}
                            onClick={() => triggerTTS(msg.content)}
                            className={`p-1 rounded hover:bg-slate-100 text-indigo-600 transition-colors ${
                              ttsPlaying === msg.content ? "bg-amber-100 animate-pulse text-amber-700" : ""
                            }`}
                            title="Speech-to-Text translation audio read-aloud"
                          >
                            <Volume2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans" id={`chat-content-${msg.id}`}>
                      {msg.content}
                    </div>

                    {/* Classified Intent Badge & Actions */}
                    {msg.role === "model" && (msg.intent || msg.suggestedAction) && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between">
                        {msg.intent && (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            Intent: {msg.intent}
                          </span>
                        )}

                        {msg.suggestedAction && (
                          <button
                            id={`suggested-act-${msg.id}`}
                            onClick={() => triggerSuggestedAction(msg.suggestedAction)}
                            className="text-[10px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-1 rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1"
                          >
                            <span>{msg.suggestedAction.label || "Take Recommended Action"}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-500 border border-slate-200 rounded-2xl rounded-tl-none p-3 max-w-[80%] shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-950 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs font-medium">Processing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat suggestions pills */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-none" id="chat-quick-suggestions">
              <button
                id="suggest-pmjay-btn"
                onClick={() => handleSendMessage("Am I eligible for Ayushman Bharat PM-JAY health assurance scheme?")}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full px-2.5 py-1 text-[10px] font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1"
              >
                🏥 PM-JAY Info
              </button>
              <button
                id="suggest-pmkisan-btn"
                onClick={() => handleSendMessage("What land documentation do I need to apply for PM-KISAN subsidy scheme?")}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full px-2.5 py-1 text-[10px] font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1"
              >
                🌾 PM-KISAN Docs
              </button>
              <button
                id="suggest-pothole-btn"
                onClick={() => handleSendMessage("I want to complain about bad potholes and water logging on my street.")}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full px-2.5 py-1 text-[10px] font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1"
              >
                🕳️ Pothole Grievance
              </button>
            </div>

            {/* Chat Input form */}
            <div className="p-2.5 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  id="chat-message-input"
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                />
                <button
                  id="chat-send-btn"
                  onClick={() => handleSendMessage()}
                  className="bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl px-3 flex items-center justify-center transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Bubble Button */}
        <button
          id="floating-chat-toggle-btn"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-indigo-950 hover:bg-indigo-900 text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 border-2 border-white group"
          title="Open Smart Bharat AI Assistant"
        >
          {isChatOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white animate-pulse"></span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
