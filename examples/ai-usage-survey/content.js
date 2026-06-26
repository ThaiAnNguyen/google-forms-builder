'use strict';
/**
 * All copy + option lists for the example "AI & Agentic AI Usage Survey".
 * Two tracks (Data Analyst/Engineer, Software Engineer) share most questions;
 * the per-track variants live in `tracks`.
 *
 * This is a generic, illustrative survey included to demonstrate the toolkit —
 * adapt the copy and options to your own needs.
 */

// Section itemIds — chosen by us so options can route to them. Any unique
// strings work; these are simple and stable.
const S = {
  BACK: '10000001', KNOW: '10000002', TOOLS: '10000003', AGENTIC: '10000004',
  PRAC: '10000005', CAREER: '10000006', ROUTE: '10000007', SEC6: '10000008',
};

const baseTitle = 'AI & Agentic AI Usage Survey';

const intro =
  'This short survey helps us understand how people across the Data Analyst / Engineer and ' +
  'Software Engineer tracks are using AI and Agentic AI. It takes about 8–10 minutes. Your ' +
  'responses are anonymous and will be used only to improve our training program. By continuing, ' +
  'you consent to this use of your responses.';

const agenticDef =
  'Agentic AI refers to AI systems that can plan and carry out multi-step tasks on their own — ' +
  'making decisions, using tools, and completing a goal with minimal step-by-step instruction, ' +
  'rather than just answering a single prompt. Examples: ChatGPT Agents, Claude Code, Cursor, ' +
  'and workflow tools like n8n, Make or Zapier AI.';

// Forms API can't enforce a max-selection count — this note is shown to the
// respondent; the actual "Select at most 3" limit is set once in the UI.
const selectUpTo3 = '(Select up to 3.)';

// ---- shared option lists ----
const status = ['Student only', 'Student + working in a related role', 'Working in a related role', 'Career changer (moving into this field)'];
const years = ['None', 'Less than 1 year', '1–3 years', '3–5 years', '5+ years'];
const domains = ['Banking & Finance', 'Insurance', 'Retail & E-commerce', 'Marketing', 'Healthcare', 'Manufacturing', 'Mining & Resources', 'Energy & Utilities', 'Logistics & Supply Chain', 'Telecommunications', 'Government / Public Sector', 'Education', 'Technology / SaaS', 'Consulting / Professional Services'];
const learning = ['Self-learning (YouTube, blogs, documentation)', 'Internal company training', 'Online courses', 'University / college subjects', 'AI certification programs', 'No formal AI learning'];
const topics = ['Prompt Engineering', 'Generative AI', 'Large Language Models (LLMs)', 'Retrieval-Augmented Generation (RAG)', 'Agentic AI', 'AI Automation', 'AI Governance & Ethics', 'Machine Learning', 'Computer Vision', 'None of the above'];
const generalTools = ['ChatGPT', 'Gemini', 'Claude', 'Microsoft Copilot', 'Perplexity', 'NotebookLM'];
const frequency = ['Daily', 'Several times per week', 'Weekly', 'Monthly', 'Rarely', 'Never'];
const tasksShared = ['Learning new concepts / research', 'Summarization', 'Email & documentation writing', 'Meeting summaries'];
const platformsCore = ['ChatGPT Projects / Agents', 'Microsoft Copilot Agents', 'Claude Projects', 'n8n', 'Make', 'Zapier AI', 'LangChain', 'LangGraph', 'CrewAI', 'AutoGen', 'OpenAI API', 'MCP-based solutions', 'Custom in-house solutions'];
const percentage = ['0%', '1–25%', '26–50%', '51–75%', '76–100%'];
const challenges = ['Hallucinations / incorrect outputs', 'Data privacy / security concerns', 'Lack of domain knowledge', 'Writing good prompts', 'Integration with company systems', 'Cost', 'Governance / compliance restrictions'];
const productivity = ['None', 'Small (1–10%)', 'Moderate (11–25%)', 'Significant (26–50%)', 'Transformational (>50%)'];
const freqRequirements = ['Very frequently', 'Frequently', 'Sometimes', 'Rarely', 'Never'];
const employerSkills = ['Prompt Engineering', 'AI-assisted analytics', 'AI-assisted coding / development', 'AI automation', 'Agentic AI', 'AI governance', 'AI product knowledge', 'API integration', 'MCP Server', 'LLM application development'];

const tracks = {
  data: {
    suffix: 'Data Analyst / Engineer',
    roles: ['Data Analyst', 'BI / Reporting Analyst', 'Business Analyst', 'Data Engineer', 'Analytics Engineer', 'Data Scientist', 'Product Analyst'],
    toolsAppend: ['Power BI Copilot', 'Excel Copilot', 'Microsoft Fabric AI', 'Databricks AI Assistant', 'Snowflake Cortex', 'Claude Code', 'Google Antigravity', 'Codex'],
    tasksAppend: ['SQL generation', 'DAX generation', 'Python coding', 'Data cleaning', 'Dashboard development', 'Data interpretation', 'Report writing', 'Automation'],
    platformsAppend: ['Claude Code', 'Cursor', 'Google Antigravity', 'Codex'],
    agenticTasks: ['Multi-step research', 'Report generation', 'Automated workflows', 'Data collection', 'Data quality checking', 'Dashboard monitoring', 'Customer support', 'Personal productivity'],
    value: ['Excel', 'SQL', 'Power BI', 'Python', 'Data Visualization', 'Data Cleaning', 'Statistical Analysis', 'Storytelling & Insights'],
    q22: 'Q22. In your opinion, which AI skills should be added to Data Analyst / Engineer training programs for your field?',
    q24: 'Q24. What AI skills would you recommend current Data Analyst / Engineer students prioritize?',
  },
  swe: {
    suffix: 'Software Engineer',
    roles: ['Frontend Engineer', 'Backend Engineer', 'Full-stack Engineer', 'Mobile Engineer', 'DevOps / Platform Engineer', 'QA / Test Engineer', 'Software Engineer (general / not specialised)'],
    toolsAppend: ['GitHub Copilot', 'Cursor', 'Claude Code', 'Windsurf', 'Amazon Q Developer / CodeWhisperer', 'Tabnine / Codeium', 'Google Antigravity', 'Codex'],
    tasksAppend: ['Writing new code', 'Debugging / troubleshooting', 'Code review', 'Writing tests', 'Refactoring / optimisation', 'Code explanation / understanding a codebase', 'API / integration work', 'Automation / scripting'],
    platformsAppend: ['Cursor', 'Claude Code', 'GitHub Copilot Agents', 'Windsurf', 'Google Antigravity', 'Codex'],
    agenticTasks: ['Multi-step research', 'Multi-file code generation', 'Automated testing', 'Code migration / refactoring', 'CI/CD pipeline tasks', 'Bug investigation / triage', 'Monitoring & alerting', 'Personal productivity'],
    value: ['Writing new code', 'Debugging / troubleshooting', 'Code review', 'Writing tests', 'Refactoring / optimisation', 'Documentation', 'System / architecture design', 'DevOps / CI-CD', 'Learning new languages or frameworks'],
    q22: 'Q22. In your opinion, which AI skills should be added to Software Engineering training programs for your field?',
    q24: 'Q24. What AI skills would you recommend current Software Engineering students prioritize?',
  },
};

module.exports = {
  S, baseTitle, intro, agenticDef, selectUpTo3,
  status, years, domains, learning, topics, generalTools, frequency, tasksShared,
  platformsCore, percentage, challenges, productivity, freqRequirements, employerSkills,
  tracks,
};
