'use strict';
/**
 * Builds the two example survey forms (Data + Software Engineer tracks).
 *
 * Run:  npm run build:demo
 *
 * Structure highlights (a good reference for your own forms):
 *  - Sections via section(); all questions required.
 *  - "Other" via other(); linear scales via scale(); long answers via paragraph().
 *  - Branching: Q12 "Have you used Agentic AI?" routes "Never" past the whole
 *    "Agentic AI" section (Q13 platforms + Q14 agentic tasks) straight to Practice.
 *    Everyone still answers the general Q11 "What tasks do you use AI for?", which
 *    is placed BEFORE the routing question so the skip is one clean forward jump.
 *  - A final Yes/No question gates the working-professionals section, else submits.
 */
require('dotenv').config();
const FK = require('../../src/formKit');
const C = require('./content');
const { S } = C;

function buildItems(t) {
  const other = FK.other;
  return [
    FK.section(S.BACK, 'Background'),
      FK.radio('Q1. Which best describes your current status?', [...C.status, other()]),
      FK.radio('Q2. How many years of experience do you have in your field?', C.years),
      FK.checkboxes('Q3. Which domain(s) do you work or have experience in?', [...C.domains, other()]),
      FK.radio('Q4. Which role best describes you, or the role you are training toward?', [...t.roles, other()]),

    FK.section(S.KNOW, 'AI Knowledge & Learning'),
      FK.scale('Q5. How would you rate your overall AI knowledge?', { lowLabel: 'No knowledge', highLabel: 'Expert (could confidently teach others)' }),
      FK.checkboxes('Q6. Have you completed any AI-related learning?', C.learning),
      FK.checkboxes('Q7. Which AI topics have you learned about?', C.topics),
      FK.scale('Q8. How confident are you in evaluating whether AI-generated outputs are accurate?', { lowLabel: 'Not at all confident', highLabel: 'Very confident (I routinely verify and catch errors)' }),

    FK.section(S.TOOLS, 'AI Tools & Agentic AI Usage'),
      FK.checkboxes('Q9. Which AI tools do you actively use?', [...C.generalTools, ...t.toolsAppend, other()]),
      FK.radio('Q10. How frequently do you use AI in your studies or work?', C.frequency),
      FK.checkboxes('Q11. What tasks do you use AI for?', [...C.tasksShared, ...t.tasksAppend, other()]),
      FK.radio('Q12. Have you used Agentic AI solutions?', [
        FK.toSection('Yes, regularly', S.AGENTIC),
        FK.toSection('Yes, occasionally', S.AGENTIC),
        FK.toSection('Never', S.PRAC),
      ], { description: C.agenticDef }),

    FK.section(S.AGENTIC, 'Agentic AI'),
      FK.checkboxes('Q13. Which Agentic AI platforms / tools have you used?', [...C.platformsCore, ...t.platformsAppend, 'None']),
      FK.checkboxes('Q14. What tasks do you use Agentic AI for?', t.agenticTasks),

    FK.section(S.PRAC, 'AI in Your Practice'),
      FK.checkboxes('Q15. Where has AI provided you the most value?', t.value, { description: C.selectUpTo3 }),
      FK.radio('Q16. What percentage of your work is currently assisted by AI?', C.percentage),
      FK.checkboxes('Q17. What are the biggest challenges when using AI in your work?', C.challenges),
      FK.radio('Q18. How much productivity improvement has AI provided?', C.productivity),

    FK.section(S.CAREER, 'Career & Industry Awareness'),
      FK.scale('Q19. How important do you believe AI skills are for the future of your profession?', { lowLabel: 'Not important', highLabel: 'Essential' }),
      FK.radio('Q20. In job descriptions or interviews, how often do you see AI-related requirements?', C.freqRequirements),
      FK.checkboxes('Q21. Which AI skills do you believe employers value most?', C.employerSkills, { description: C.selectUpTo3 }),
      FK.paragraph(t.q22),

    FK.section(S.ROUTE, 'Final section', 'These last questions are for people currently working in a related role.'),
      FK.radio('Do you currently work in a related role?', [FK.toSection('Yes', S.SEC6), FK.toSubmit('No')]),

    FK.section(S.SEC6, 'Insights from Working Professionals', 'For working professionals only.'),
      FK.paragraph('Q23. How are you using AI in your daily work?'),
      FK.paragraph(t.q24),
      FK.paragraph('Q25. What common mistakes do you see people make when using AI?'),
  ];
}

async function main() {
  const forms = FK.formsClient();
  for (const t of [C.tracks.data, C.tracks.swe]) {
    const title = `${C.baseTitle} · ${t.suffix}`;
    const r = await FK.createForm(forms, { title, documentTitle: title, description: C.intro, items: buildItems(t) });
    console.log(`\n=== ${t.suffix} ===`);
    console.log('Form ID : ' + r.formId);
    console.log('Edit    : ' + r.editUrl);
    console.log('Live    : ' + r.responderUri);
  }
  console.log('\nManual follow-ups (Forms API cannot set these):');
  console.log('  • Set "Select at most 3" on Q15 & Q21  (question ⋮ → Response validation).');
  console.log('  • Confirm anonymity in Settings → Responses (collect email off, limit to 1 off).');
}

if (require.main === module) {
  main().catch(e => { console.error('Build failed:', e.errors || (e.response && e.response.data) || e.message || e); process.exit(1); });
}

module.exports = { buildItems };
