'use client';

import {
  BUDGET_RANGE_LABELS,
  BUDGET_RANGES,
  CONTACT_FIELD_LIMITS,
  type ContactSubmissionField,
} from '@glitch-craft/contracts';
import { useActionState, useState } from 'react';

import { ArrowIcon } from '@/components/icons';

import { submitContactBrief } from './actions';
import { HONEYPOT_FIELD, initialContactFormState, type ContactFormState } from './form-state';

/** The project intake form. Works without JavaScript via the Server Action. */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactBrief,
    initialContactFormState,
  );
  // Editing the form hides the last result, like the original email-draft notice.
  const [dismissedState, setDismissedState] = useState<ContactFormState | null>(null);
  const showStatus = state.status !== 'idle' && state !== dismissedState;

  const values = state.status === 'invalid' || state.status === 'error' ? state.values : undefined;
  const fieldErrors = state.status === 'invalid' ? state.fieldErrors : {};

  const errorProps = (field: ContactSubmissionField) =>
    fieldErrors[field]
      ? { 'aria-invalid': true as const, 'aria-describedby': `${field}-error` }
      : undefined;

  return (
    <form
      className="contact-form"
      action={formAction}
      onChange={() => {
        if (showStatus) setDismissedState(state);
      }}
    >
      <div className="form-heading mono">
        <span>PROJECT INTAKE FORM</span>
        <span className="teal">[ DIRECT CHANNEL ]</span>
      </div>
      <div className="form-row">
        <label>
          <span>
            01 // AGENT NAME <b>*</b>
          </span>
          <input
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
            maxLength={CONTACT_FIELD_LIMITS.name}
            defaultValue={values?.name}
            {...errorProps('name')}
          />
          <FieldError field="name" message={fieldErrors.name} />
        </label>
        <label>
          <span>
            02 // EMAIL ADDRESS <b>*</b>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            maxLength={CONTACT_FIELD_LIMITS.email}
            defaultValue={values?.email}
            {...errorProps('email')}
          />
          <FieldError field="email" message={fieldErrors.email} />
        </label>
      </div>
      <label>
        <span>
          03 // MISSION BRIEF <b>*</b>
        </span>
        <textarea
          name="brief"
          placeholder="The big idea. The challenge. The ambition."
          required
          rows={4}
          maxLength={CONTACT_FIELD_LIMITS.brief}
          defaultValue={values?.brief}
          {...errorProps('brief')}
        />
        <FieldError field="brief" message={fieldErrors.brief} />
      </label>
      <label>
        <span>
          04 // BUDGET SCALE <b>*</b>
        </span>
        <div className="select-wrap">
          <select
            // React applies `defaultValue` to a <select> only on mount. Re-keying it on the
            // submitted value lets the automatic post-submit form reset restore that choice.
            key={values?.budget ?? ''}
            name="budget"
            defaultValue={values?.budget ?? ''}
            required
            {...errorProps('budget')}
          >
            <option value="" disabled>
              Select your range
            </option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {BUDGET_RANGE_LABELS[range]}
              </option>
            ))}
          </select>
        </div>
        <FieldError field="budget" message={fieldErrors.budget} />
      </label>
      <div className="form-honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="tactical-button transmit-button" type="submit" disabled={isPending}>
        <span>{isPending ? 'TRANSMITTING… //' : 'TRANSMIT DATA //'}</span>
        <ArrowIcon diagonal />
      </button>
      <p className="form-disclaimer mono">
        NO AUTO-REPLIES. JUST REAL CONVERSATIONS.
        <br />
        <span>Your brief is transmitted directly to the studio.</span>
      </p>
      {showStatus && <FormStatus state={state} />}
    </form>
  );
}

function FieldError({ field, message }: { field: ContactSubmissionField; message?: string }) {
  if (!message) return null;
  return (
    <small className="field-error" id={`${field}-error`}>
      {message}
    </small>
  );
}

function FormStatus({ state }: { state: ContactFormState }) {
  switch (state.status) {
    case 'success':
      return (
        <div className="form-status" role="status">
          <span className="mono">[ TRANSMISSION RECEIVED ]</span>
          <p>Your mission brief landed safely. We’ll be in touch.</p>
        </div>
      );
    case 'invalid':
      return (
        <div className="form-status form-status--error" role="alert">
          <span className="mono">[ TRANSMISSION INCOMPLETE ]</span>
          <p>Some fields need attention. Fix them and transmit again.</p>
        </div>
      );
    case 'error':
      return (
        <div className="form-status form-status--error" role="alert">
          <span className="mono">
            {state.reason === 'rate-limited' ? '[ CHANNEL BUSY ]' : '[ UPLINK FAILED ]'}
          </span>
          <p>
            {state.reason === 'rate-limited'
              ? 'Too many transmissions from your connection. Try again in a few minutes, or send your brief from your email app.'
              : 'We couldn’t transmit your brief. Try again, or send it from your email app instead.'}
          </p>
          <a href={state.mailto}>
            OPEN EMAIL DRAFT <ArrowIcon diagonal />
          </a>
        </div>
      );
    default:
      return null;
  }
}
