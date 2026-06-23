var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {  
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.js
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
app.use(import_express.default.json());
app.post("/api/consult", async (req, res) => {
  try {
    const { requirements, length, height, thickness, finish, insulation } = req.body;
    if (!requirements) {
      return res.status(400).json({ error: "Architectural requirements or query is required." });
    }
    const systemInstruction = `You are the lead Principal Structural Engineer & Chief Architect at Shree Infra, the global-pioneer in innovative, high-performance Precast Cement Foldable Wall Systems. 
    Your objective is to advise clients, interior designers, and structural contractors on engineering feasibility, panel sizing, sound attenuation/acoustics, wind-tolerances, visual integration, and tentative budget benchmarks.
    
    Product details:
    - Standard span heights: 1.8m to 4.5m
    - Standard panel thickness: 50mm (residential interior), 75mm (residential boundary/moderate acoustic), 100mm (high-acoustic/heavy-commercial), 120mm (industrial bulletproof/seismic).
    - Hardwares: Patented heavy-duty industrial overhead stainless-steel double-roller tracks. Floor guide tracks are optional (recessed slot, recommended for commercial high-traffic).
    - Thermal & Acoustic cores: Rockwool density 100kg/m3 or Polyurethane Foam (PUF) insulation.
    - Surface treatments: Board-formed wood, fluted columns, exposed raw architectural gray, sandblasted terracotta, green-reactive biophilic moss crevices.
    
    Please provide the consultation in very clean, nicely-structured Markdown. Do not include excessive conversational filler. Get straight to the technical, architectural, and financial synthesis!
    Include sections:
    1. **Engineering Feasibility & Sizing Validation**: Validate their lengths, heights, and panel division counts (usually panels are 0.9m to 1.2m wide; suggest the mathematically optimum accordion layout).
    2. **Acoustic & Thermal Performance Estimates**: Calculate or estimate the Sound Transmission Class (STC) rating (from 42dB to 58dB) and R-value based on their insulation choice.
    3. **Wind & Structural Safety Commentary**: Mention seismic, wind survival class (Class II or IV) and tracking overhead load-bearing recommendations.
    4. **Visual & Styling Integration**: Advise how their selected texture finish fits their setting.
    5. **Tentative Investment & Next Integration Milestones**: Provide a clear list of what steps to take next with Shree Infra's technical site team.
    
    Make the response highly professional, technical, inspiring and reassuring!`;
    const userPrompt = `A client requests a consultation for their project:
    - **Site & Custom Needs**: "${requirements}"
    - **Length of Wall**: ${length || "Not specified"} meters
    - **Height of Wall**: ${height || "Not specified"} meters
    - **Preferred Panel Thickness**: ${thickness || "Standard (75mm)"}
    - **Selected Visual Finish**: "${finish || "Raw Exposed Concrete"}"
    - **Insulation Core**: "${insulation || "No Insulation (solid precast)"}"
    
    Provide an engineering report and architectural configuration review.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    res.json({ report: response.text });
  } catch (error) {
    console.error("Gemini API Error in consult:", error);
    res.status(500).json({ error: error.message || "Failed to process structural calculation." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite dev server integrating...");
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Shree Infra server successfully listening on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
