'use strict';
/**
 * formKit — a tiny toolkit for building rich Google Forms via the Forms API (v1).
 *
 * Why this exists: the Forms API can do far more than most wrappers expose
 * (checkboxes, linear scales, paragraphs, "Other", sections, and section-level
 * branching), but the request shapes are fiddly and ordering matters. These
 * helpers produce correct Item objects and handle the one non-obvious trick
 * needed for branching — see createForm().
 */
const { google } = require('googleapis');

// Scopes needed to create/edit forms and (optionally) rename the Drive file.
const SCOPES = [
  'https://www.googleapis.com/auth/forms',
  'https://www.googleapis.com/auth/drive',
];

/** Build an OAuth2 client from environment variables. */
function authClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error(
      'Missing Google OAuth credentials. Copy .env.example to .env and set ' +
      'GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REFRESH_TOKEN (see README).'
    );
  }
  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return auth;
}

/** Authenticated Forms API client. */
const formsClient = () => google.forms({ version: 'v1', auth: authClient() });

// ---------------------------------------------------------------------------
// Option helpers (for RADIO / CHECKBOX questions)
// ---------------------------------------------------------------------------
const option = v => (typeof v === 'string' ? { value: v } : v);
/** An "Other" write-in option. Note: it must NOT also carry a `value`. */
const other = () => ({ isOther: true });
/** A choice that routes to a section (pass the section's itemId). */
const toSection = (value, sectionId) => ({ value, goToSectionId: sectionId });
/** A choice that submits the form immediately. */
const toSubmit = value => ({ value, goToAction: 'SUBMIT_FORM' });

// ---------------------------------------------------------------------------
// Item builders — each returns an Item object (no location; createForm places it)
// ---------------------------------------------------------------------------
function choice(type, title, options, { required = true, description } = {}) {
  return {
    ...(description ? { description } : {}),
    title,
    questionItem: { question: { required, choiceQuestion: { type, options: options.map(option) } } },
  };
}
const radio = (title, options, opt) => choice('RADIO', title, options, opt);
const checkboxes = (title, options, opt) => choice('CHECKBOX', title, options, opt);

const scale = (title, { low = 1, high = 5, lowLabel, highLabel } = {}) => ({
  title,
  questionItem: { question: { required: true, scaleQuestion: { low, high, lowLabel, highLabel } } },
});

const paragraph = (title, { required = true, description } = {}) => ({
  ...(description ? { description } : {}),
  title,
  questionItem: { question: { required, textQuestion: { paragraph: true } } },
});

const shortText = (title, { required = true, description } = {}) => ({
  ...(description ? { description } : {}),
  title,
  questionItem: { question: { required, textQuestion: { paragraph: false } } },
});

/**
 * A section break (new page). `itemId` is an id YOU choose (e.g. a short hex
 * string) so that choice options can route to it via toSection(value, itemId).
 */
const section = (itemId, title, description) => ({
  itemId,
  title,
  ...(description ? { description } : {}),
  pageBreakItem: {},
});

/**
 * Create a form and populate it in a single batchUpdate.
 *
 *   items: an ordered array of Item objects (section()/radio()/checkboxes()/…).
 *
 * The trick: Forms only supports forward jumps, and `goToSectionId` must
 * reference an item that already exists. We insert items BOTTOM-UP (each at
 * location index 0), so by the time an option referencing a later section is
 * created, that section is already in the form. As long as every route points
 * to a section that appears LATER in `items` than the question, one batch works.
 *
 * Returns { formId, editUrl, responderUri }.
 */
async function createForm(forms, { title, documentTitle, description, items }) {
  const created = await forms.forms.create({
    requestBody: { info: { title, ...(documentTitle ? { documentTitle } : {}) } },
  });
  const formId = created.data.formId;

  const requests = [];
  if (description) requests.push({ updateFormInfo: { info: { description }, updateMask: 'description' } });
  for (const item of items.slice().reverse()) requests.push({ createItem: { item, location: { index: 0 } } });

  await forms.forms.batchUpdate({ formId, requestBody: { requests } });
  return {
    formId,
    editUrl: `https://docs.google.com/forms/d/${formId}/edit`,
    responderUri: created.data.responderUri,
  };
}

module.exports = {
  SCOPES, authClient, formsClient,
  option, other, toSection, toSubmit,
  radio, checkboxes, scale, paragraph, shortText, section,
  createForm,
};
