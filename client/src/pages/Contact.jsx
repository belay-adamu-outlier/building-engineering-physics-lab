import { useState } from 'react';
import styled from 'styled-components';
import Banner from '../components/Banner.jsx';
import Status from '../components/Status.jsx';
import { Page } from '../components/ui.js';
import { useApi } from '../hooks/useApi.js';
import { mailLink } from '../mailLink.js';

const hosted = import.meta.env.VITE_STATIC === 'true';

function buttonLabel(sending) {
  if (sending) {
    return 'Sending';
  }
  if (hosted) {
    return 'Email the lab';
  }
  return 'Send message';
}

const empty = {
  name: '',
  email: '',
  message: '',
  company: '',
};

const Split = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 2.5rem;
  margin-top: 2rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Facts = styled.dl`
  margin: 0;
`;

const Term = styled.dt`
  margin-top: 0.9rem;
  color: ${(p) => p.theme.red};
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Value = styled.dd`
  margin: 0.15rem 0 0;
`;

const Form = styled.form`
  display: grid;
  gap: 0.85rem;
`;

const Label = styled.label`
  display: grid;
  gap: 0.3rem;
  font-size: 0.92rem;
`;

const Field = styled.input`
  border: 1px solid ${(p) => p.theme.line};
  background: ${(p) => p.theme.card};
  color: inherit;
  font: inherit;
  padding: 0.65rem 0.7rem;
`;

const Area = styled.textarea`
  min-height: 9rem;
  border: 1px solid ${(p) => p.theme.line};
  background: ${(p) => p.theme.card};
  color: inherit;
  font: inherit;
  padding: 0.65rem 0.7rem;
  resize: vertical;
`;

const ErrorText = styled.span`
  color: ${(p) => p.theme.red};
  font-size: 0.86rem;
`;

const Button = styled.button`
  justify-self: start;
  border: 0;
  background: ${(p) => p.theme.red};
  color: #ffffff;
  font: inherit;
  padding: 0.7rem 1.1rem;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
`;

const Trap = styled.div`
  position: absolute;
  left: -9999px;
`;

const Success = styled.p`
  margin: 0;
  color: ${(p) => p.theme.heading};
  font-weight: 700;
`;

/** Office details and a message form. */
export default function Contact() {
  const profile = useApi('/api/profile');
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const ready = profile.status === 'ready';
  const person = ready ? profile.data : null;

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setSent(false);
    setErrors({});

    try {
      if (form.company) {
        setForm(empty);
        setSent(true);
        return;
      }
      if (!person) {
        return;
      }
      if (hosted) {
        window.location.href = mailLink(person.email, form);
        setSent(true);
        return;
      }
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await response.json();
      if (!response.ok) {
        setErrors(body.errors || {
          form: 'The message could not be sent.',
        });
        return;
      }
      setForm(empty);
      setSent(true);
    } catch {
      setErrors({ form: 'Could not reach the server.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Banner
        kicker="Contact"
        title="Write to the lab"
        summary={
          'The lab is in the Sustainable Energy Engineering '
          + 'building at SFU Surrey.'
        }
      />
      <Page>
      {profile.status === 'loading' ? (
        <Status>Loading contact details.</Status>
      ) : null}
      {profile.status === 'error' ? (
        <Status>{profile.error}</Status>
      ) : null}
      {ready ? (
      <Split>
        <Facts>
          <Term>Email</Term>
          <Value>
            <a href={'mailto:' + person.email}>{person.email}</a>
          </Value>
          <Term>Phone</Term>
          <Value>{person.phone}</Value>
          <Term>Office</Term>
          <Value>
            {person.office}
            {', '}
            {person.campus}
            {' campus'}
          </Value>
          <Term>Faculty page</Term>
          <Value>
            <a href={person.links.faculty}>SFU profile</a>
          </Value>
        </Facts>
        <Form onSubmit={submit}>
          <Label>
            Name
            <Field
              name="name"
              value={form.name}
              onChange={update}
              autoComplete="name"
              required
            />
            {errors.name ? <ErrorText>{errors.name}</ErrorText> : null}
          </Label>
          <Label>
            Email
            <Field
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              autoComplete="email"
              required
            />
            {errors.email ? (
              <ErrorText>{errors.email}</ErrorText>
            ) : null}
          </Label>
          <Label>
            Message
            <Area
              name="message"
              value={form.message}
              onChange={update}
              required
              minLength={10}
            />
            {errors.message ? (
              <ErrorText>{errors.message}</ErrorText>
            ) : null}
          </Label>
          <Trap aria-hidden="true">
            <label>
              Company
              <input
                name="company"
                value={form.company}
                onChange={update}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </Trap>
          {errors.form ? <ErrorText>{errors.form}</ErrorText> : null}
          {sent ? (
            <Success>
              {hosted
                ? 'Your email app should open with this message.'
                : 'Message saved. Thank you.'}
            </Success>
          ) : null}
          <Button type="submit" disabled={sending}>
            {buttonLabel(sending)}
          </Button>
        </Form>
      </Split>
      ) : null}
      </Page>
    </>
  );
}
