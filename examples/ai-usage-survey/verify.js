'use strict';
/**
 * Print a form's structure (sections, question types, routing) for sanity checks.
 * Usage:  node examples/ai-usage-survey/verify.js <formId>
 */
require('dotenv').config();
const FK = require('../../src/formKit');

const formId = process.argv[2];
if (!formId) { console.error('Usage: node examples/ai-usage-survey/verify.js <formId>'); process.exit(1); }

(async () => {
  const forms = FK.formsClient();
  const f = (await forms.forms.get({ formId })).data;
  console.log(f.info.title + '\n');
  f.items.forEach((it, i) => {
    if (it.pageBreakItem) { console.log(`\n[SECTION ${it.itemId}] ${it.title}`); return; }
    const q = it.questionItem.question;
    const kind = q.choiceQuestion ? q.choiceQuestion.type
      : q.scaleQuestion ? 'SCALE'
      : (q.textQuestion && q.textQuestion.paragraph) ? 'PARAGRAPH' : 'TEXT';
    const routes = q.choiceQuestion
      ? q.choiceQuestion.options.filter(o => o.goToSectionId || o.goToAction).map(o => `${o.value}→${o.goToAction || o.goToSectionId}`)
      : [];
    console.log(`  ${String(i).padStart(2)} ${kind}${routes.length ? ' [' + routes.join(', ') + ']' : ''}  ${it.title}`);
  });
})().catch(e => { console.error(e.errors || e.message); process.exit(1); });
